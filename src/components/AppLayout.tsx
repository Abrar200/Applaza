import { useState, useEffect } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import DashboardView from '@/components/admin/DashboardView';
import UsersView from '@/components/admin/UsersView';
import CreatorsView from '@/components/admin/CreatorsView';
import BrandsView from '@/components/admin/BrandsView';
import ProductsView from '@/components/admin/ProductsView';
import VideosView from '@/components/admin/VideosView';
import LivestreamsView from '@/components/admin/LivestreamsView';
import OrdersView from '@/components/admin/OrdersView';
import PaymentsView from '@/components/admin/PaymentsView';
import WantTeamsView from '@/components/admin/WantTeamsView';
import GamificationView from '@/components/admin/GamificationView';
import AdventuresView from '@/components/admin/AdventuresView';
import AIView from '@/components/admin/AIView';
import ModerationView from '@/components/admin/ModerationView';
import SettingsView from '@/components/admin/SettingsView';
import AdminLoginScreen from '@/components/admin/AdminLoginScreen';
import { supabase } from '@/lib/supabase';

export default function AppLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginScreen onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'users': return <UsersView />;
      case 'creators': return <CreatorsView />;
      case 'brands': return <BrandsView />;
      case 'products': return <ProductsView />;
      case 'videos': return <VideosView />;
      case 'livestreams': return <LivestreamsView />;
      case 'orders': return <OrdersView />;
      case 'payments': return <PaymentsView />;
      case 'want-teams': return <WantTeamsView />;
      case 'gamification': return <GamificationView />;
      case 'adventures': return <AdventuresView />;
      case 'ai': return <AIView />;
      case 'moderation': return <ModerationView />;
      case 'settings': return <SettingsView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-8 overflow-y-auto">
          {renderView()}
        </main>
      </div>
      
      
      {/* Footer */}
      <div className="bg-black border-t border-gray-800 py-6 px-6">
        <p className="text-center text-gray-400 text-sm">
          © 2025 Applaza. Powered by{' '}
          <a 
            href="https://nexadigital.com.au" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-gray-300 transition-colors font-medium"
          >
            Nexa Digital
          </a>
        </p>
      </div>
    </div>
  );
}