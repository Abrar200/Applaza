import { useState } from 'react';
import { useVendorAuth } from '@/contexts/VendorAuthContext';
import {
  Store, LayoutDashboard, Package, FolderOpen, BarChart3,
  Settings, LogOut, ChevronLeft, ChevronRight, Layers, CreditCard,
  BadgeCheck, Menu, X
} from 'lucide-react';

export type VendorTab =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'orders'
  | 'analytics'
  | 'payments'
  | 'settings';

interface SidebarProps {
  activeTab: VendorTab;
  onTabChange: (tab: VendorTab) => void;
}

const navItems: { id: VendorTab; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'categories', label: 'Categories', icon: FolderOpen },
  { id: 'orders', label: 'Orders', icon: Layers },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function VendorSidebar({ activeTab, onTabChange }: SidebarProps) {
  const { brand, signOut } = useVendorAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/5 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/20">
          <Store className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-white font-bold text-sm leading-none">Applaza</div>
            <div className="text-gray-500 text-xs mt-0.5">Vendor Portal</div>
          </div>
        )}
      </div>

      {/* Brand badge */}
      {!collapsed && brand && (
        <div className="mx-3 mt-4 mb-2 bg-white/3 border border-white/8 rounded-xl p-3">
          <div className="flex items-center gap-2">
            {brand.logo_url ? (
              <img src={brand.logo_url} alt={brand.name} className="w-8 h-8 rounded-lg object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/40 to-indigo-500/40 flex items-center justify-center">
                <Store className="w-4 h-4 text-violet-300" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">{brand.name}</div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  brand.status === 'active' ? 'bg-emerald-400' :
                  brand.status === 'suspended' ? 'bg-red-400' : 'bg-amber-400'
                }`} />
                <span className="text-gray-500 text-xs capitalize">{brand.status}</span>
                {brand.verified && <BadgeCheck className="w-3 h-3 text-violet-400" />}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { onTabChange(item.id); setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                active
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/20'
                  : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-violet-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
              {!collapsed && <span>{item.label}</span>}
              {collapsed && (
                <div className="absolute left-[72px] bg-[#1a1a2e] border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm font-medium opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom — collapse toggle + sign out */}
      <div className="px-3 pb-4 space-y-1 border-t border-white/5 pt-3">
        <button
          onClick={signOut}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && 'Sign Out'}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-[#13111e] border border-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-[#0d0c18] border-r border-white/5 z-50 flex flex-col transform transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
        <NavContent />
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:flex flex-col h-screen sticky top-0 bg-[#0d0c18] border-r border-white/5 transition-all duration-200 flex-shrink-0 ${collapsed ? 'w-[72px]' : 'w-60'} relative`}>
        <NavContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-[#1a1a2e] border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#252540] transition-all"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </div>
    </>
  );
}