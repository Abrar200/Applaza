import { ShoppingCart, Heart, Package, Settings, CreditCard, MapPin, HelpCircle, Edit } from 'lucide-react';
import { BottomNav } from './BottomNav';
import { useMobileApp } from '@/contexts/MobileAppContext';
import { Button } from '@/components/ui/button';

export const ProfileScreen = ({ onNavigate }: { onNavigate: (screen: string) => void }) => {
  const { user } = useMobileApp();

  const quickActions = [
    { icon: ShoppingCart, label: 'Your Cart', onClick: () => onNavigate('cart'), bg: 'bg-[#E6C196]' },
    { icon: Heart, label: 'Wishlist', onClick: () => onNavigate('wishlist'), bg: 'bg-[#1a1f36]' },
    { icon: Package, label: 'Orders', onClick: () => onNavigate('orders'), bg: 'bg-[#E6C196]' }
  ];

  const settings = [
    { icon: Settings, label: 'Notification Settings', onClick: () => {} },
    { icon: CreditCard, label: 'Payment Methods', onClick: () => {} },
    { icon: MapPin, label: 'Saved Addresses', onClick: () => onNavigate('addresses') },
    { icon: HelpCircle, label: 'Help', onClick: () => {} }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-b from-white to-gray-50 pt-12 pb-8">
        <h1 className="text-3xl font-bold text-center mb-8">Profile</h1>
        
        <div className="flex flex-col items-center">
          <img 
            src={user?.avatar} 
            alt={user?.name} 
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
          <h2 className="text-2xl font-bold mb-1">{user?.name}</h2>
          <p className="text-gray-600 mb-6">{user?.email}</p>
          
          <Button className="bg-[#E6C196] hover:bg-[#d4af84] text-black rounded-full px-8 py-6 text-lg">
            <Edit className="w-5 h-5 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="px-6 mt-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={action.onClick}
              className="bg-white rounded-2xl p-6 flex flex-col items-center gap-3 shadow-sm"
            >
              <div className={`${action.bg} w-16 h-16 rounded-full flex items-center justify-center`}>
                <action.icon className="w-7 h-7 text-white" />
              </div>
              <span className="text-sm font-semibold text-center">{action.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {settings.map((setting, idx) => (
            <button
              key={idx}
              onClick={setting.onClick}
              className="w-full bg-white rounded-2xl p-5 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <setting.icon className="w-6 h-6 text-gray-600" />
              </div>
              <span className="font-semibold text-lg">{setting.label}</span>
            </button>
          ))}
        </div>
      </div>

      <BottomNav active="profile" onNavigate={onNavigate} userAvatar={user?.avatar} />
    </div>
  );
};
