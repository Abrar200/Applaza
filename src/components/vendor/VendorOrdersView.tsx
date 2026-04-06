import { useState, useEffect } from 'react';
import { useVendorAuth } from '@/contexts/VendorAuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ShoppingBag, Search, Package, Truck, CheckCircle, Clock, Loader2, Filter } from 'lucide-react';

// Placeholder until the orders table is built via the checkout flow
// This will be replaced with real data once Phase 1 commerce is complete
export default function VendorOrdersView() {
  const { brand } = useVendorAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (brand) fetchOrders();
  }, [brand]);

  const fetchOrders = async () => {
    setLoading(true);
    // orders table will be created in Phase 1 (checkout flow)
    // For now, try to fetch; if table doesn't exist yet, show empty state
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items!inner(*, products!inner(brand_id))
        `)
        .eq('order_items.products.brand_id', brand!.id)
        .order('created_at', { ascending: false });

      if (!error) setOrders(data || []);
    } catch {
      // Table doesn't exist yet — silently show empty state
    }
    setLoading(false);
  };

  const statusConfig: Record<string, { label: string; color: string; Icon: any }> = {
    pending: { label: 'Pending', color: 'text-amber-400 bg-amber-500/10', Icon: Clock },
    processing: { label: 'Processing', color: 'text-blue-400 bg-blue-500/10', Icon: Package },
    shipped: { label: 'Shipped', color: 'text-indigo-400 bg-indigo-500/10', Icon: Truck },
    delivered: { label: 'Delivered', color: 'text-emerald-400 bg-emerald-500/10', Icon: CheckCircle },
  };

  const filteredOrders = orders.filter(o => {
    const matchSearch = o.id?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>Orders</h1>
          <p className="text-gray-500 text-sm mt-0.5">Track and manage customer orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/8 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/40"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/40 appearance-none cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      {/* Orders */}
      <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-600" /></div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center">
            <ShoppingBag className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">No orders yet</p>
            <p className="text-gray-600 text-sm mt-1 max-w-xs mx-auto">
              Orders will appear here once customers start purchasing your products.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredOrders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = status.Icon;
              return (
                <div key={order.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/2 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white text-sm font-medium font-mono">#{order.id.slice(0, 8).toUpperCase()}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm font-semibold">${order.total?.toFixed(2)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}