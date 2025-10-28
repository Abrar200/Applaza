import React, { useState, useMemo, useCallback } from 'react';
import VideoCard from './VideoCard';
import { Search, Filter } from 'lucide-react';

const videos = [
  { id: 1, thumbnail: 'https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761491483857_71359205.webp', creator: 'Sarah Tech', views: '234K', likes: '45K', sales: '$8.2K', status: 'pending' as const },
  { id: 2, thumbnail: 'https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761491489734_cfa1a833.webp', creator: 'Mike Kicks', views: '567K', likes: '89K', sales: '$12.5K', status: 'approved' as const },
  { id: 3, thumbnail: 'https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761491485622_53ee7ecf.webp', creator: 'Emma Style', views: '123K', likes: '23K', sales: '$3.4K', status: 'flagged' as const },
  { id: 4, thumbnail: 'https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761491491550_3fdb1c32.webp', creator: 'Alex Fashion', views: '445K', likes: '67K', sales: '$9.8K', status: 'approved' as const },
  { id: 5, thumbnail: 'https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761491487321_7d9ec72c.webp', creator: 'Lisa Gadgets', views: '789K', likes: '123K', sales: '$15.2K', status: 'approved' as const },
  { id: 6, thumbnail: 'https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761491493342_516ca175.webp', creator: 'Tom Sports', views: '345K', likes: '56K', sales: '$7.1K', status: 'pending' as const },
];

export default function VideosView() {
  const [filter, setFilter] = useState('all');
  const [videos_state, setVideos] = useState(videos);

  // Memoize filtered videos
  const filteredVideos = useMemo(() => {
    return videos_state.filter(v => filter === 'all' || v.status === filter);
  }, [videos_state, filter]);


  const handleApprove = (id: number) => {
    setVideos(videos_state.map(v => v.id === id ? { ...v, status: 'approved' as const } : v));
  };

  const handleFlag = (id: number) => {
    setVideos(videos_state.map(v => v.id === id ? { ...v, status: 'flagged' as const } : v));
  };

  const handleFeature = (id: number) => {
    alert(`Featured video ${id}`);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Shoppable Videos</h1>
        <p className="text-sm sm:text-base text-gray-400">Review and moderate video content</p>
      </div>

      <div className="flex gap-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:border-cyan-500 focus:outline-none w-full sm:w-auto"
        >
          <option value="all">All Videos</option>
          <option value="pending">Pending Review</option>
          <option value="approved">Approved</option>
          <option value="flagged">Flagged</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredVideos.map(video => (
          <VideoCard
            key={video.id}
            {...video}
            onApprove={() => handleApprove(video.id)}
            onFlag={() => handleFlag(video.id)}
            onFeature={() => handleFeature(video.id)}
          />
        ))}
      </div>
    </div>
  );
}

