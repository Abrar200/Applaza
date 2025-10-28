import React, { useState } from 'react';
import CreatorCard from './CreatorCard';
import InviteCreatorModal from './InviteCreatorModal';
import { Search, UserPlus } from 'lucide-react';



const creators = [
  { id: 1, avatar: 'https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761491495806_7dba6e33.webp', name: 'Sarah Johnson', username: 'sarahtech', status: 'verified' as const, videos: 45, sales: '$24.5K', commission: '15%' },
  { id: 2, avatar: 'https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761491497527_22debd84.webp', name: 'Mike Chen', username: 'mikekicks', status: 'verified' as const, videos: 67, sales: '$38.2K', commission: '18%' },
  { id: 3, avatar: 'https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761491499373_889ed8dd.webp', name: 'Emma Davis', username: 'emmastyle', status: 'pending' as const, videos: 12, sales: '$5.3K', commission: '12%' },
  { id: 4, avatar: 'https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761491501082_fc063272.webp', name: 'Alex Martinez', username: 'alexfashion', status: 'pending' as const, videos: 8, sales: '$2.1K', commission: '12%' },
  { id: 5, avatar: 'https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761491495806_7dba6e33.webp', name: 'Lisa Wang', username: 'lisagadgets', status: 'verified' as const, videos: 89, sales: '$52.7K', commission: '20%' },
  { id: 6, avatar: 'https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761491497527_22debd84.webp', name: 'Tom Wilson', username: 'tomsports', status: 'rejected' as const, videos: 3, sales: '$890', commission: '10%' },
];

export default function CreatorsView() {
  const [filter, setFilter] = useState('all');
  const [creators_state, setCreators] = useState(creators);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const filteredCreators = creators_state.filter(c => filter === 'all' || c.status === filter);

  const handleApprove = (id: number) => {
    setCreators(creators_state.map(c => c.id === id ? { ...c, status: 'verified' as const } : c));
  };

  const handleReject = (id: number) => {
    setCreators(creators_state.map(c => c.id === id ? { ...c, status: 'rejected' as const } : c));
  };

  const handleInvite = (inviteData: any) => {
    console.log('Sending invitation to:', inviteData);
    // In a real app, this would send an API request
    alert(`Invitation sent to ${inviteData.email}!`);
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Creators & KYC</h1>
          <p className="text-gray-400">Manage creator accounts and verification</p>
        </div>
        <button 
          onClick={() => setIsInviteModalOpen(true)}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Invite Creator
        </button>

      </div>

      <div className="flex gap-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
        >
          <option value="all">All Creators</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending Review</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCreators.map(creator => (
          <CreatorCard
            key={creator.id}
            {...creator}
            onApprove={() => handleApprove(creator.id)}
            onReject={() => handleReject(creator.id)}
          />
        ))}
      </div>

      <InviteCreatorModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInvite}
      />
    </div>
  );
}

