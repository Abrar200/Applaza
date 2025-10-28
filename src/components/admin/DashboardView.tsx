import React from 'react';
import MetricCard from './MetricCard';
import { DollarSign, ShoppingCart, Users, TrendingUp, Video, Radio } from 'lucide-react';
import VideoCard from './VideoCard';
import OrderTable from './OrderTable';

const videoThumbnails = [
  'https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761491483857_71359205.webp',
  'https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761491489734_cfa1a833.webp',
  'https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761491485622_53ee7ecf.webp',
  'https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761491491550_3fdb1c32.webp',
];

export default function DashboardView() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-400">Real-time overview of your social commerce platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard title="Gross Merchandise Value" value="$2.4M" change={12.5} icon={<DollarSign className="w-6 h-6" />} color="cyan" />
        <MetricCard title="Total Orders" value="18,492" change={8.3} icon={<ShoppingCart className="w-6 h-6" />} color="pink" />
        <MetricCard title="Active Users" value="124.5K" change={15.7} icon={<Users className="w-6 h-6" />} color="purple" />
        <MetricCard title="Conversion Rate" value="4.8%" change={2.1} icon={<TrendingUp className="w-6 h-6" />} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Video className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              <span className="text-sm sm:text-base">Trending Videos</span>
            </h2>
            <button className="text-cyan-400 text-xs sm:text-sm hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {videoThumbnails.slice(0, 2).map((thumb, i) => (
              <VideoCard
                key={i}
                thumbnail={thumb}
                creator={`Creator ${i + 1}`}
                views={`${Math.floor(Math.random() * 500)}K`}
                likes={`${Math.floor(Math.random() * 50)}K`}
                sales={`$${Math.floor(Math.random() * 10)}K`}
                status="approved"
                onApprove={() => {}}
                onFlag={() => {}}
                onFeature={() => {}}
              />
            ))}
          </div>
        </div>


        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 mb-4">
            <Radio className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
            <span className="text-sm sm:text-base">Live Now</span>
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-800 rounded-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Radio className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm sm:text-base truncate">Fashion Week Special</p>
                <p className="text-gray-400 text-xs sm:text-sm">2.4K viewers • $12K sales</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Recent Orders</h2>
        <OrderTable />
      </div>
    </div>
  );
}
