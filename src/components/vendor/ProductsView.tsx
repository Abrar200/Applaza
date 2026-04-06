import { useState, useEffect, useRef } from 'react';
import { useVendorAuth } from '@/contexts/VendorAuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import {
  Plus, Search, Package, Pencil, Trash2, Upload, X,
  Image as ImageIcon, Loader2, Eye, EyeOff, ChevronDown,
  AlertCircle, Video, GripVertical, Check
} from 'lucide-react';


type ProductStatus = 'draft' | 'active' | 'archived';

interface ProductForm {
  name: string;
  description: string;
  price: string;
  compare_at_price: string;
  category_id: string;
  status: ProductStatus;
}


interface Product {
  id: string;
  brand_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  status: 'draft' | 'active' | 'archived';
  avg_rating: number;
  review_count: number;
  cart_count: number;
  created_at: string;
}

interface Category { id: string; name: string; }

interface MediaItem {
  id?: string;
  url: string;
  type: 'image' | 'video';
  sort_order: number;
  file?: File;
  preview?: string;
}

interface Variant {
  id?: string;
  name: string;
  price_modifier: number;
  stock_quantity: number;
  sku: string;
}

const EMPTY_PRODUCT: ProductForm = {
    name: '',
    description: '',
    price: '',
    compare_at_price: '',
    category_id: '',
    status: 'draft',
  };
  

