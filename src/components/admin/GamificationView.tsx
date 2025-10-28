import React, { useState } from 'react';
import { Gamepad2, Trophy, Gift, TrendingUp } from 'lucide-react';
import GameConfigModal from './GameConfigModal';
import GameAnalyticsModal from './GameAnalyticsModal';

const games = [
  { id: 1, name: 'Plaza Players', plays: 1234, prizes: 456, active: true },
  { id: 2, name: 'SnApplaza', plays: 892, prizes: 234, active: true },
  { id: 3, name: 'Plaza Playwheel', plays: 2341, prizes: 789, active: true },
];

export default function GamificationView() {
  const [configModal, setConfigModal] = useState<{ id: number; name: string; plays: number; prizes: number; active: boolean } | null>(null);
  const [analyticsModal, setAnalyticsModal] = useState<{ id: number; name: string; plays: number; prizes: number; active: boolean } | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Gamification</h1>
        <p className="text-gray-400">Manage games, prizes, and player engagement</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
          <Gamepad2 className="w-8 h-8 text-purple-400 mb-3" />
          <div className="text-3xl font-bold text-white mb-1">4,467</div>
          <div className="text-gray-400">Total Plays</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-yellow-500/30">
          <Trophy className="w-8 h-8 text-yellow-400 mb-3" />
          <div className="text-3xl font-bold text-white mb-1">1,479</div>
          <div className="text-gray-400">Prizes Won</div>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30">
          <Gift className="w-8 h-8 text-green-400 mb-3" />
          <div className="text-3xl font-bold text-white mb-1">$8.2K</div>
          <div className="text-gray-400">Prize Value</div>
        </div>
        <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-6 border border-cyan-500/30">
          <TrendingUp className="w-8 h-8 text-cyan-400 mb-3" />
          <div className="text-3xl font-bold text-white mb-1">+23%</div>
          <div className="text-gray-400">Engagement</div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Active Games</h2>
        <div className="space-y-4">
          {games.map(game => (
            <div key={game.id} className="bg-gray-800/50 rounded-lg p-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{game.name}</h3>
                <p className="text-gray-400 text-sm">{game.plays} plays • {game.prizes} prizes awarded</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setConfigModal(game)}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold"
                >
                  Configure
                </button>
                <button 
                  onClick={() => setAnalyticsModal(game)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold"
                >
                  Analytics
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {configModal && (
        <GameConfigModal 
          game={configModal} 
          onClose={() => setConfigModal(null)} 
        />
      )}

      {analyticsModal && (
        <GameAnalyticsModal 
          game={analyticsModal} 
          onClose={() => setAnalyticsModal(null)} 
        />
      )}
    </div>
  );
}

