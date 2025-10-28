import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

interface GameConfigModalProps {
  game: { id: number; name: string; plays: number; prizes: number; active: boolean };
  onClose: () => void;
}

export default function GameConfigModal({ game, onClose }: GameConfigModalProps) {
  const [config, setConfig] = useState({
    active: game.active,
    maxPlaysPerDay: 5,
    prizePool: 1000,
    winProbability: 25,
    minPrizeValue: 5,
    maxPrizeValue: 100,
  });

  const handleSave = () => {
    console.log('Saving config:', config);
    alert(`Configuration saved for ${game.name}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Configure {game.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Game Status</label>
            <select 
              value={config.active ? 'active' : 'inactive'}
              onChange={(e) => setConfig({...config, active: e.target.value === 'active'})}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Max Plays Per Day</label>
            <input 
              type="number" 
              value={config.maxPlaysPerDay}
              onChange={(e) => setConfig({...config, maxPlaysPerDay: parseInt(e.target.value)})}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Prize Pool ($)</label>
            <input 
              type="number" 
              value={config.prizePool}
              onChange={(e) => setConfig({...config, prizePool: parseInt(e.target.value)})}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Win Probability (%)</label>
            <input 
              type="number" 
              value={config.winProbability}
              onChange={(e) => setConfig({...config, winProbability: parseInt(e.target.value)})}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Min Prize Value ($)</label>
              <input 
                type="number" 
                value={config.minPrizeValue}
                onChange={(e) => setConfig({...config, minPrizeValue: parseInt(e.target.value)})}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Max Prize Value ($)</label>
              <input 
                type="number" 
                value={config.maxPrizeValue}
                onChange={(e) => setConfig({...config, maxPrizeValue: parseInt(e.target.value)})}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              onClick={handleSave}
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Configuration
            </button>
            <button 
              onClick={onClose}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
