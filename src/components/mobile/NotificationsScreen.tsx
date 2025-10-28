import { useState } from 'react';
import { BottomNav } from './BottomNav';
import { useMobileApp } from '@/contexts/MobileAppContext';

const notifications = [
  {
    id: 1,
    type: 'Want Group Invitation',
    time: '12 March at 2:30 PM',
    image: 'https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1761584245912_4a9a25d0.png',
    invitedBy: 'Lachlan McAllister',
    avatar: 'https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1761584237161_d4c4cc9b.png'
  },
  { id: 2, type: 'New Promotion', time: '12 March at 2:30 PM', logo: '🍎' },
  { id: 3, type: 'Up to 50% Off', time: '12 March at 2:30 PM', logo: 'SAMSUNG' },
  { id: 4, type: 'Atom X MKBHD Shoes Laun...', time: '12 March at 2:30 PM', logo: 'atoms' },
  { id: 5, type: 'Lachlan McAllister', time: '12 March at 2:30 PM', logo: 'SONY' },
  { id: 6, type: 'Lachlan McAllister', time: '12 March at 2:30 PM', logo: '✓' }
];

export const NotificationsScreen = ({ onNavigate }: { onNavigate: (screen: string) => void }) => {
  const { user } = useMobileApp();
  const [activeTab, setActiveTab] = useState<'notifications' | 'groups'>('notifications');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white p-6">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 py-3 rounded-2xl font-semibold ${
              activeTab === 'notifications' ? 'bg-[#1a1f36] text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex-1 py-3 rounded-2xl font-semibold ${
              activeTab === 'groups' ? 'bg-[#1a1f36] text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Want Groups
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {notifications.map((notif) => (
          <div key={notif.id} className="bg-white rounded-2xl p-4 flex items-center gap-4">
            {notif.image ? (
              <img src={notif.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center font-bold">
                {notif.logo}
              </div>
            )}
            
            <div className="flex-1">
              <h3 className="font-bold mb-1">{notif.type}</h3>
              <p className="text-sm text-gray-500">{notif.time}</p>
              {notif.invitedBy && (
                <div className="flex items-center gap-2 mt-2 bg-gray-50 rounded-lg p-2">
                  <img src={notif.avatar} alt="" className="w-8 h-8 rounded-full" />
                  <span className="text-sm">Invited by: <strong>{notif.invitedBy}</strong></span>
                </div>
              )}
            </div>

            <button className="bg-[#E6C196] text-black px-6 py-2 rounded-full font-semibold">
              View
            </button>
          </div>
        ))}
      </div>

      <BottomNav active="notifications" onNavigate={onNavigate} userAvatar={user?.avatar} />
    </div>
  );
};
