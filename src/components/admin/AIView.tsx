import React from 'react';
import { Brain, TrendingUp, Eye, ShoppingBag, Mic } from 'lucide-react';

const insights = [
  { product: 'iPhone 15 Pro', trend: 'Rising', score: 92, prediction: '+34% sales' },
  { product: 'Nike Air Max', trend: 'Stable', score: 78, prediction: '+12% sales' },
  { product: 'Gaming Laptop', trend: 'Rising', score: 85, prediction: '+28% sales' },
];

const voiceCommands = [
  { query: 'Find gym shoes under $100', results: 12, timestamp: '2 mins ago' },
  { query: 'Show me gaming laptops', results: 8, timestamp: '5 mins ago' },
  { query: 'Best wireless headphones', results: 15, timestamp: '8 mins ago' },
];

export default function AIView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">AI Insights</h1>
        <p className="text-gray-400">AI-powered analytics and recommendations</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
          <Brain className="w-8 h-8 text-purple-400 mb-3" />
          <div className="text-3xl font-bold text-white mb-1">94%</div>
          <div className="text-gray-400">AI Accuracy</div>
        </div>
        <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-6 border border-cyan-500/30">
          <Eye className="w-8 h-8 text-cyan-400 mb-3" />
          <div className="text-3xl font-bold text-white mb-1">12.4K</div>
          <div className="text-gray-400">Recommendations</div>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30">
          <ShoppingBag className="w-8 h-8 text-green-400 mb-3" />
          <div className="text-3xl font-bold text-white mb-1">+45%</div>
          <div className="text-gray-400">Conversion Lift</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-orange-500/30">
          <Mic className="w-8 h-8 text-orange-400 mb-3" />
          <div className="text-3xl font-bold text-white mb-1">892</div>
          <div className="text-gray-400">Voice Searches</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Trending Products</h2>
          <div className="space-y-3">
            {insights.map((item, i) => (
              <div key={i} className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-semibold">{item.product}</h3>
                  <span className="text-green-400 text-sm font-semibold">{item.prediction}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-400">Score: <span className="text-cyan-400 font-semibold">{item.score}</span></span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    item.trend === 'Rising' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {item.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Voice Commands</h2>
          <div className="space-y-3">
            {voiceCommands.map((cmd, i) => (
              <div key={i} className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-white font-medium">"{cmd.query}"</p>
                  <span className="text-gray-400 text-xs">{cmd.timestamp}</span>
                </div>
                <p className="text-gray-400 text-sm">{cmd.results} results returned</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
