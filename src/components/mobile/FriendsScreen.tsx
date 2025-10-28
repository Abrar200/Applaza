import { useState } from 'react';
import { Search, MessageCircle, MoreVertical } from 'lucide-react';
import { BottomNav } from './BottomNav';
import { useMobileApp } from '@/contexts/MobileAppContext';
import { Input } from '@/components/ui/input';

const friends = [
  { id: 1, name: 'Lachlan McAllister', email: 'lachlanm.m@email.com', avatar: 'https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1761584237161_d4c4cc9b.png' },
  { id: 2, name: 'Jaxon Rivers', email: 'jaxonr.r@email.com', avatar: 'https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1761584240410_f801b825.png' },
  { id: 3, name: "Finn O'Sullivan", email: 'finnos.os@email.com', avatar: 'https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1761584242333_3c6b77d6.png' },
  { id: 4, name: 'Charlotte Anderson', email: 'charlotte.a@email.com', avatar: 'https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1761584243392_09e1960c.png' },
  { id: 5, name: 'Sophie Bennett', email: 'sophie.b@email.com', avatar: 'https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1761584244940_ff426080.png' }
];

export const FriendsScreen = ({ onNavigate }: { onNavigate: (screen: string) => void }) => {
  const { user } = useMobileApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMenu, setShowMenu] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Friends</h1>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search friends"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 rounded-2xl bg-gray-100 border-0"
          />
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {friends.map((friend) => (
          <div key={friend.id} className="bg-white rounded-2xl p-4 flex items-center gap-4 relative">
            <img src={friend.avatar} alt={friend.name} className="w-14 h-14 rounded-full object-cover" />
            
            <div className="flex-1">
              <h3 className="font-bold text-lg">{friend.name}</h3>
              <p className="text-gray-500 text-sm">{friend.email}</p>
            </div>

            <button className="bg-[#E6C196] text-black px-6 py-2 rounded-full flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span className="font-semibold">Chat</span>
            </button>

            <button 
              onClick={() => setShowMenu(showMenu === friend.id ? null : friend.id)}
              className="p-2"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showMenu === friend.id && (
              <div className="absolute right-4 top-16 bg-white rounded-xl shadow-lg p-2 z-10 min-w-[200px]">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded flex items-center gap-2">
                  <span>🔕</span> Turn Off Notifications
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded flex items-center gap-2">
                  <span>👋</span> Unfriend
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded flex items-center gap-2 text-red-500">
                  <span>🚫</span> Block User
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <BottomNav active="friends" onNavigate={onNavigate} userAvatar={user?.avatar} />
    </div>
  );
};
