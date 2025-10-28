import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import BrandCard from "./BrandCard";
import BrandProfileModal from "./BrandProfileModal";

export default function BrandsView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const brands = [
    {
      id: "1",
      name: "Nike",
      logo: "https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761492086663_a6fabe24.webp",
      followers: "2.4M",
      following: "127",
      likes: "18.5M",
      videos: 342,
      products: 1247,
      verified: true,
      status: "active",
      bio: "Just Do It. Official Nike account featuring the latest sneakers, apparel, and athlete stories.",
      videoList: [
        { id: "v1", thumbnail: "https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761492096846_c74fd6c1.webp", title: "Air Jordan Launch", views: "1.2M", likes: "89K" },
        { id: "v2", thumbnail: "https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761492098545_529ad783.webp", title: "Running Collection", views: "890K", likes: "67K" },
        { id: "v3", thumbnail: "https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761492100291_57cd90e0.webp", title: "Athlete Series", views: "2.1M", likes: "156K" },
      ],
      productList: [
        { id: "p1", name: "Air Jordan 1 High", price: "170", image: "https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761492096846_c74fd6c1.webp" },
        { id: "p2", name: "Air Max 270", price: "150", image: "https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761492098545_529ad783.webp" },
        { id: "p3", name: "React Infinity", price: "160", image: "https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761492100291_57cd90e0.webp" },
      ]
    },
    {
      id: "2",
      name: "Adidas",
      logo: "https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761492087388_63a708cb.webp",
      followers: "1.8M",
      following: "89",
      likes: "12.3M",
      videos: 278,
      products: 892,
      verified: true,
      status: "active",
      bio: "Impossible is Nothing. Official Adidas showcasing performance sportswear and lifestyle collections.",
      videoList: [
        { id: "v4", thumbnail: "https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761492101024_287ea5c5.webp", title: "Ultraboost Launch", views: "780K", likes: "52K" },
        { id: "v5", thumbnail: "https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761492102883_efb324b3.webp", title: "Originals Drop", views: "1.1M", likes: "78K" },
        { id: "v6", thumbnail: "https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761492104585_cb384a4d.webp", title: "Sport Collection", views: "650K", likes: "41K" },
      ],
      productList: [
        { id: "p4", name: "Ultraboost 22", price: "180", image: "https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761492101024_287ea5c5.webp" },
        { id: "p5", name: "NMD R1", price: "140", image: "https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761492102883_efb324b3.webp" },
        { id: "p6", name: "Stan Smith", price: "90", image: "https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761492104585_cb384a4d.webp" },
      ]
    },
    {
      id: "3",
      name: "Apple",
      logo: "https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761492088207_e6098be5.webp",
      followers: "3.1M",
      following: "45",
      likes: "24.7M",
      videos: 156,
      products: 234,
      verified: true,
      status: "active",
      bio: "Think Different. Official Apple showcasing innovative technology and design.",
      videoList: [],
      productList: []
    },
    {
      id: "4",
      name: "Sephora",
      logo: "https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761492089895_dbe0240d.webp",
      followers: "1.2M",
      following: "234",
      likes: "9.8M",
      videos: 523,
      products: 3421,
      verified: true,
      status: "active",
      bio: "Beauty for all. Discover makeup, skincare, and fragrance from top brands.",
      videoList: [],
      productList: []
    },
    {
      id: "5",
      name: "Samsung",
      logo: "https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761492090608_da65265e.webp",
      followers: "2.7M",
      following: "67",
      likes: "16.4M",
      videos: 289,
      products: 567,
      verified: true,
      status: "active",
      bio: "Do What You Can't. Explore cutting-edge smartphones, TVs, and home appliances.",
      videoList: [],
      productList: []
    },
    {
      id: "6",
      name: "Zara",
      logo: "https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761492091326_6a3cf2ac.webp",
      followers: "980K",
      following: "156",
      likes: "7.2M",
      videos: 412,
      products: 2134,
      verified: true,
      status: "active",
      bio: "Fashion that inspires. Latest trends in clothing, shoes, and accessories.",
      videoList: [],
      productList: []
    }
  ];

  const filteredBrands = brands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || brand.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewProfile = (brand: any) => {
    setSelectedBrand({
      ...brand,
      videos: brand.videoList || [],
      products: brand.productList || []
    });
    setModalOpen(true);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Brands</h1>
        <p className="text-gray-400">Manage brand accounts and view their profiles</p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#242424] border-gray-700 text-white"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 bg-[#242424] border-gray-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#242424] border-gray-700">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrands.map((brand) => (
          <BrandCard 
            key={brand.id} 
            brand={brand} 
            onViewProfile={() => handleViewProfile(brand)}
          />
        ))}
      </div>

      {selectedBrand && (
        <BrandProfileModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          brand={selectedBrand}
        />
      )}
    </div>
  );
}
