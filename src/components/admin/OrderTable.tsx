import React from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  product: string;
  amount: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  delivery: 'doordash' | 'uber' | 'standard';
  date: string;
}

const orders: Order[] = [
  { id: '#12847', customer: 'Sarah Johnson', product: 'Nike Air Max', amount: '$189.99', status: 'delivered', delivery: 'doordash', date: '2h ago' },
  { id: '#12846', customer: 'Mike Chen', product: 'iPhone 15 Pro', amount: '$999.00', status: 'shipped', delivery: 'uber', date: '5h ago' },
  { id: '#12845', customer: 'Emma Davis', product: 'Adidas Ultraboost', amount: '$180.00', status: 'processing', delivery: 'standard', date: '8h ago' },
  { id: '#12844', customer: 'James Wilson', product: 'Samsung Galaxy', amount: '$849.00', status: 'pending', delivery: 'doordash', date: '12h ago' },
];

const statusIcons = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle
};

export default function OrderTable() {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      {/* Mobile Card View */}
      <div className="block md:hidden">
        {orders.map(order => {
          const StatusIcon = statusIcons[order.status];
          return (
            <div key={order.id} className="p-4 border-b border-gray-800 last:border-0">
              <div className="flex justify-between items-start mb-2">
                <span className="text-cyan-400 font-mono text-sm font-semibold">{order.id}</span>
                <span className="text-gray-400 text-xs">{order.date}</span>
              </div>
              <p className="text-white font-medium mb-1">{order.customer}</p>
              <p className="text-gray-400 text-sm mb-2">{order.product}</p>
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">{order.amount}</span>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                  order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
                  order.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  <StatusIcon className="w-3 h-3" />
                  {order.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="text-left p-4 text-gray-400 font-semibold text-sm">Order ID</th>
              <th className="text-left p-4 text-gray-400 font-semibold text-sm">Customer</th>
              <th className="text-left p-4 text-gray-400 font-semibold text-sm">Product</th>
              <th className="text-left p-4 text-gray-400 font-semibold text-sm">Amount</th>
              <th className="text-left p-4 text-gray-400 font-semibold text-sm">Status</th>
              <th className="text-left p-4 text-gray-400 font-semibold text-sm">Delivery</th>
              <th className="text-left p-4 text-gray-400 font-semibold text-sm">Time</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => {
              const StatusIcon = statusIcons[order.status];
              return (
                <tr key={order.id} className="border-t border-gray-800 hover:bg-gray-800/30">
                  <td className="p-4 text-cyan-400 font-mono text-sm">{order.id}</td>
                  <td className="p-4 text-white">{order.customer}</td>
                  <td className="p-4 text-gray-300">{order.product}</td>
                  <td className="p-4 text-white font-semibold">{order.amount}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                      order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
                      order.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      <StatusIcon className="w-3 h-3" />
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-400 text-sm capitalize">{order.delivery}</span>
                  </td>
                  <td className="p-4 text-gray-400 text-sm">{order.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

