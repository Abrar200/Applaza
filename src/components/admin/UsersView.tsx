import { useState, useEffect, useMemo } from 'react';
import { Search, Download, RefreshCw, Shield, Store, User, Ban, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface AppUser {
  id: string;
  email: string;
  full_name: string | null;
  brand_name: string | null;
  role: string | null;
  derived_role: 'admin' | 'vendor' | 'customer';
  brand_id: string | null;
  vendor_brand_name: string | null;
  brand_status: string | null;
  stripe_complete: boolean | null;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
}

const ROLE_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  admin:    { label: 'Admin',    color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',       icon: Shield },
  vendor:   { label: 'Vendor',   color: 'text-violet-400 bg-violet-500/10 border-violet-500/20', icon: Store  },
  customer: { label: 'Customer', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',        icon: User   },
};

export default function UsersView() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setFetchError(null);

    const { data, error } = await supabase
      .from('admin_users_view')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setFetchError(error.message);
      toast.error('Failed to load users: ' + error.message);
    } else {
      setUsers(data as AppUser[] || []);
    }
    setLoading(false);
  };

  const filtered = useMemo(() => users.filter(u => {
    const matchSearch =
      (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.vendor_brand_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === 'all' || u.derived_role === roleFilter;
    return matchSearch && matchRole;
  }), [users, searchTerm, roleFilter]);

  const counts = {
    all: users.length,
    admin: users.filter(u => u.derived_role === 'admin').length,
    vendor: users.filter(u => u.derived_role === 'vendor').length,
    customer: users.filter(u => u.derived_role === 'customer').length,
  };

  const handleExport = () => {
    const rows = [
      ['Email', 'Name', 'Role', 'Brand', 'Brand Status', 'Joined', 'Last Sign In'].join(','),
      ...filtered.map(u => [
        u.email,
        u.full_name || u.brand_name || '',
        u.derived_role,
        u.vendor_brand_name || '',
        u.brand_status || '',
        new Date(u.created_at).toLocaleDateString(),
        u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : 'Never',
      ].join(',')),
    ].join('\n');
    const blob = new Blob([rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Users</h1>
          <p className="text-gray-400">All accounts across customers, vendors, and admins</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchUsers} disabled={loading}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 px-4 py-2 rounded-xl text-sm transition-all">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button onClick={handleExport}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 px-4 py-2 rounded-xl text-sm transition-all">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Error */}
      {fetchError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
          <strong>Error:</strong> {fetchError}
          <p className="text-red-400/60 text-xs mt-1">Make sure you ran <code>admin-fixes.sql</code> in Supabase SQL Editor.</p>
        </div>
      )}

      {/* Role tabs */}
      <div className="flex gap-3 flex-wrap">
        {(['all', 'admin', 'vendor', 'customer'] as const).map(r => {
          const cfg = r === 'all' ? null : ROLE_CONFIG[r];
          const RoleIcon = cfg?.icon;
          return (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                roleFilter === r
                  ? 'bg-cyan-500 text-white border-cyan-500'
                  : 'bg-gray-900 border-gray-700 text-gray-400 hover:text-white'
              }`}>
              {RoleIcon && <RoleIcon className="w-3.5 h-3.5" />}
              {r.charAt(0).toUpperCase() + r.slice(1)}
              <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${roleFilter === r ? 'bg-white/20' : 'bg-gray-700'}`}>
                {counts[r]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
        <input type="text" placeholder="Search by email, name or brand..." value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500" />
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center gap-3 text-gray-500">
            <RefreshCw className="w-6 h-6 animate-spin" />
            Loading users...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-gray-400 font-medium">No users found</p>
            <p className="text-gray-600 text-sm mt-1">Try adjusting your search or filter.</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50 border-b border-gray-800">
                  <tr>
                    {['User', 'Role', 'Brand / Details', 'Email Verified', 'Joined', 'Last Sign In'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filtered.map(user => {
                    const roleCfg = ROLE_CONFIG[user.derived_role] || ROLE_CONFIG.customer;
                    const RoleIcon = roleCfg.icon;
                    return (
                      <tr key={user.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 text-sm font-semibold flex-shrink-0">
                              {(user.full_name || user.vendor_brand_name || user.email || '?').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-white text-sm font-medium">
                                {user.full_name || user.vendor_brand_name || '—'}
                              </p>
                              <p className="text-gray-500 text-xs">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${roleCfg.color}`}>
                            <RoleIcon className="w-3 h-3" />
                            {roleCfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {user.derived_role === 'vendor' && user.vendor_brand_name ? (
                            <div>
                              <p className="text-white text-sm font-medium">{user.vendor_brand_name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className={`text-xs ${
                                  user.brand_status === 'active' ? 'text-emerald-400' :
                                  user.brand_status === 'pending' ? 'text-amber-400' : 'text-red-400'
                                }`}>
                                  {user.brand_status || 'pending'}
                                </span>
                                {user.stripe_complete && (
                                  <span className="text-xs text-emerald-400 flex items-center gap-0.5">
                                    <CheckCircle className="w-3 h-3" /> Stripe
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : user.derived_role === 'admin' ? (
                            <span className="text-rose-400/60 text-xs">Applaza Admin</span>
                          ) : (
                            <span className="text-gray-600 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {user.email_confirmed_at
                            ? <span className="flex items-center gap-1.5 text-emerald-400 text-xs"><CheckCircle className="w-3.5 h-3.5" />Verified</span>
                            : <span className="flex items-center gap-1.5 text-amber-400 text-xs"><Ban className="w-3.5 h-3.5" />Unverified</span>
                          }
                        </td>
                        <td className="px-5 py-4 text-gray-400 text-sm">{formatDate(user.created_at)}</td>
                        <td className="px-5 py-4 text-gray-500 text-sm">{formatDate(user.last_sign_in_at)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile card view */}
            <div className="lg:hidden divide-y divide-gray-800">
              {filtered.map(user => {
                const roleCfg = ROLE_CONFIG[user.derived_role] || ROLE_CONFIG.customer;
                const RoleIcon = roleCfg.icon;
                return (
                  <div key={user.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-white font-medium text-sm">{user.full_name || user.vendor_brand_name || '—'}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{user.email}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${roleCfg.color}`}>
                        <RoleIcon className="w-3 h-3" />
                        {roleCfg.label}
                      </span>
                    </div>
                    {user.derived_role === 'vendor' && user.vendor_brand_name && (
                      <div className="bg-gray-800 rounded-lg px-3 py-2 text-xs">
                        <span className="text-gray-400">Brand: </span>
                        <span className="text-white font-medium">{user.vendor_brand_name}</span>
                        <span className={`ml-2 ${user.brand_status === 'active' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          ({user.brand_status})
                        </span>
                      </div>
                    )}
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>Joined: <span className="text-gray-300">{formatDate(user.created_at)}</span></span>
                      <span>Last seen: <span className="text-gray-300">{formatDate(user.last_sign_in_at)}</span></span>
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