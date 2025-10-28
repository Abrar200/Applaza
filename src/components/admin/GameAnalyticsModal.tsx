import React from 'react';
import { X, TrendingUp, Users, Trophy, DollarSign } from 'lucide-react';

interface GameAnalyticsModalProps {
  game: { id: number; name: string; plays: number; prizes: number; active: boolean };
  onClose: () => void;
}

export default function GameAnalyticsModal({ game, onClose }: GameAnalyticsModalProps) {
  const analytics = {
    totalPlays: game.plays,
    uniquePlayers: Math.floor(game.plays * 0.6),
    prizesAwarded: game.prizes,
    totalPrizeValue: game.prizes * 12.5,
    avgPlayTime: '2m 34s',
    winRate: ((game.prizes / game.plays) * 100).toFixed(1),
    peakHour: '7-8 PM',
    topPrize: '$100 Voucher',
  };

  const dailyStats = [
    { day: 'Monday', plays: 156, wins: 42 },
    { day: 'Tuesday', plays: 189, wins: 51 },
    { day: 'Wednesday', plays: 203, wins: 58 },
    { day: 'Thursday', plays: 178, wins: 47 },
    { day: 'Friday', plays: 234, wins: 67 },
    { day: 'Saturday', plays: 289, wins: 89 },
    { day: 'Sunday', plays: 267, wins: 78 },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{game.name} Analytics</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-500/30">
            <TrendingUp className="w-6 h-6 text-purple-400 mb-2" />
            <div className="text-2xl font-bold text-white">{analytics.totalPlays}</div>
            <div className="text-sm text-gray-400">Total Plays</div>
          </div>
          <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg p-4 border border-cyan-500/30">
            <Users className="w-6 h-6 text-cyan-400 mb-2" />
            <div className="text-2xl font-bold text-white">{analytics.uniquePlayers}</div>
            <div className="text-sm text-gray-400">Unique Players</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg p-4 border border-yellow-500/30">
            <Trophy className="w-6 h-6 text-yellow-400 mb-2" />
            <div className="text-2xl font-bold text-white">{analytics.prizesAwarded}</div>
            <div className="text-sm text-gray-400">Prizes Won</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg p-4 border border-green-500/30">
            <DollarSign className="w-6 h-6 text-green-400 mb-2" />
            <div className="text-2xl font-bold text-white">${analytics.totalPrizeValue.toFixed(0)}</div>
            <div className="text-sm text-gray-400">Prize Value</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Performance Metrics</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Win Rate</span>
                <span className="text-white font-semibold">{analytics.winRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avg Play Time</span>
                <span className="text-white font-semibold">{analytics.avgPlayTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Peak Hour</span>
                <span className="text-white font-semibold">{analytics.peakHour}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Top Prize</span>
                <span className="text-white font-semibold">{analytics.topPrize}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Weekly Breakdown</h3>
            <div className="space-y-2">
              {dailyStats.map(stat => (
                <div key={stat.day} className="flex justify-between text-sm">
                  <span className="text-gray-400">{stat.day}</span>
                  <span className="text-white">{stat.plays} plays • {stat.wins} wins</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
}
