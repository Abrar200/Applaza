import { Home, Bell, Compass, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  active: string;
  onNavigate: (screen: string) => void;
  userAvatar?: string;
}

export const BottomNav = ({ active, onNavigate, userAvatar }: BottomNavProps) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'adventures', icon: Compass, label: 'Adventures' },
    { id: 'friends', icon: Users, label: 'Friends' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center justify-center flex-1 h-full"
            >
              {item.id === 'profile' && userAvatar ? (
                <img 
                  src={userAvatar} 
                  alt="Profile" 
                  className={cn(
                    "w-8 h-8 rounded-full object-cover",
                    isActive && "ring-2 ring-[#E6C196]"
                  )}
                />
              ) : (
                <Icon className={cn(
                  "w-6 h-6",
                  isActive ? "text-[#1a1f36]" : "text-gray-400"
                )} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
