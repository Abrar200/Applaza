import { useState, useEffect } from 'react';
import { useVendorAuth } from '@/contexts/VendorAuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Plus, FolderOpen, Pencil, Trash2, X, Check, Loader2, GripVertical } from 'lucide-react';

interface Category {
  id: string;
  brand_id: string;
  name: string;
  slug: string;
  sort_order: number;
}

const slugify = (str: string) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export default function CategoriesView() {
  const { brand } = useVendorAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (brand) fetchCategories();
  }, [brand]);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .eq('brand_id', brand!.id)
      .order('sort_order');
    if (error) toast.error(error.message);
    else setCategories(data || []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!formName.trim()) { toast.error('Category name is required'); return; }
    setSaving(true);

    if (editId) {
      const { error } = await supabase
        .from('product_categories')
        .update({ name: formName.trim(), slug: slugify(formName) })
        .eq('id', editId);
      if (error) toast.error(error.message);
      else toast.success('Category updated');
    } else {
      const { error } = await supabase.from('product_categories').insert({
        brand_id: brand!.id,
        name: formName.trim(),
        slug: slugify(formName),
        sort_order: categories.length,
      });
      if (error) toast.error(error.message);
      else toast.success('Category created');
    }

    setShowForm(false);
    setEditId(null);
    setFormName('');
    setSaving(false);
    fetchCategories();
  };

  const startEdit = (cat: Category) => {
    setEditId(cat.id);
    setFormName(cat.name);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category? Products in this category will become uncategorised.')) return;
    const { error } = await supabase.from('product_categories').delete().eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success('Category deleted'); fetchCategories(); }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditId(null);
    setFormName('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>Categories</h1>
          <p className="text-gray-500 text-sm mt-0.5">Organise your products into categories for shoppers</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setEditId(null); setFormName(''); }}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-500/20 text-sm"
          >
            <Plus className="w-4 h-4" />
            New Category
          </button>
        )}
      </div>

      {/* Create/edit form */}
      {showForm && (
        <div className="bg-white/3 border border-violet-500/20 rounded-2xl p-5">
          <p className="text-white font-medium mb-4">{editId ? 'Edit Category' : 'New Category'}</p>
          <div className="flex gap-3">
            <input
              type="text"
              autoFocus
              placeholder="e.g. Watch Straps"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') cancelForm(); }}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/40"
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-3 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {editId ? 'Save' : 'Create'}
            </button>
            <button onClick={cancelForm} className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>
          {formName && (
            <p className="text-gray-600 text-xs mt-2">Slug: <span className="text-gray-500 font-mono">{slugify(formName)}</span></p>
          )}
        </div>
      )}

      {/* Categories list */}
      <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-600" /></div>
        ) : categories.length === 0 ? (
          <div className="p-16 text-center">
            <FolderOpen className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">No categories yet</p>
            <p className="text-gray-600 text-sm mt-1">Categories help shoppers navigate your product range.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {categories.map((cat, idx) => (
              <div key={cat.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/2 transition-colors group">
                <GripVertical className="w-4 h-4 text-gray-700 cursor-grab flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{cat.name}</p>
                  <p className="text-gray-600 text-xs font-mono mt-0.5">{cat.slug}</p>
                </div>
                <span className="text-gray-600 text-xs">#{idx + 1}</span>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(cat)}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-violet-500/20 flex items-center justify-center text-gray-400 hover:text-violet-400 transition-all"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/10 flex items-center justify-center text-gray-400 hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}