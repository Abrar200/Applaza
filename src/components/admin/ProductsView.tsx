import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { Search, Filter, Plus } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

const products = [
  { id: 1, image: 'https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761491483857_71359205.webp', name: 'iPhone 15 Pro Max', price: '$1,199', sales: 342, stock: 48, status: 'active' as const },
  { id: 2, image: 'https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761491489734_cfa1a833.webp', name: 'Nike Air Max 2024', price: '$189', sales: 567, stock: 12, status: 'low_stock' as const },
  { id: 3, image: 'https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761491485622_53ee7ecf.webp', name: 'Samsung Galaxy S24', price: '$899', sales: 234, stock: 0, status: 'out_of_stock' as const },
  { id: 4, image: 'https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761491491550_3fdb1c32.webp', name: 'Adidas Ultraboost', price: '$180', sales: 445, stock: 89, status: 'active' as const },
  { id: 5, image: 'https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761491487321_7d9ec72c.webp', name: 'MacBook Pro 16"', price: '$2,499', sales: 156, stock: 23, status: 'active' as const },
  { id: 6, image: 'https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761491493342_516ca175.webp', name: 'Jordan Retro 1', price: '$170', sales: 678, stock: 34, status: 'active' as const },
  { id: 7, image: 'https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761491489028_5c772472.webp', name: 'AirPods Pro 2', price: '$249', sales: 892, stock: 156, status: 'active' as const },
  { id: 8, image: 'https://d64gsuwffb70l.cloudfront.net/68fe39e34c92140cfe42b366_1761491495071_7d9a2414.webp', name: 'Puma RS-X', price: '$120', sales: 234, stock: 67, status: 'active' as const },
];

export default function ProductsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Debounce search for performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Memoize filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || p.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [debouncedSearchTerm, filter]);


  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Product Catalog</h1>
          <p className="text-sm sm:text-base text-gray-400">Manage your synced products from SyncSpider</p>
        </div>
        <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm sm:text-base">
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          Add Product
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 sm:pl-12 pr-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:border-cyan-500 focus:outline-none"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:border-cyan-500 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}

