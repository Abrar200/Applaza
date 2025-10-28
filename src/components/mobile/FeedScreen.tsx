import { useState } from 'react';
import { Heart, ShoppingCart, Gift, Share2, MessageCircle, Star } from 'lucide-react';
import { useMobileApp } from '@/contexts/MobileAppContext';
import { BottomNav } from './BottomNav';

const products = [
  {
    id: 1,
    name: 'Airpods Max',
    price: 549.00,
    brand: 'Apple',
    brandLogo: 'https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1761584234187_ccbfc4ac.png',
    subscribers: '1.6m',
    image: 'https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1761584234187_ccbfc4ac.png',
    likes: 213000,
    comments: 200,
    rating: 4.8
  }
];

export const FeedScreen = ({ onNavigate }: { onNavigate: (screen: string) => void }) => {
  const { user, addToCart, addToWishlist } = useMobileApp();
  const [currentProduct] = useState(products[0]);
  const [liked, setLiked] = useState(false);

  return (
    <div className="h-screen bg-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <img src={currentProduct.image} alt={currentProduct.name} className="w-full h-full object-cover" />
      </div>

      <div className="absolute top-0 left-0 right-0 p-4 flex justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
          <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">A</span>
          </div>
          <span className="font-semibold">{user?.coins || 105}</span>
        </div>
      </div>

      <div className="absolute top-1/4 left-0 right-0 text-center text-white">
        <h1 className="text-4xl font-bold mb-2">{currentProduct.name}</h1>
        <p className="text-2xl">${currentProduct.price.toFixed(2)}</p>
      </div>

      <div className="absolute right-4 bottom-32 flex flex-col gap-4">
        <button 
          onClick={() => { setLiked(!liked); addToWishlist(currentProduct); }}
          className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center"
        >
          <Heart className={`w-6 h-6 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
        </button>
        
        <div className="flex flex-col items-center">
          <button className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-gray-700" />
          </button>
          <span className="text-white text-xs mt-1">{(currentProduct.likes / 1000).toFixed(0)}k</span>
        </div>

        <div className="flex flex-col items-center">
          <button className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-gray-700" />
          </button>
          <span className="text-white text-xs mt-1">{currentProduct.comments}</span>
        </div>

        <div className="flex flex-col items-center">
          <button className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center">
            <Star className="w-6 h-6 text-gray-700" />
          </button>
          <span className="text-white text-xs mt-1">{currentProduct.rating}</span>
        </div>
      </div>

      <div className="absolute bottom-32 left-4 right-24">
        <div className="flex items-center gap-3 mb-4">
          <img src={currentProduct.brandLogo} alt={currentProduct.brand} className="w-16 h-16 rounded-full bg-white p-2" />
          <div className="text-white">
            <h3 className="font-bold text-lg">{currentProduct.brand}</h3>
            <p className="text-sm opacity-90">{currentProduct.subscribers} Subscriptions</p>
          </div>
          <button className="ml-auto w-8 h-8 rounded-full bg-[#E6C196] flex items-center justify-center">
            <span className="text-xl">+</span>
          </button>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 bg-white/90 backdrop-blur-sm rounded-full py-3 px-4 flex items-center justify-center gap-2">
            <Gift className="w-5 h-5" />
            <span className="font-semibold">Gift</span>
          </button>
          <button 
            onClick={() => addToCart(currentProduct)}
            className="flex-1 bg-white/90 backdrop-blur-sm rounded-full py-3 px-4 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="font-semibold">Want</span>
          </button>
          <button className="bg-white/90 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <BottomNav active="home" onNavigate={onNavigate} userAvatar={user?.avatar} />
    </div>
  );
};
