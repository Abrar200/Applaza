import React, { useState } from 'react';
import { Users, TrendingUp, DollarSign, Search, Filter } from 'lucide-react';

const teams = [
  { id: 1, product: 'iPhone 15 Pro', members: 5, target: 10, discount: '15%', status: 'active', created: '2024-10-20' },
  { id: 2, product: 'Nike Air Max', members: 8, target: 8, discount: '20%', status: 'complete', created: '2024-10-19' },
  { id: 3, product: 'Sony Headphones', members: 3, target: 6, discount: '10%', status: 'active', created: '2024-10-21' },
  { id: 4, product: 'Gaming Laptop', members: 12, target: 15, discount: '25%', status: 'active', created: '2024-10-18' },
];

export default function WantTeamsView() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">WANT Teams</h1>
        <p className="text-gray-400">Manage group buying teams and discount tiers</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-6 border border-cyan-500/30">
          <Users className="w-8 h-8 text-cyan-400 mb-3" />
          <div className="text-3xl font-bold text-white mb-1">47</div>
          <div className="text-gray-400">Active Teams</div>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30">
          <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
          <div className="text-3xl font-bold text-white mb-1">234</div>
          <div className="text-gray-400">Total Members</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
          <DollarSign className="w-8 h-8 text-purple-400 mb-3" />
          <div className="text-3xl font-bold text-white mb-1">$12.4K</div>
          <div className="text-gray-400">Group Savings</div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search teams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-12 pr-4 py-3 text-white"
          />
        </div>
        <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold">
          Configure Discounts
        </button>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="text-left p-4 text-gray-400 font-semibold text-sm">Product</th>
              <th className="text-left p-4 text-gray-400 font-semibold text-sm">Members</th>
              <th className="text-left p-4 text-gray-400 font-semibold text-sm">Discount</th>
              <th className="text-left p-4 text-gray-400 font-semibold text-sm">Status</th>
              <th className="text-left p-4 text-gray-400 font-semibold text-sm">Created</th>
            </tr>
          </thead>
          <tbody>
            {teams.map(team => (
              <tr key={team.id} className="border-t border-gray-800 hover:bg-gray-800/30">
                <td className="p-4 text-white font-semibold">{team.product}</td>
                <td className="p-4 text-gray-300">{team.members}/{team.target}</td>
                <td className="p-4 text-green-400 font-semibold">{team.discount}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    team.status === 'complete' ? 'bg-green-500/20 text-green-400' : 'bg-cyan-500/20 text-cyan-400'
                  }`}>
                    {team.status}
                  </span>
                </td>
                <td className="p-4 text-gray-400">{team.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
