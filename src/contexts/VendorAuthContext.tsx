import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface Brand {
  id: string;
  user_id: string;
  name: string;
  bio: string | null;
  logo_url: string | null;
  banner_url: string | null;
  category: string | null;
  website: string | null;
  status: 'pending' | 'active' | 'suspended';
  verified: boolean;
  subscriber_count: number;
  stripe_account_id: string | null;
  stripe_onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}

interface VendorAuthContextType {
  user: User | null;
  session: Session | null;
  brand: Brand | null;
  loading: boolean;
  signUp: (email: string, password: string, brandName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshBrand: () => Promise<void>;
}

const VendorAuthContext = createContext<VendorAuthContextType | null>(null);

export const useVendorAuth = () => {
  const ctx = useContext(VendorAuthContext);
  if (!ctx) throw new Error('useVendorAuth must be used within VendorAuthProvider');
  return ctx;
};

export const VendorAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBrand = async (userId: string) => {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (!error && data) setBrand(data as Brand);
    else setBrand(null);
  };

  const refreshBrand = async () => {
    if (user) await fetchBrand(user.id);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Only load session if this is a vendor (has a brand or signed up via vendor portal)
      if (session?.user) {
        const role = session.user.app_metadata?.role;
        // Allow vendor and also allow pending users (role may not be set yet before first refresh)
        if (role === 'vendor' || role === 'customer') {
          // customer role users are allowed to be here (they may not have brand yet)
          setSession(session);
          setUser(session.user);
          fetchBrand(session.user.id).finally(() => setLoading(false));
        } else if (role === 'admin') {
          // Admins should not be in the vendor portal
          setLoading(false);
        } else {
          // Unknown role — still load, the portal will show appropriate state
          setSession(session);
          setUser(session.user);
          fetchBrand(session.user.id).finally(() => setLoading(false));
        }
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const role = session.user.app_metadata?.role;
        if (role !== 'admin') {
          setSession(session);
          setUser(session.user);
          fetchBrand(session.user.id);
        }
      } else {
        setSession(null);
        setUser(null);
        setBrand(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, brandName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        // brand_name in user_metadata triggers the DB function handle_new_user()
        // which sets app_metadata.role = 'vendor' and creates the brands row
        data: { brand_name: brandName.trim() },
      },
    });
    if (error) return { error };

    // If email confirmation is disabled, session is available immediately
    if (data.user) await fetchBrand(data.user.id);
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) return { error };

    // Block admins from signing into the vendor portal
    if (data.user?.app_metadata?.role === 'admin') {
      await supabase.auth.signOut();
      return { error: { message: 'Admin accounts cannot sign into the vendor portal. Please use the admin panel.' } };
    }

    if (data.user) await fetchBrand(data.user.id);
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setBrand(null);
  };

  return (
    <VendorAuthContext.Provider value={{ user, session, brand, loading, signUp, signIn, signOut, refreshBrand }}>
      {children}
    </VendorAuthContext.Provider>
  );
};