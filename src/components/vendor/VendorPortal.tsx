import { useState } from 'react';
import { VendorAuthProvider, useVendorAuth } from '@/contexts/VendorAuthContext';
import VendorAuthScreen from './VendorAuthScreen';
import StripeOnboardingScreen from './StripeOnboardingScreen';
import VendorSidebar, { VendorTab } from './VendorSidebar';
import VendorDashboard from './VendorDashboard';
import ProductsView from './ProductsView';
import CategoriesView from './CategoriesView';
import VendorOrdersView from './VendorOrdersView';
import VendorSettingsView from './VendorSettingsView';
import { Loader2 } from 'lucide-react';

function VendorApp() {
  const { user, brand, loading } = useVendorAuth();
  const [activeTab, setActiveTab] = useState<VendorTab>('dashboard');

  // Detect Stripe return redirect
  const isStripeReturn = window.location.pathname.includes('stripe');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
          <p className="text-gray-500 text-sm">Loading your store...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) return <VendorAuthScreen />;

  // Authenticated but no brand record (shouldn't happen — sign up creates it)
  if (!brand) return <VendorAuthScreen />;

  // Brand exists but needs Stripe setup (or is on Stripe return page)
  // We allow them to skip Stripe and still access the portal (for dev/staging)
  // but show a prominent warning in the sidebar and dashboard
  if (isStripeReturn) return <StripeOnboardingScreen />;

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard': return <VendorDashboard />;
      case 'products': return <ProductsView />;
      case 'categories': return <CategoriesView />;
      case 'orders': return <VendorOrdersView />;
      case 'analytics': return <AnalyticsPlaceholder />;
      case 'payments': return <PaymentsPlaceholder />;
      case 'settings': return <VendorSettingsView />;
      default: return <VendorDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      <VendorSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto min-h-screen">
        {renderView()}
      </main>
    </div>
  );
}

// Placeholder views for Analytics and Payments (to be built in later phases)
function AnalyticsPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/3 border border-white/8 flex items-center justify-center mb-4">
        <span className="text-3xl">📊</span>
      </div>
      <h2 className="text-white font-bold text-xl mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>Analytics Coming Soon</h2>
      <p className="text-gray-500 max-w-sm">
        Deep sales analytics, conversion tracking, and customer insights will be available here once orders start rolling in.
      </p>
    </div>
  );
}

function PaymentsPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/3 border border-white/8 flex items-center justify-center mb-4">
        <span className="text-3xl">💳</span>
      </div>
      <h2 className="text-white font-bold text-xl mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>Payments & Payouts</h2>
      <p className="text-gray-500 max-w-sm">
        Your earnings, payout schedule, and transaction history will appear here once your Stripe account is connected and you have sales.
      </p>
      <a
        href="/vendor/stripe"
        className="mt-6 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium px-6 py-3 rounded-xl text-sm hover:from-violet-500 hover:to-indigo-500 transition-all"
      >
        Set up Stripe Payments
      </a>
    </div>
  );
}

// Export wrapped in provider
export default function VendorPortal() {
  return (
    <VendorAuthProvider>
      <VendorApp />
    </VendorAuthProvider>
  );
}