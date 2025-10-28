import React from 'react';
import { DollarSign, TrendingUp, CreditCard, Download } from 'lucide-react';

const payouts = [
  { id: 1, creator: 'Sarah Johnson', amount: '$2,450', commission: '$367.50', status: 'completed', date: '2024-10-20' },
  { id: 2, creator: 'Mike Chen', amount: '$3,820', commission: '$687.60', status: 'pending', date: '2024-10-25' },
  { id: 3, creator: 'Lisa Wang', amount: '$5,270', commission: '$1,054', status: 'completed', date: '2024-10-18' },
  { id: 4, creator: 'Alex Martinez', amount: '$1,890', commission: '$226.80', status: 'processing', date: '2024-10-24' },
];

export default function PaymentsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Payments & Payouts</h1>
          <p className="text-gray-400">Manage Stripe Connect and creator commissions</p>
        </div>
        <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <p className="text-gray-400 text-sm">Total Revenue</p>
          </div>
          <p className="text-3xl font-bold text-white">$2.4M</p>
          <p className="text-green-400 text-sm mt-2">+12.5% this month</p>
        </div>
        <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <p className="text-gray-400 text-sm">Commissions Paid</p>
          </div>
          <p className="text-3xl font-bold text-white">$336K</p>
          <p className="text-cyan-400 text-sm mt-2">14% of revenue</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-5 h-5 text-yellow-400" />
            <p className="text-gray-400 text-sm">Pending Payouts</p>
          </div>
          <p className="text-3xl font-bold text-white">$45.2K</p>
          <p className="text-gray-400 text-sm mt-2">12 creators</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-purple-400" />
            <p className="text-gray-400 text-sm">Avg Commission</p>
          </div>
          <p className="text-3xl font-bold text-white">15.2%</p>
          <p className="text-gray-400 text-sm mt-2">Platform average</p>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Recent Payouts</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="text-left p-4 text-gray-400 font-semibold text-sm">Creator</th>
                <th className="text-left p-4 text-gray-400 font-semibold text-sm">Sales Amount</th>
                <th className="text-left p-4 text-gray-400 font-semibold text-sm">Commission</th>
                <th className="text-left p-4 text-gray-400 font-semibold text-sm">Status</th>
                <th className="text-left p-4 text-gray-400 font-semibold text-sm">Date</th>
                <th className="text-left p-4 text-gray-400 font-semibold text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map(payout => (
                <tr key={payout.id} className="border-t border-gray-800 hover:bg-gray-800/30">
                  <td className="p-4 text-white font-semibold">{payout.creator}</td>
                  <td className="p-4 text-white">{payout.amount}</td>
                  <td className="p-4 text-green-400 font-semibold">{payout.commission}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      payout.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      payout.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {payout.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400">{payout.date}</td>
                  <td className="p-4">
                    <button className="text-cyan-400 hover:underline text-sm">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
