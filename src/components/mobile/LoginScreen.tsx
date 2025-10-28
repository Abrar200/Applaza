import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMobileApp } from '@/contexts/MobileAppContext';

export const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useMobileApp();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    onLogin();
  };

  const handleSocialLogin = (provider: string) => {
    console.log('Social login:', provider);
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-black rounded-2xl flex items-center justify-center">
              <span className="text-white text-4xl font-bold">A</span>
            </div>
            <h1 className="text-3xl font-bold">Applaza</h1>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6">Please login to continue</h2>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-14 rounded-xl"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-14 rounded-xl"
                />
              </div>

              <button type="button" className="text-center w-full underline text-sm">
                Forgot Password?
              </button>

              <Button type="submit" className="w-full h-14 rounded-full bg-[#E6C196] hover:bg-[#d4af84] text-black text-lg">
                Login
              </Button>
            </form>

            <div className="mt-6">
              <p className="text-center text-gray-500 text-sm mb-4">or login with</p>
              <div className="flex justify-center gap-4">
                <button onClick={() => handleSocialLogin('facebook')} className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-xl">f</span>
                </button>
                <button onClick={() => handleSocialLogin('google')} className="w-14 h-14 rounded-full bg-white border flex items-center justify-center">
                  <span className="text-xl">G</span>
                </button>
                <button onClick={() => handleSocialLogin('apple')} className="w-14 h-14 rounded-full bg-black flex items-center justify-center">
                  <span className="text-white text-xl"></span>
                </button>
              </div>
            </div>
          </div>

          <p className="text-center mt-6">
            Don't have an account yet? <button className="underline font-semibold">Register Here</button>
          </p>
        </div>
      </div>
    </div>
  );
};
