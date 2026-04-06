import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Store } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AdminLoginScreenProps {
  onLogin: () => void;
}

export default function AdminLoginScreen({ onLogin }: AdminLoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!data.user) throw new Error('No user returned');

      const role = data.user.app_metadata?.role;
      if (role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error('Access denied. This portal is for Applaza admins only.');
      }

      onLogin();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-md space-y-6">
        
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] p-10 space-y-8 border border-gray-100">
          
          {/* Logo */}
          <div className="flex justify-center">
            <img
              src="/login.png"
              alt="Applaza Logo"
              className="w-32 h-16 object-contain"
            />
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
              Applaza Admin
            </h1>
            <p className="text-gray-500">
              Sign in to access the admin portal
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@applaza.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-black focus:border-black transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-black focus:border-black transition-all"
              />
            </div>

            {/* Primary Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-black text-white font-medium 
                         shadow-md hover:shadow-lg 
                         hover:bg-gray-900 
                         active:scale-[0.98] 
                         transition-all duration-200"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="bg-white px-3 text-gray-400">or</span>
            </div>
          </div>

          {/* Secondary Button */}
          <a href="/vendor">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-xl bg-white text-gray-800 
                         border border-gray-300 
                         shadow-sm hover:shadow-md 
                         hover:bg-gray-50 
                         active:scale-[0.98] 
                         flex items-center justify-center gap-2 
                         transition-all duration-200"
            >
              <Store className="w-4 h-4" />
              Brand Sign In
            </Button>
          </a>
        </div>

        {/* Demo Credentials */}
        <div className="bg-gray-900 rounded-2xl p-5 text-sm text-gray-300 text-center 
                        border border-gray-700 shadow-inner">
          <p className="font-semibold text-white mb-2 tracking-wide">
            Demo Admin Credentials
          </p>
          <p>
            Email:{' '}
            <span className="font-mono text-gray-100">
              admin@applaza.au
            </span>
          </p>
          <p>
            Password:{' '}
            <span className="font-mono text-gray-100">
              admin1234
            </span>
          </p>
          <p className="text-xs mt-3 text-gray-500">
            To grant admin access, set{' '}
            <span className="font-mono">
              app_metadata.role = "admin"
            </span>{' '}
            in Supabase Auth.
          </p>
        </div>

      </div>
    </div>
  );
}
