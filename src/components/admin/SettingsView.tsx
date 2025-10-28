import React, { useState } from 'react';
import { Settings, Globe, DollarSign, Truck, Key, Bell, FileText } from 'lucide-react';

export default function SettingsView() {
  const [termsAndConditions, setTermsAndConditions] = useState('By using Applaza, you agree to these terms...');
  const [privacyPolicy, setPrivacyPolicy] = useState('We collect and process your personal data...');
  const [cookiePolicy, setCookiePolicy] = useState('We use cookies to enhance your experience...');
  const [refundPolicy, setRefundPolicy] = useState('Refunds are processed within 14 days...');

  const handleSaveLegalDocs = () => {
    // In production, save to Supabase
    alert('Legal documents updated successfully! Changes will reflect across mobile app and website.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Configure platform settings and integrations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">General Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Platform Name</label>
              <input type="text" defaultValue="Applaza" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Support Email</label>
              <input type="email" defaultValue="support@applaza.com" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-bold text-white">Commission Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Default Creator Commission</label>
              <input type="text" defaultValue="15%" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Platform Fee</label>
              <input type="text" defaultValue="2.5%" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Truck className="w-6 h-6 text-pink-400" />
            <h2 className="text-xl font-bold text-white">Delivery Integrations</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold">DD</div>
                <div>
                  <p className="text-white font-semibold">DoorDash</p>
                  <p className="text-green-400 text-sm">Connected</p>
                </div>
              </div>
              <button className="text-cyan-400 text-sm hover:underline">Configure</button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white font-bold">U</div>
                <div>
                  <p className="text-white font-semibold">Uber Direct</p>
                  <p className="text-green-400 text-sm">Connected</p>
                </div>
              </div>
              <button className="text-cyan-400 text-sm hover:underline">Configure</button>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Key className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">API Integrations</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div>
                <p className="text-white font-semibold">Stripe Connect</p>
                <p className="text-green-400 text-sm">Active</p>
              </div>
              <button className="text-cyan-400 text-sm hover:underline">Manage</button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div>
                <p className="text-white font-semibold">SyncSpider</p>
                <p className="text-green-400 text-sm">Syncing</p>
              </div>
              <button className="text-cyan-400 text-sm hover:underline">Manage</button>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Documents Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-blue-400" />
          <div>
            <h2 className="text-xl font-bold text-white">Legal Documents</h2>
            <p className="text-gray-400 text-sm">Update legal documents for mobile app and website</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="text-gray-300 font-semibold mb-2 block">Terms and Conditions</label>
            <textarea 
              value={termsAndConditions}
              onChange={(e) => setTermsAndConditions(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white h-32 resize-y"
              placeholder="Enter terms and conditions..."
            />
            <p className="text-gray-500 text-xs mt-1">{termsAndConditions.length} characters</p>
          </div>

          <div>
            <label className="text-gray-300 font-semibold mb-2 block">Privacy Policy</label>
            <textarea 
              value={privacyPolicy}
              onChange={(e) => setPrivacyPolicy(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white h-32 resize-y"
              placeholder="Enter privacy policy..."
            />
            <p className="text-gray-500 text-xs mt-1">{privacyPolicy.length} characters</p>
          </div>

          <div>
            <label className="text-gray-300 font-semibold mb-2 block">Cookie Policy</label>
            <textarea 
              value={cookiePolicy}
              onChange={(e) => setCookiePolicy(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white h-32 resize-y"
              placeholder="Enter cookie policy..."
            />
            <p className="text-gray-500 text-xs mt-1">{cookiePolicy.length} characters</p>
          </div>

          <div>
            <label className="text-gray-300 font-semibold mb-2 block">Refund Policy</label>
            <textarea 
              value={refundPolicy}
              onChange={(e) => setRefundPolicy(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white h-32 resize-y"
              placeholder="Enter refund policy..."
            />
            <p className="text-gray-500 text-xs mt-1">{refundPolicy.length} characters</p>
          </div>

          <button 
            onClick={handleSaveLegalDocs}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Update Legal Documents
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold">
          Cancel
        </button>
        <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold">
          Save Changes
        </button>
      </div>
    </div>
  );
}