export default function ProductsView() {
  const { brand } = useVendorAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProductForm>(EMPTY_PRODUCT);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (brand) { fetchProducts(); fetchCategories(); }
  }, [brand]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('brand_id', brand!.id)
      .order('created_at', { ascending: false });
    if (error) toast.error(error.message);
    else setProducts(data || []);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('product_categories')
      .select('id, name')
      .eq('brand_id', brand!.id)
      .order('sort_order');
    setCategories(data || []);
  };

  const openCreateModal = () => {
    setEditProduct(null);
    setForm(EMPTY_PRODUCT);
    setMedia([]);
    setVariants([]);
    setModalOpen(true);
  };

  const openEditModal = async (product: Product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      compare_at_price: product.compare_at_price ? String(product.compare_at_price) : '',
      category_id: product.category_id || '',
      status: product.status,
    });

    // Fetch existing media and variants
    const [{ data: mediaData }, { data: variantData }] = await Promise.all([
      supabase.from('product_media').select('*').eq('product_id', product.id).order('sort_order'),
      supabase.from('product_variants').select('*').eq('product_id', product.id),
    ]);
    setMedia(mediaData || []);
    setVariants(variantData?.map(v => ({ id: v.id, name: v.name, price_modifier: v.price_modifier, stock_quantity: v.stock_quantity, sku: v.sku || '' })) || []);
    setModalOpen(true);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newMedia: MediaItem[] = files.map((file, i) => ({
      url: '',
      type: file.type.startsWith('video/') ? 'video' : 'image',
      sort_order: media.length + i,
      file,
      preview: URL.createObjectURL(file),
    }));
    setMedia(prev => [...prev, ...newMedia]);
  };

  const removeMedia = (idx: number) => {
    setMedia(prev => prev.filter((_, i) => i !== idx));
  };

  const uploadMediaFiles = async (productId: string): Promise<void> => {
    const filesToUpload = media.filter(m => m.file);
    if (!filesToUpload.length) return;

    setUploadingMedia(true);
    for (let i = 0; i < media.length; i++) {
      const item = media[i];
      if (!item.file) continue;

      const ext = item.file.name.split('.').pop();
      const path = `${brand!.id}/${productId}/${Date.now()}-${i}.${ext}`;
      const { data, error } = await supabase.storage
        .from('product-media')
        .upload(path, item.file, { upsert: true });

      if (error) { toast.error(`Failed to upload ${item.file.name}`); continue; }

      const { data: { publicUrl } } = supabase.storage.from('product-media').getPublicUrl(path);

      await supabase.from('product_media').insert({
        product_id: productId,
        url: publicUrl,
        type: item.type,
        sort_order: item.sort_order,
      });
    }
    setUploadingMedia(false);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Product name is required'); return; }
    if (!form.price || isNaN(Number(form.price))) { toast.error('Valid price is required'); return; }

    setSaving(true);
    const payload = {
      brand_id: brand!.id,
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: Number(form.price),
      compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
      category_id: form.category_id || null,
      status: form.status,
    };

    let productId = editProduct?.id;

    if (editProduct) {
      const { error } = await supabase.from('products').update(payload).eq('id', editProduct.id);
      if (error) { toast.error(error.message); setSaving(false); return; }
    } else {
      const { data, error } = await supabase.from('products').insert(payload).select().single();
      if (error) { toast.error(error.message); setSaving(false); return; }
      productId = data.id;
    }

    // Upload new media
    await uploadMediaFiles(productId!);

    // Save variants — always delete first, then re-insert clean rows
    // Never spread the local variant object (it has an `id` field that breaks inserts)
    await supabase.from('product_variants').delete().eq('product_id', productId!);

    const validVariants = variants.filter(v => v.name.trim() !== '');
    if (validVariants.length > 0) {
      const variantPayload = validVariants.map(v => ({
        product_id: productId!,
        name: v.name.trim(),
        price_modifier: Number(v.price_modifier) || 0,
        stock_quantity: Number(v.stock_quantity) || 0,
        sku: v.sku?.trim() || null,
      }));
      const { error: variantError } = await supabase.from('product_variants').insert(variantPayload);
      if (variantError) {
        toast.error('Variants save failed: ' + variantError.message);
        console.error('Variant insert error:', variantError);
      }
    }

    toast.success(editProduct ? 'Product updated!' : 'Product created!');
    setModalOpen(false);
    fetchProducts();
    setSaving(false);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) toast.error(error.message);
    else { toast.success('Product deleted'); fetchProducts(); }
  };

  const toggleStatus = async (product: Product) => {
    const newStatus = product.status === 'active' ? 'draft' : 'active';
    await supabase.from('products').update({ status: newStatus }).eq('id', product.id);
    fetchProducts();
  };

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const addVariant = () => setVariants(prev => [...prev, { name: '', price_modifier: 0, stock_quantity: 0, sku: '' }]);
  const updateVariant = (i: number, key: keyof Variant, val: any) => {
    setVariants(prev => prev.map((v, idx) => idx === i ? { ...v, [key]: val } : v));
  };
  const removeVariant = (i: number) => setVariants(prev => prev.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>Products</h1>
          <p className="text-gray-500 text-sm mt-0.5">{products.length} total listings</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-500/20 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/8 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/40"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/40 appearance-none cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Product table */}
      <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-600"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 text-center">
            <Package className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">No products found</p>
            <p className="text-gray-600 text-sm mt-1">
              {products.length === 0 ? 'Create your first product to get started.' : 'Try adjusting your filters.'}
            </p>
            {products.length === 0 && (
              <button onClick={openCreateModal} className="mt-6 bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">
                Add your first product
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="hidden md:grid grid-cols-[1fr_120px_100px_80px_100px] gap-4 px-6 py-3 border-b border-white/5 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span>Product</span>
              <span>Price</span>
              <span>Status</span>
              <span>Rating</span>
              <span className="text-right">Actions</span>
            </div>
            <div className="divide-y divide-white/5">
              {filteredProducts.map((product) => (
                <div key={product.id} className="grid grid-cols-1 md:grid-cols-[1fr_120px_100px_80px_100px] gap-4 items-center px-6 py-4 hover:bg-white/2 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{product.name}</p>
                      <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{product.description || 'No description'}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-white text-sm">${product.price}</p>
                    {product.compare_at_price && (
                      <p className="text-gray-600 text-xs line-through">${product.compare_at_price}</p>
                    )}
                  </div>

                  <div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      product.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                      product.status === 'draft' ? 'bg-gray-500/10 text-gray-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {product.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-amber-400 text-sm">★</span>
                    <span className="text-white text-sm">{product.avg_rating || '—'}</span>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => toggleStatus(product)}
                      title={product.status === 'active' ? 'Set to draft' : 'Set to active'}
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                    >
                      {product.status === 'active' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => openEditModal(product)}
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-violet-500/20 flex items-center justify-center text-gray-400 hover:text-violet-400 transition-all"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/10 flex items-center justify-center text-gray-400 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto">
          <div className="bg-[#0d0c18] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
              <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
                {editProduct ? 'Edit Product' : 'New Product'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Product Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Wireless Noise Cancelling Headphones"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/40"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your product..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/40 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Price (AUD) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-7 pr-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/40"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Compare-at Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={form.compare_at_price}
                        onChange={(e) => setForm({ ...form, compare_at_price: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-7 pr-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/40"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
                    <select
                      value={form.category_id}
                      onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500/40 appearance-none cursor-pointer"
                    >
                      <option value="">No category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500/40 appearance-none cursor-pointer"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Media upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Images & Videos
                  <span className="text-gray-600 font-normal ml-2">Upload up to 10 files</span>
                </label>

                {media.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {media.map((item, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10 group">
                        {item.type === 'image' ? (
                          <img src={item.preview || item.url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Video className="w-8 h-8 text-gray-500" />
                          </div>
                        )}
                        {idx === 0 && (
                          <div className="absolute top-1 left-1 bg-violet-600 text-white text-xs px-1.5 py-0.5 rounded font-medium">Cover</div>
                        )}
                        <button
                          onClick={() => removeMedia(idx)}
                          className="absolute top-1 right-1 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-white/10 hover:border-violet-500/40 rounded-xl py-6 flex flex-col items-center gap-2 text-gray-500 hover:text-gray-300 transition-all cursor-pointer"
                >
                  <Upload className="w-6 h-6" />
                  <span className="text-sm">Click to upload images or videos</span>
                  <span className="text-xs text-gray-600">JPG, PNG, WebP, MP4 · Max 50MB each</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>

              {/* Variants */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-300">
                    Variants
                    <span className="text-gray-600 font-normal ml-2">Sizes, colours, etc.</span>
                  </label>
                  <button
                    onClick={addVariant}
                    className="flex items-center gap-1.5 text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Variant
                  </button>
                </div>

                {variants.length === 0 ? (
                  <p className="text-gray-600 text-sm text-center py-4 border border-dashed border-white/8 rounded-xl">
                    No variants. This product has a single option.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {variants.map((v, i) => (
                      <div key={i} className="grid grid-cols-[1fr_100px_100px_80px_32px] gap-2 items-center">
                        <input
                          type="text"
                          placeholder="e.g. Red / Large"
                          value={v.name}
                          onChange={(e) => updateVariant(i, 'name', e.target.value)}
                          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500/40"
                        />
                        <input
                          type="number"
                          placeholder="+/- price"
                          value={v.price_modifier}
                          onChange={(e) => updateVariant(i, 'price_modifier', e.target.value)}
                          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500/40"
                        />
                        <input
                          type="number"
                          min="0"
                          placeholder="Stock"
                          value={v.stock_quantity}
                          onChange={(e) => updateVariant(i, 'stock_quantity', e.target.value)}
                          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500/40"
                        />
                        <input
                          type="text"
                          placeholder="SKU"
                          value={v.sku}
                          onChange={(e) => updateVariant(i, 'sku', e.target.value)}
                          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500/40"
                        />
                        <button onClick={() => removeVariant(i)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-red-400 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <p className="text-gray-600 text-xs">Columns: Name · Price modifier · Stock · SKU</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 bg-white/5 hover:bg-white/8 border border-white/10 text-gray-300 font-medium py-3 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || uploadingMedia}
                className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {(saving || uploadingMedia) ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />{uploadingMedia ? 'Uploading...' : 'Saving...'}</>
                ) : (
                  <><Check className="w-4 h-4" />{editProduct ? 'Save Changes' : 'Create Product'}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}