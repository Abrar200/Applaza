import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Video, ShoppingBag, Heart, MessageCircle, Share2, Play } from "lucide-react";

interface BrandProfileModalProps {
  open: boolean;
  onClose: () => void;
  brand: {
    id: string;
    name: string;
    logo: string;
    followers: string;
    following: string;
    likes: string;
    bio: string;
    videos: any[];
    products: any[];
    verified: boolean;
  };
}

export default function BrandProfileModal({ open, onClose, brand }: BrandProfileModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#1a1a1a] border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Brand Profile</DialogTitle>
        </DialogHeader>
        
        {/* Profile Header - TikTok Style */}
        <div className="flex items-start gap-6 pb-6 border-b border-gray-800">
          <img src={brand.logo} alt={brand.name} className="w-24 h-24 rounded-full object-cover" />
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold text-white">{brand.name}</h2>
              {brand.verified && (
                <Badge className="bg-[#00f0ff] text-black">✓ Verified</Badge>
              )}
            </div>
            
            <div className="flex gap-6 mb-3">
              <div>
                <span className="text-white font-bold">{brand.following}</span>
                <span className="text-gray-400 text-sm ml-1">Following</span>
              </div>
              <div>
                <span className="text-white font-bold">{brand.followers}</span>
                <span className="text-gray-400 text-sm ml-1">Followers</span>
              </div>
              <div>
                <span className="text-white font-bold">{brand.likes}</span>
                <span className="text-gray-400 text-sm ml-1">Likes</span>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm mb-4">{brand.bio}</p>
            
            <div className="flex gap-2">
              <Button className="bg-[#ff006e] hover:bg-[#ff006e]/90 text-white">
                Follow
              </Button>
              <Button variant="outline" className="border-gray-700 text-white">
                Message
              </Button>
            </div>
          </div>
        </div>
        
        {/* Tabs - Videos & Products */}
        <Tabs defaultValue="videos" className="w-full">
          <TabsList className="bg-[#242424] border-b border-gray-800">
            <TabsTrigger value="videos" className="data-[state=active]:bg-[#00f0ff] data-[state=active]:text-black">
              <Video className="w-4 h-4 mr-2" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-[#00f0ff] data-[state=active]:text-black">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Products
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="videos" className="mt-4">
            <div className="grid grid-cols-3 gap-2">
              {brand.videos.map((video) => (
                <div key={video.id} className="relative aspect-[9/16] bg-[#242424] rounded-lg overflow-hidden group cursor-pointer">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex items-center gap-3 text-white text-xs">
                      <span className="flex items-center gap-1">
                        <Play className="w-3 h-3" /> {video.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" /> {video.likes}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="products" className="mt-4">
            <div className="grid grid-cols-3 gap-4">
              {brand.products.map((product) => (
                <div key={product.id} className="bg-[#242424] rounded-lg overflow-hidden hover:border-[#00f0ff] border border-transparent transition-all">
                  <img src={product.image} alt={product.name} className="w-full aspect-square object-cover" />
                  <div className="p-3">
                    <h4 className="text-white font-semibold text-sm mb-1">{product.name}</h4>
                    <p className="text-[#00f0ff] font-bold">${product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
