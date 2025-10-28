import React from 'react';
import { CheckCircle, Clock, XCircle, DollarSign, Video, TrendingUp } from 'lucide-react';

interface CreatorCardProps {
  avatar: string;
  name: string;
  username: string;
  status: 'verified' | 'pending' | 'rejected';
  videos: number;
  sales: string;
  commission: string;
  onApprove?: () => void;
  onReject?: () => void;
}

export default function CreatorCard({ avatar, name, username, status, videos, sales, commission, onApprove, onReject }: CreatorCardProps) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 hover:border-purple-500/50 transition-all">
      <div className="flex items-start gap-4 mb-4">
        <img src={avatar} alt={name} className="w-16 h-16 rounded-full object-cover" />
        <div className="flex-1">
          <h3 className="text-white font-semibold">{name}</h3>
          <p className="text-gray-400 text-sm">@{username}</p>
          <div className="mt-2">
            {status === 'verified' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold">
                <CheckCircle className="w-3 h-3" /> Verified
              </span>
            )}
            {status === 'pending' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-semibold">
                <Clock className="w-3 h-3" /> Pending
              </span>
            )}
            {status === 'rejected' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-semibold">
                <XCircle className="w-3 h-3" /> Rejected
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-gray-400 text-xs mb-1">Videos</p>
          <p className="text-white font-semibold flex items-center gap-1">
            <Video className="w-4 h-4 text-cyan-400" />
            {videos}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-xs mb-1">Sales</p>
          <p className="text-white font-semibold flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-green-400" />
            {sales}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-xs mb-1">Commission</p>
          <p className="text-white font-semibold flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-pink-400" />
            {commission}
          </p>
        </div>
      </div>
      {status === 'pending' && (
        <div className="flex gap-2">
          <button onClick={onApprove} className="flex-1 bg-green-500/20 text-green-400 py-2 rounded-lg hover:bg-green-500/30 transition-colors text-sm font-semibold">
            Approve
          </button>
          <button onClick={onReject} className="flex-1 bg-red-500/20 text-red-400 py-2 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-semibold">
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
