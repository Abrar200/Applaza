import { useEffect, useState } from 'react';
import { useVendorAuth } from '@/contexts/VendorAuthContext';
import { supabase } from '@/lib/supabase';
import { Package, ShoppingBag, Star, DollarSign, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface Stats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  totalRevenue: number;
  avgRating: number;
}

export default function VendorDashboard() {
  const { brand } = useVendorAuth();
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0, activeProducts: 0, totalOrders: 0, totalRevenue: 0, avgRating: 0,
  });
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!brand) return;
    fetchData();
  }, [brand]);

  const fetchData = async () => {
    setLoading(true);
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('brand_id', brand!.id)
      .order('created_at', { ascending: false });

    if (products) {
      const active = products.filter(p => p.status === 'active');
      const avgRating = products.length
        ? products.reduce((acc, p) => acc + (p.avg_rating || 0), 0) / products.length
        : 0;
      setStats({
        totalProducts: products.length,
        activeProducts: active.length,
        totalOrders: 0,
        totalRevenue: 0,
        avgRating: Number(avgRating.toFixed(1)),
      });
      setRecentProducts(products.slice(0, 5));
    }
    setLoading(false);
  };

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts, icon: Package, colorClass: 'from-violet-500/20 to-violet-500/5 border-violet-500/30', iconColor: 'text-violet-400', sub: `${stats.activeProducts} active` },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, colorClass: 'from-indigo-500/20 to-indigo-500/5 border-indigo-500/30', iconColor: 'text-indigo-400', sub: 'All time' },
    { label: 'Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, colorClass: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30', iconColor: 'text-emerald-400', sub: 'All time' },
    { label: 'Avg Rating', value: stats.avgRating || '—', icon: Star, colorClass: 'from-amber-500/20 to-amber-500/5 border-amber-500/30', iconColor: 'text-amber-400', sub: 'Across products' },
  ];

  // Store health items — only show real, actionable statuses
  const healthItems = [
    {
      label: 'Account Status',
      ok: brand?.status === 'active',
      pending: brand?.status === 'pending',
      value: brand?.status === 'active' ? 'Active' : brand?.status === 'pending' ? 'Awaiting approval' : 'Suspended',
    },
    {
      label: 'Stripe Payments',
      ok: brand?.stripe_onboarding_complete === true,
      pending: false,
      value: brand?.stripe_onboarding_complete ? 'Connected' : 'Not connected',
      link: !brand?.stripe_onboarding_complete ? '/vendor/stripe' : undefined,
      linkLabel: 'Set up →',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Sora', sans-serif" }}>
          Welcome back{brand?.name ? `, ${brand.name}` : ''}
        </h1>
        <p className="text-gray-500">Here's what's happening with your store today.</p>
      </div>

      {/* Alerts */}
      {brand?.status === 'pending' && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-300 font-medium text-sm">Account pending approval</p>
            <p className="text-amber-400/60 text-sm mt-0.5">
              An Applaza admin will review and activate your account shortly. You can set up your products in the meantime.
            </p>
          </div>
        </div>
      )}

      {!brand?.stripe_onboarding_complete && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-300 font-medium text-sm">Stripe setup required</p>
            <p className="text-amber-400/60 text-sm mt-0.5">
              Complete your Stripe onboarding to start receiving payments.{' '}
              <a href="/vendor/stripe" className="underline underline-offset-2 hover:text-amber-300">Set it up now →</a>
            </p>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`bg-gradient-to-br ${card.colorClass} border rounded-2xl p-5`}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-400 text-sm">{card.label}</p>
                <Icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <p className="text-3xl font-bold text-white mb-1">{loading ? '—' : card.value}</p>
              <p className="text-gray-600 text-sm">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Recent products */}
      <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-white font-semibold">Recent Products</h2>
          <span className="text-gray-500 text-sm">{stats.totalProducts} total</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-600">Loading...</div>
        ) : recentProducts.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No products yet</p>
            <p className="text-gray-600 text-sm mt-1">Head to Products to add your first listing.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {recentProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/3 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{p.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">${p.price}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  p.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                  p.status === 'draft' ? 'bg-gray-500/10 text-gray-400' :
                  'bg-red-500/10 text-red-400'
                }`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Store health — only real statuses, no misleading "Verification" */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-4">Store Health</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {healthItems.map((item) => (
            <div key={item.label} className="bg-white/3 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs mb-1">{item.label}</p>
                <div className="flex items-center gap-2">
                  {item.ok ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : item.pending ? (
                    <Clock className="w-4 h-4 text-amber-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-gray-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    item.ok ? 'text-emerald-400' : item.pending ? 'text-amber-400' : 'text-gray-400'
                  }`}>
                    {item.value}
                  </span>
                </div>
              </div>
              {item.link && (
                <a href={item.link} className="text-violet-400 hover:text-violet-300 text-xs underline underline-offset-2">
                  {item.linkLabel}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}