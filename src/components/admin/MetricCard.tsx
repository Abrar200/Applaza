import React, { memo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: 'cyan' | 'pink' | 'purple' | 'green';
}

const colorClasses = {
  cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400',
  pink: 'from-pink-500/20 to-pink-500/5 border-pink-500/30 text-pink-400',
  purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-400',
  green: 'from-green-500/20 to-green-500/5 border-green-500/30 text-green-400'
};

// Memoize to prevent unnecessary re-renders
const MetricCard = memo(({ title, value, change, icon, color }: MetricCardProps) => {
  const isPositive = change >= 0;
  
  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-6 hover:scale-105 transition-transform`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-500/10`}>
          {icon}
        </div>
        <div className="flex items-center gap-1 text-sm">
          {isPositive ? <TrendingUp className="w-4 h-4 text-green-400" /> : <TrendingDown className="w-4 h-4 text-red-400" />}
          <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
            {isPositive ? '+' : ''}{change}%
          </span>
        </div>
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
});

MetricCard.displayName = 'MetricCard';

export default MetricCard;
