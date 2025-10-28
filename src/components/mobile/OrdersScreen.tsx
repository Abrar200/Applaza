import { ChevronLeft, MoreVertical, Truck, Package, Clock } from 'lucide-react';
import { useState } from 'react';

const orders = [
  {
    id: '12541',
    title: 'Nomad Strap for Apple Watch Series 9, Bellroy Leather Case for...',
    price: 290.00,
    image: 'https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1761584245912_4a9a25d0.png',
    brands: ['Apple', 'Samsung'],
    delivery: '16th April',
    status: 'En Route',
    statusIcon: Truck
  },
  {
    id: '12541',
    title: 'PolarPro Split Warp lens, Bullstrap Leather Case for iPhone 16 Pro',
    price: 245.00,
    image: 'https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1761584247126_d4c672dd.png',
    brands: ['Apple', 'Samsung'],
    delivery: '16th April',
    status: 'Dispatched',
    statusIcon: Package
  },
  {
    id: '12541',
    title: 'Yellow Strap for Apple Watch Ultra, Forest Green Strap for App...',
    price: 110.00,
    image: 'https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1761584248372_ce4d8720.png',
    brands: ['Nomad'],
    delivery: '16th April',
    status: 'Processing',
    statusIcon: Clock
  }
];

export const OrdersScreen = ({ onBack }: { onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<'active' | 'previous'>('active');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-6 flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">Order # 12542</h1>
        <button className="ml-auto">
          <MoreVertical className="w-6 h-6" />
        </button>
      </div>

      <div className="p-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-3 rounded-2xl font-semibold ${
              activeTab === 'active' ? 'bg-[#1a1f36] text-white' : 'bg-white text-gray-600'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab('previous')}
            className={`flex-1 py-3 rounded-2xl font-semibold ${
              activeTab === 'previous' ? 'bg-[#1a1f36] text-white' : 'bg-white text-gray-600'
            }`}
          >
            Previous
          </button>
        </div>

        <div className="space-y-4">
          {orders.map((order, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4">
              <div className="flex gap-4 mb-4">
                <img src={order.image} alt={order.title} className="w-24 h-24 rounded-xl object-cover" />
                
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">Order # {order.id}</span>
                    <span className="font-bold">${order.price.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{order.title}</p>
                  <div className="flex gap-2">
                    {order.brands.map((brand, i) => (
                      <span key={i} className="text-xs font-semibold">{brand}{i < order.brands.length - 1 ? ',' : ''}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Est. Delivery: {order.delivery}</span>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  order.status === 'En Route' ? 'bg-blue-100 text-blue-700' :
                  order.status === 'Dispatched' ? 'bg-orange-100 text-orange-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  <order.statusIcon className="w-4 h-4" />
                  <span className="text-sm font-semibold">{order.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
