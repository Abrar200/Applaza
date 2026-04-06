import { useState, useEffect } from 'react';
import { useVendorAuth } from '@/contexts/VendorAuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { CreditCard, CheckCircle, AlertCircle, Loader2, ArrowRight, ExternalLink, ShieldCheck, Zap, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function StripeOnboardingScreen() {
  const { brand, refreshBrand } = useVendorAuth();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  // On mount, if we returned from Stripe, check status automatically
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('stripe_return') === '1' || window.location.pathname.includes('stripe-return')) {
      checkStripeStatus();
    }
  }, []);

  const invokeFunction = async (action: string) => {
    const { data, error } = await supabase.functions.invoke('stripe-connect-onboard', {
      body: { action },
    });
    if (error) throw new Error(error.message);
    return data;
  };

  const startStripeOnboarding = async () => {
    setLoading(true);
    try {
      const data = await invokeFunction('create_account');
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error(data?.error || 'Failed to start Stripe onboarding');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const checkStripeStatus = async () => {
    setChecking(true);
    try {
      const data = await invokeFunction('check_status');
      if (data?.complete) {
        await refreshBrand();
        toast.success('Stripe setup complete! Your store is now active.');
      } else {
        toast.info('Stripe setup not yet complete. Please finish the onboarding.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(message);
    } finally {
      setChecking(false);
    }
  };

  const isComplete = brand?.stripe_onboarding_complete;

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {isComplete ? (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Sora', sans-serif" }}>
              You're all set!
            </h2>
            <p className="text-gray-400 mb-8">
              Your Stripe account is connected and you're ready to start selling.
            </p>
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 text-left space-y-3 mb-8">
              {[
                'Payouts directly to your bank account',
                'Automatic tax calculations',
                'Fraud protection included',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
            <button
                onClick={() => navigate('/vendor')}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 
                            hover:from-emerald-500 hover:to-teal-500 
                            text-white font-semibold py-4 rounded-xl 
                            transition-all shadow-lg shadow-emerald-500/20"
                >
                Return to Dashboard
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-10">
              <div className="w-20 h-20 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-10 h-10 text-violet-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Sora', sans-serif" }}>
                Connect your bank
              </h2>
              <p className="text-gray-400 max-w-sm mx-auto">
                We use Stripe to securely send your earnings directly to your bank. This takes about 5 minutes.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { icon: ShieldCheck, title: 'Secure', desc: 'Bank-level encryption' },
                { icon: Zap, title: 'Fast payouts', desc: '2-day transfers' },
                { icon: Globe, title: 'Trusted', desc: '2M+ businesses' },
              ].map((item) => (
                <div key={item.title} className="bg-white/3 border border-white/8 rounded-xl p-4 text-center">
                  <item.icon className="w-5 h-5 text-violet-400 mx-auto mb-2" />
                  <div className="text-white text-sm font-medium">{item.title}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{item.desc}</div>
                </div>
              ))}
            </div>

            <div className="bg-white/3 border border-white/8 rounded-2xl p-6 mb-6">
              <p className="text-gray-300 text-sm font-medium mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                What you'll need
              </p>
              <ul className="space-y-2">
                {[
                  'ABN (Australian Business Number)',
                  'Bank account details (BSB + account number)',
                  'Government-issued ID',
                ].map((item) => (
                  <li key={item} className="text-gray-400 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {brand?.stripe_account_id && !isComplete ? (
              <div className="space-y-3">
                <button
                  onClick={startStripeOnboarding}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-violet-500/20"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>Continue Stripe Setup<ExternalLink className="w-4 h-4" /></>
                  )}
                </button>
                <button
                  onClick={checkStripeStatus}
                  disabled={checking}
                  className="w-full bg-white/5 hover:bg-white/8 border border-white/10 text-gray-300 font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  {checking ? <Loader2 className="w-4 h-4 animate-spin" /> : 'I already finished — check status'}
                </button>
              </div>
            ) : (
              <button
                onClick={startStripeOnboarding}
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-violet-500/20"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>Set up Stripe Payments<ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            )}

            <p className="text-center text-gray-600 text-xs mt-4">
              Powered by{' '}
              <a href="https://stripe.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white underline underline-offset-2">
                Stripe
              </a>
              {' '}— Applaza never stores your bank details.
            </p>
          </>
        )}
      </div>
    </div>
  );
}