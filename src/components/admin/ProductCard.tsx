import React, { memo } from 'react';
import { MoreVertical, TrendingUp, Package } from 'lucide-react';

interface ProductCardProps {
  image: string;
  name: string;
  price: string;
  sales: number;
  stock: number;
  status: 'active' | 'low_stock' | 'out_of_stock';
}

// Memoize component to prevent unnecessary re-renders
const ProductCard = memo(({ image, name, price, sales, stock, status }: ProductCardProps) => {
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-pink-500/50 transition-all">
      <div className="relative aspect-square bg-gray-800">
        <img src={image} alt={name} className="w-full h-full object-cover" loading="lazy" />
        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${
          status === 'active' ? 'bg-green-500' : status === 'low_stock' ? 'bg-yellow-500' : 'bg-red-500'
        }`}>
          {status === 'active' ? 'ACTIVE' : status === 'low_stock' ? 'LOW STOCK' : 'OUT'}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-white font-semibold text-sm flex-1">{name}</h3>
          <button className="text-gray-400 hover:text-white">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
        <p className="text-pink-400 font-bold text-lg mb-3">{price}</p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {sales} sold
          </span>
          <span className="flex items-center gap-1">
            <Package className="w-3 h-3" />
            {stock} in stock
          </span>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
