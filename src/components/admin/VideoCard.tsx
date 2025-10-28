import React, { memo } from 'react';
import { Play, Eye, Heart, ShoppingCart, CheckCircle, XCircle, Star } from 'lucide-react';

interface VideoCardProps {
  thumbnail: string;
  creator: string;
  views: string;
  likes: string;
  sales: string;
  status: 'pending' | 'approved' | 'flagged';
  onApprove: () => void;
  onFlag: () => void;
  onFeature: () => void;
}

// Memoize component and add lazy loading
const VideoCard = memo(({ thumbnail, creator, views, likes, sales, status, onApprove, onFlag, onFeature }: VideoCardProps) => {
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-cyan-500/50 transition-all group">
      <div className="relative aspect-[9/16] bg-gray-800">
        <img src={thumbnail} alt="Video" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play className="w-12 h-12 text-white" />
        </div>
        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${
          status === 'approved' ? 'bg-green-500' : status === 'flagged' ? 'bg-red-500' : 'bg-yellow-500'
        }`}>
          {status.toUpperCase()}
        </div>
      </div>
      <div className="p-4">
        <p className="text-white font-semibold mb-2">{creator}</p>
        <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{views}</span>
          <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{likes}</span>
          <span className="flex items-center gap-1"><ShoppingCart className="w-3 h-3" />{sales}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={onApprove} className="flex-1 bg-green-500/20 text-green-400 py-2 rounded-lg hover:bg-green-500/30 transition-colors text-xs">
            <CheckCircle className="w-4 h-4 inline" />
          </button>
          <button onClick={onFlag} className="flex-1 bg-red-500/20 text-red-400 py-2 rounded-lg hover:bg-red-500/30 transition-colors text-xs">
            <XCircle className="w-4 h-4 inline" />
          </button>
          <button onClick={onFeature} className="flex-1 bg-cyan-500/20 text-cyan-400 py-2 rounded-lg hover:bg-cyan-500/30 transition-colors text-xs">
            <Star className="w-4 h-4 inline" />
          </button>
        </div>
      </div>
    </div>
  );
});

VideoCard.displayName = 'VideoCard';

export default VideoCard;
