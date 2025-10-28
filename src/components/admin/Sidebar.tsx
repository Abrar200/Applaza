import React from 'react';
import { LayoutDashboard, Users, Video, ShoppingBag, DollarSign, TrendingUp, Settings, Shield, Package, Radio, Store, UsersRound, Gamepad2, Compass, Brain, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'creators', label: 'Creators & KYC', icon: TrendingUp },
  { id: 'brands', label: 'Brands', icon: Store },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'videos', label: 'Shoppable Videos', icon: Video },
  { id: 'livestreams', label: 'Livestreams', icon: Radio },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'payments', label: 'Payments', icon: DollarSign },
  { id: 'want-teams', label: 'WANT Teams', icon: UsersRound },
  { id: 'gamification', label: 'Gamification', icon: Gamepad2 },
  { id: 'adventures', label: 'Adventures', icon: Compass },
  { id: 'ai', label: 'AI Insights', icon: Brain },
  { id: 'moderation', label: 'Moderation', icon: Shield },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="w-64 bg-black border-r border-gray-800 h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-gray-800 flex items-center justify-center">
        <img src="https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1761492530732_02f340db.png" alt="Applaza" className="h-12 w-auto" />
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
              activeTab === item.id ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-gray-400 hover:bg-gray-800'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}

