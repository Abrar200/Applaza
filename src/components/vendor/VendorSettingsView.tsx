import { useState, useEffect, useRef } from 'react';
import { useVendorAuth } from '@/contexts/VendorAuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Store, Globe, Camera, Loader2, Check, CreditCard, ExternalLink, AlertCircle } from 'lucide-react';

export default function VendorSettingsView() {
  const { brand, refreshBrand, user } = useVendorAuth();
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const logoRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '', bio: '', website: '', category: '', logo_url: '', banner_url: '',
  });

  useEffect(() => {
    if (brand) {
      setForm({
        name: brand.name || '',
        bio: brand.bio || '',
        website: brand.website || '',
        category: brand.category || '',
        logo_url: brand.logo_url || '',
        banner_url: brand.banner_url || '',
      });
    }
  }, [brand]);

  const uploadAsset = async (file: File, type: 'logo' | 'banner') => {
    if (type === 'logo') setUploadingLogo(true);
    else setUploadingBanner(true);

    const ext = file.name.split('.').pop();
    const path = `${brand!.id}/${type}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('brand-assets').upload(path, file, { upsert: true });

    if (error) {
      toast.error(`Failed to upload ${type}`);
    } else {
      const { data: { publicUrl } } = supabase.storage.from('brand-assets').getPublicUrl(path);
      setForm(prev => ({ ...prev, [`${type}_url`]: publicUrl }));
    }

    if (type === 'logo') setUploadingLogo(false);
    else setUploadingBanner(false);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Brand name is required'); return; }
    setSaving(true);

    const { error } = await supabase
      .from('brands')
      .update({
        name: form.name.trim(),
        bio: form.bio.trim() || null,
        website: form.website.trim() || null,
        category: form.category || null,
        logo_url: form.logo_url || null,
        banner_url: form.banner_url || null,
      })
      .eq('id', brand!.id);

    if (error) toast.error(error.message);
    else {
      await refreshBrand();
      toast.success('Settings saved');
    }
    setSaving(false);
  };

  const categories = [
    'Fashion & Apparel', 'Electronics', 'Beauty & Personal Care',
    'Home & Living', 'Sports & Outdoors', 'Food & Beverage',
    'Health & Wellness', 'Arts & Crafts', 'Automotive', 'Other',
  ];

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>Brand Settings</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage how your brand appears to shoppers</p>
      </div>

      {/* Banner */}
      <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
        <div
          className="h-32 relative cursor-pointer group"
          onClick={() => bannerRef.current?.click()}
        >
          {form.banner_url ? (
            <img src={form.banner_url} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-violet-900/30 to-indigo-900/30 flex items-center justify-center">
              <p className="text-gray-500 text-sm">Click to upload banner</p>
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            {uploadingBanner ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-6 h-6 text-white" />}
          </div>
        </div>

        <div className="px-6 pb-6 -mt-10 relative z-10 flex items-end gap-4">
          <div
            className="w-20 h-20 rounded-2xl border-4 border-[#0d0c18] overflow-hidden cursor-pointer group relative flex-shrink-0 bg-white/5"
            onClick={() => logoRef.current?.click()}
          >
            {form.logo_url ? (
              <img src={form.logo_url} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Store className="w-8 h-8 text-gray-600" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              {uploadingLogo ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Camera className="w-4 h-4 text-white" />}
            </div>
          </div>
          <div className="pb-2">
            <p className="text-white font-semibold">{form.name || 'Your Brand'}</p>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>
        </div>

        <input ref={logoRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAsset(f, 'logo'); }} />
        <input ref={bannerRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAsset(f, 'banner'); }} />
      </div>

      {/* Form */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Brand Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500/40"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Bio</label>
          <textarea
            rows={3}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Tell shoppers about your brand..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500/40 resize-none placeholder-gray-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Website</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="url"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://yourbrand.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500/40 placeholder-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500/40 appearance-none cursor-pointer"
            >
              <option value="">Select category</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-violet-500/20"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          Save Settings
        </button>
      </div>

      {/* Stripe section */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-gray-400" />
          Stripe Payments
        </h2>
        {brand?.stripe_onboarding_complete ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Check className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">Stripe connected</p>
              <p className="text-gray-500 text-xs mt-0.5">Account: {brand.stripe_account_id}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-300 text-sm font-medium">Stripe not connected</p>
              <p className="text-gray-500 text-sm mt-1">Connect Stripe to receive payouts from your sales.</p>
              <a
                href="/vendor/stripe"
                className="inline-flex items-center gap-1.5 text-violet-400 hover:text-violet-300 text-sm font-medium mt-3 underline underline-offset-2"
              >
                Set up Stripe <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Account info */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-4">Account</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Email</span>
            <span className="text-white text-sm">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Brand ID</span>
            <span className="text-gray-500 text-xs font-mono">{brand?.id}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Status</span>
            <span className={`text-sm font-medium capitalize ${
              brand?.status === 'active' ? 'text-emerald-400' :
              brand?.status === 'suspended' ? 'text-red-400' : 'text-amber-400'
            }`}>{brand?.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}