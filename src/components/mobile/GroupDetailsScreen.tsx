import { ChevronLeft, MoreVertical, Heart, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const friendAvatars = [
  'https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1761584237161_d4c4cc9b.png',
  'https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1761584240410_f801b825.png',
  'https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1761584242333_3c6b77d6.png',
  'https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1761584243392_09e1960c.png',
  'https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1761584244940_ff426080.png',
  'https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1761584245912_4a9a25d0.png'
];

export const GroupDetailsScreen = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-6 flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">Group Details</h1>
        <button className="ml-auto">
          <MoreVertical className="w-6 h-6" />
        </button>
      </div>

      <div className="relative h-64">
        <img 
          src="https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1761584245912_4a9a25d0.png" 
          alt="Product" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="bg-white rounded-t-3xl -mt-8 relative z-10 p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Sport Band - 46mm-49mm - Ultra Orange</h2>
            <div className="flex items-center gap-3">
              <span className="bg-pink-500 text-white px-4 py-1 rounded-full font-semibold">15% Off</span>
              <span className="text-2xl font-bold text-pink-500">$85.00</span>
              <span className="text-gray-400 line-through">$100.00</span>
            </div>
          </div>
          <button className="p-3 rounded-full bg-gray-100">
            <Heart className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold">Friends Joined: 8</span>
            <div className="flex -space-x-2">
              {friendAvatars.map((avatar, idx) => (
                <img 
                  key={idx} 
                  src={avatar} 
                  alt="" 
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                />
              ))}
              <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-sm font-bold">
                +2
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white rounded-xl p-4">
            <span className="text-gray-600">Add 2 more friends to get</span>
            <span className="bg-[#1a1f36] text-white px-6 py-2 rounded-full font-bold">20% Off</span>
          </div>
        </div>

        <div className="bg-[#1a1f36] rounded-2xl p-4 flex items-center gap-3 mb-6">
          <Clock className="w-6 h-6 text-green-400" />
          <span className="text-white font-semibold">Time Left:</span>
          <span className="text-white font-bold text-lg">1 Day : 12 Hours : 30 Minutes</span>
        </div>

        <Button className="w-full bg-[#E6C196] hover:bg-[#d4af84] text-black rounded-full h-14 text-lg font-bold">
          Invite Friends
        </Button>
      </div>
    </div>
  );
};
