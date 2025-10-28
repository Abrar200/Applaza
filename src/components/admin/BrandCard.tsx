import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Users, Video, ShoppingBag } from "lucide-react";

interface BrandCardProps {
  brand: {
    id: string;
    name: string;
    logo: string;
    followers: string;
    videos: number;
    products: number;
    verified: boolean;
    status: string;
  };
  onViewProfile: () => void;
}

export default function BrandCard({ brand, onViewProfile }: BrandCardProps) {
  return (
    <div className="bg-[#242424] rounded-xl p-6 border border-gray-800 hover:border-[#00f0ff] transition-all">
      <div className="flex items-start justify-between mb-4">
        <img src={brand.logo} alt={brand.name} className="w-16 h-16 rounded-xl object-cover" />
        {brand.verified && (
          <Badge className="bg-[#00f0ff] text-black">Verified</Badge>
        )}
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2">{brand.name}</h3>
      
      <div className="flex items-center gap-2 text-gray-400 mb-4">
        <Users className="w-4 h-4" />
        <span className="text-sm">{brand.followers} followers</span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-[#1a1a1a] rounded-lg p-3">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <Video className="w-4 h-4" />
            <span className="text-xs">Videos</span>
          </div>
          <p className="text-white font-bold">{brand.videos}</p>
        </div>
        
        <div className="bg-[#1a1a1a] rounded-lg p-3">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs">Products</span>
          </div>
          <p className="text-white font-bold">{brand.products}</p>
        </div>
      </div>
      
      <Button 
        onClick={onViewProfile}
        className="w-full bg-gradient-to-r from-[#00f0ff] to-[#ff006e] text-black font-semibold hover:opacity-90"
      >
        <Eye className="w-4 h-4 mr-2" />
        View Profile
      </Button>
    </div>
  );
}
