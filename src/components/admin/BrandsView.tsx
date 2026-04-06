import { useState, useEffect, useRef } from "react";
import { Search, RefreshCw, CheckCircle, XCircle, BadgeCheck, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Brand {
  id: string;
  user_id: string;
  name: string;
  bio: string | null;
  logo_url: string | null;
  category: string | null;
  status: 'pending' | 'active' | 'suspended';
  verified: boolean;
  subscriber_count: number;
  stripe_onboarding_complete: boolean;
  created_at: string;
}

const STATUS_CONFIG = {
  active:    { label: 'Active',    bg: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-400' },
  pending:   { label: 'Pending',   bg: 'text-amber-400 bg-amber-500/10 border-amber-500/20',       dot: 'bg-amber-400'   },
  suspended: { label: 'Suspended', bg: 'text-red-400 bg-red-500/10 border-red-500/20',             dot: 'bg-red-400'     },
};

export default function BrandsView() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchBrands(); }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    setFetchError(null);
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setFetchError(error.message);
      toast.error('Failed to load brands: ' + error.message);
    } else {
      setBrands(data || []);
    }
    setLoading(false);
  };

  const updateStatus = async (brandId: string, newStatus: Brand['status']) => {
    setUpdatingId(brandId);
    setOpenDropdown(null);
    const { error } = await supabase.from('brands').update({ status: newStatus }).eq('id', brandId);
    if (error) { toast.error('Update failed: ' + error.message); }
    else {
      setBrands(prev => prev.map(b => b.id === brandId ? { ...b, status: newStatus } : b));
      toast.success(`Status set to ${newStatus}`);
    }
    setUpdatingId(null);
  };

  const toggleVerified = async (brand: Brand) => {
    setUpdatingId(brand.id);
    const { error } = await supabase.from('brands').update({ verified: !brand.verified }).eq('id', brand.id);
    if (error) { toast.error('Update failed: ' + error.message); }
    else {
      setBrands(prev => prev.map(b => b.id === brand.id ? { ...b, verified: !b.verified } : b));
      toast.success(brand.verified ? 'Verification removed' : 'Brand verified');
    }
    setUpdatingId(null);
  };

  const filtered = brands.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: brands.length,
    pending: brands.filter(b => b.status === 'pending').length,
    active: brands.filter(b => b.status === 'active').length,
    suspended: brands.filter(b => b.status === 'suspended').length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Brands</h1>
          <p className="text-gray-400">Approve and manage vendor brand accounts</p>
        </div>
        <button onClick={fetchBrands} disabled={loading}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 px-4 py-2 rounded-xl text-sm transition-all">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {fetchError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
          <strong>Error:</strong> {fetchError}
          <p className="text-red-400/60 text-xs mt-1">Make sure you ran <code>admin-fixes.sql</code> in Supabase SQL Editor.</p>
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        {(['all', 'pending', 'active', 'suspended'] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              statusFilter === s
                ? 'bg-cyan-500 text-white border-cyan-500'
                : 'bg-gray-900 border-gray-700 text-gray-400 hover:text-white'
            }`}>
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${statusFilter === s ? 'bg-white/20' : 'bg-gray-700'}`}>
              {counts[s]}
            </span>
          </button>
        ))}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
        <input type="text" placeholder="Search brands..." value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500" />
      </div>

      <div ref={containerRef} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center gap-3 text-gray-500">
            <RefreshCw className="w-6 h-6 animate-spin" />
            Loading brands...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-gray-400 font-medium text-lg">
              {brands.length === 0 ? 'No brands have signed up yet' : 'No brands match your filter'}
            </p>
            <p className="text-gray-600 text-sm mt-2">
              {brands.length === 0
                ? 'Vendors sign up at /vendor — their brands appear here automatically.'
                : 'Try clearing the search or changing the status filter.'}
            </p>
          </div>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_130px_170px] gap-4 px-6 py-3 border-b border-gray-800 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span>Brand</span><span>Category</span><span>Stripe</span>
              <span>Subscribers</span><span>Verified</span><span>Status</span>
            </div>
            <div className="divide-y divide-gray-800">
              {filtered.map(brand => {
                const cfg = STATUS_CONFIG[brand.status];
                const isUpdating = updatingId === brand.id;
                return (
                  <div key={brand.id} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_130px_170px] gap-4 items-center px-6 py-4 hover:bg-gray-800/30 transition-colors">

                    <div className="flex items-center gap-3">
                      {brand.logo_url
                        ? <img src={brand.logo_url} alt={brand.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                        : <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0 text-gray-400 font-bold text-sm">{brand.name.charAt(0).toUpperCase()}</div>
                      }
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-white text-sm font-semibold truncate">{brand.name}</p>
                          {brand.verified && <BadgeCheck className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />}
                        </div>
                        <p className="text-gray-700 text-xs font-mono mt-0.5">{new Date(brand.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <span className="text-gray-400 text-sm">{brand.category || '—'}</span>

                    {brand.stripe_onboarding_complete
                      ? <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium"><CheckCircle className="w-3.5 h-3.5" />Connected</span>
                      : <span className="flex items-center gap-1.5 text-gray-500 text-xs"><XCircle className="w-3.5 h-3.5" />Not set up</span>
                    }

                    <span className="text-gray-400 text-sm">{brand.subscriber_count.toLocaleString()}</span>

                    <button onClick={() => toggleVerified(brand)} disabled={isUpdating}
                      className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all w-fit ${
                        brand.verified
                          ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20 hover:bg-cyan-500/20'
                          : 'text-gray-500 bg-gray-800 border-gray-700 hover:border-cyan-500/30 hover:text-cyan-400'
                      }`}>
                      <BadgeCheck className="w-3.5 h-3.5" />
                      {brand.verified ? 'Verified' : 'Unverified'}
                    </button>

                    <div className="relative">
                      <button disabled={isUpdating}
                        onClick={e => { e.stopPropagation(); setOpenDropdown(openDropdown === brand.id ? null : brand.id); }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border w-full transition-all ${cfg.bg} ${isUpdating ? 'opacity-50' : 'cursor-pointer hover:opacity-80'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} flex-shrink-0`} />
                        {cfg.label}
                        <ChevronDown className="w-3 h-3 ml-auto" />
                      </button>

                      {openDropdown === brand.id && (
                        <div className="absolute right-0 top-full mt-1 w-36 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                          {(['active', 'pending', 'suspended'] as const).map(s => (
                            <button key={s} onClick={() => updateStatus(brand.id, s)} disabled={brand.status === s}
                              className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs transition-colors hover:bg-gray-800 ${brand.status === s ? 'opacity-40 cursor-default' : 'cursor-pointer'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[s].dot}`} />
                              <span className={STATUS_CONFIG[s].bg.split(' ')[0]}>{STATUS_CONFIG[s].label}</span>
                              {brand.status === s && <span className="ml-auto text-gray-600">current</span>}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}