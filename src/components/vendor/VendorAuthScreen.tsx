import { useState } from 'react';
import { useVendorAuth } from '@/contexts/VendorAuthContext';
import { toast } from 'sonner';
import { Store, Eye, EyeOff, Loader2, ArrowRight, Sparkles } from 'lucide-react';

type Mode = 'signin' | 'signup';

export default function VendorAuthScreen() {
  const { signIn, signUp } = useVendorAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', brandName: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === 'signin') {
      const { error } = await signIn(form.email, form.password);
      if (error) toast.error(error.message);
    } else {
      if (!form.brandName.trim()) {
        toast.error('Please enter your brand name');
        setLoading(false);
        return;
      }
      const { error } = await signUp(form.email, form.password, form.brandName);
      if (error) toast.error(error.message);
      else toast.success('Account created! Check your email to verify.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Left — branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-[#0f0f1a] via-[#13111e] to-[#0a0a0f] p-12 border-r border-white/5 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[100px]" />
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Applaza Vendor</span>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-violet-300 text-sm font-medium">Social Commerce Platform</span>
            </div>
            <h1 className="text-5xl font-bold text-white leading-tight mb-6" style={{ fontFamily: "'Sora', sans-serif" }}>
              Sell to the<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">next generation</span><br />
              of shoppers.
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-sm">
              List your products, go live, run group deals, and grow your brand on Australia's most social shopping platform.
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          {[
            { stat: '12K+', label: 'Active shoppers' },
            { stat: '0%', label: 'Commission until $10K GMV' },
            { stat: '48h', label: 'From signup to selling' },
          ].map((item) => (
            <div key={item.stat} className="flex items-center gap-4">
              <span className="text-2xl font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>{item.stat}</span>
              <span className="text-gray-500 text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Store className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-lg">Applaza Vendor</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>
              {mode === 'signin' ? 'Welcome back' : 'Create your store'}
            </h2>
            <p className="text-gray-500">
              {mode === 'signin'
                ? 'Sign in to manage your brand and products'
                : 'Get started selling on Applaza in minutes'}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-8 border border-white/10">
            {(['signin', 'signup'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  mode === m
                    ? 'bg-white text-[#0a0a0f] shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {m === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Brand Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Apparel"
                  value={form.brandName}
                  onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60 focus:bg-white/8 transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                required
                placeholder="you@yourbrand.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60 focus:bg-white/8 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60 focus:bg-white/8 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6 shadow-lg shadow-violet-500/20"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {mode === 'signup' && (
            <p className="text-gray-600 text-xs text-center mt-6 leading-relaxed">
              By creating an account you agree to Applaza's{' '}
              <a href="#" className="text-gray-400 hover:text-white underline underline-offset-2">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-gray-400 hover:text-white underline underline-offset-2">Privacy Policy</a>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}