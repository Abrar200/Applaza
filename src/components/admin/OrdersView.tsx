import React, { useState } from 'react';
import OrderTable from './OrderTable';
import { Download, Filter, Search } from 'lucide-react';

export default function OrdersView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Orders & Deliveries</h1>
          <p className="text-gray-400">Track orders with DoorDash and Uber integration</p>
        </div>
        <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-12 pr-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
        <select className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none">
          <option value="all">All Delivery</option>
          <option value="doordash">DoorDash</option>
          <option value="uber">Uber Direct</option>
          <option value="standard">Standard</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-2">Total Orders</p>
          <p className="text-3xl font-bold text-white">18,492</p>
          <p className="text-green-400 text-sm mt-2">+8.3% from last week</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-2">Pending</p>
          <p className="text-3xl font-bold text-yellow-400">234</p>
          <p className="text-gray-400 text-sm mt-2">Awaiting processing</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-2">In Transit</p>
          <p className="text-3xl font-bold text-blue-400">567</p>
          <p className="text-gray-400 text-sm mt-2">Out for delivery</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-2">Delivered</p>
          <p className="text-3xl font-bold text-green-400">17,691</p>
          <p className="text-gray-400 text-sm mt-2">Successfully completed</p>
        </div>
      </div>

      <OrderTable />
    </div>
  );
}
