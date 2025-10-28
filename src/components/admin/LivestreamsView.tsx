import React from 'react';
import { Radio, Calendar, Plus, Eye, DollarSign, Users } from 'lucide-react';

const livestreams = [
  { id: 1, title: 'Fashion Week Special', creator: 'Sarah Johnson', status: 'live', viewers: 2400, sales: '$12.5K', scheduled: 'Now' },
  { id: 2, title: 'Tech Gadgets Showcase', creator: 'Mike Chen', status: 'scheduled', viewers: 0, sales: '$0', scheduled: 'Today 6:00 PM' },
  { id: 3, title: 'Sneaker Drop Event', creator: 'Alex Martinez', status: 'ended', viewers: 5600, sales: '$28.3K', scheduled: 'Yesterday' },
  { id: 4, title: 'Beauty Products Demo', creator: 'Emma Davis', status: 'scheduled', viewers: 0, sales: '$0', scheduled: 'Tomorrow 3:00 PM' },
];

export default function LivestreamsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Livestreams</h1>
          <p className="text-gray-400">Manage live shopping sessions</p>
        </div>
        <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Schedule Livestream
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-red-500/20 to-red-500/5 border border-red-500/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Radio className="w-5 h-5 text-red-400 animate-pulse" />
            <p className="text-red-400 font-semibold">Live Now</p>
          </div>
          <p className="text-3xl font-bold text-white">1</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            <p className="text-blue-400 font-semibold">Scheduled</p>
          </div>
          <p className="text-3xl font-bold text-white">2</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <p className="text-green-400 font-semibold">Total Sales</p>
          </div>
          <p className="text-3xl font-bold text-white">$40.8K</p>
        </div>
      </div>

      <div className="space-y-4">
        {livestreams.map(stream => (
          <div key={stream.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-pink-500/50 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">{stream.title}</h3>
                  {stream.status === 'live' && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Radio className="w-3 h-3 animate-pulse" />
                      LIVE
                    </span>
                  )}
                  {stream.status === 'scheduled' && (
                    <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
                      SCHEDULED
                    </span>
                  )}
                  {stream.status === 'ended' && (
                    <span className="bg-gray-500/20 text-gray-400 px-3 py-1 rounded-full text-xs font-bold">
                      ENDED
                    </span>
                  )}
                </div>
                <p className="text-gray-400 mb-4">by {stream.creator}</p>
                <div className="flex items-center gap-6 text-sm">
                  <span className="flex items-center gap-2 text-gray-300">
                    <Eye className="w-4 h-4" />
                    {stream.viewers.toLocaleString()} viewers
                  </span>
                  <span className="flex items-center gap-2 text-green-400">
                    <DollarSign className="w-4 h-4" />
                    {stream.sales} sales
                  </span>
                  <span className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {stream.scheduled}
                  </span>
                </div>
              </div>
              <button className="bg-cyan-500/20 text-cyan-400 px-6 py-2 rounded-lg hover:bg-cyan-500/30 transition-colors font-semibold">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
