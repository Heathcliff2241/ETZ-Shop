import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, Edit2, Trash2, CheckCircle, XCircle, Package,
  ShoppingCart, Save, RefreshCw, LogOut, Loader2, AlertCircle,
  ChevronDown
} from 'lucide-react';
import { Product, Order, Category, ConditionGrade } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminPanelProps {
  token: string;
  onLogout: () => void;
  products?: Product[];
  orders?: Order[];
  contactMessages?: unknown[];
  shopEmail?: string;
  shopPhone?: string;
  shopFacebook?: string;
  shopGcash?: string;
  onUpdateProduct?: (updatedProduct: Product) => void;
  onAddProduct?: (newProduct: Omit<Product, 'id' | 'dateAdded'>) => void;
  onDeleteProduct?: (id: string) => void;
  onUpdateSettings?: (updates: Record<string, string>) => void;
  onResetDatabase?: () => void;
  showToast?: (message: string, type?: 'success' | 'error') => void;
  showConfirmDialog?: (message: string, onConfirm: () => void) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    'X-Admin-Token': token,
    'X-Etz-Admin-Token': token,
  };
}

const STATUS_COLORS: Record<string, string> = {
  pending:   'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  shipped:   'bg-purple-50 text-purple-700 border-purple-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminPanel({ token, onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Product form
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState<Category>('mens');
  const [size, setSize] = useState('');
  const [condition, setCondition] = useState<ConditionGrade>('Gently Loved');
  const [conditionNote, setConditionNote] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [description, setDescription] = useState('');
  const [isSold, setIsSold] = useState(false);

  // ── Toast helper ────────────────────────────────────────────────────────────
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch products ──────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
    } catch {
      showToast('Could not load products.', 'error');
    } finally {
      setProductsLoading(false);
    }
  }, []);

  // ── Fetch orders ────────────────────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch('/api/orders', { headers: authHeaders(token) });
      if (!res.ok) throw new Error('Unauthorized');
      const data = await res.json();
      setOrders(data);
    } catch {
      showToast('Could not load orders. Token may have expired.', 'error');
    } finally {
      setOrdersLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab, fetchOrders]);

  // ── Form reset ──────────────────────────────────────────────────────────────
  const resetForm = () => {
    setName(''); setPrice(0); setCategory('mens'); setSize('');
    setCondition('Gently Loved'); setConditionNote(''); setImageUrl('');
    setSelectedFiles(null); setDescription(''); setIsSold(false);
    setIsAdding(false); setEditingId(null);
  };

  const handleEditClick = (p: Product) => {
    setEditingId(p.id); setIsAdding(true);
    setName(p.name); setPrice(p.price); setCategory(p.category);
    setSize(p.size); setCondition(p.condition); setConditionNote(p.conditionNote);
    setImageUrl(p.images[0] || ''); setDescription(p.description); setIsSold(p.isSold);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const uploadSelectedImages = useCallback(async () => {
    if (!selectedFiles?.length) return [] as string[];

    const uploadedUrls: string[] = [];
    const files = Array.from(selectedFiles).filter((file): file is File => file instanceof File);

    for (const file of files) {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Could not read image file.'));
        reader.readAsDataURL(file);
      });

      const res = await fetch('/api/products/upload', {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ filename: file.name, contentType: file.type, data: dataUrl }),
      });

      if (!res.ok) throw new Error('Image upload failed');
      const json = await res.json();
      uploadedUrls.push(json.url);
    }

    return uploadedUrls;
  }, [selectedFiles, token]);

  // ── Submit product ──────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price <= 0 || !size || !conditionNote || !description) {
      showToast('Please fill out all product details.', 'error');
      return;
    }
    setFormLoading(true);
    setUploadingImage(true);

    try {
      const uploadedImages = selectedFiles?.length ? await uploadSelectedImages() : [];
      const defaultImg = uploadedImages[0] || imageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80';
      const payload = { name, price, category, size, condition, conditionNote, images: uploadedImages.length ? uploadedImages : [defaultImg], description, isSold, quantity: 1 };

      if (editingId) {
        const res = await fetch(`/api/products/${editingId}`, {
          method: 'PUT', headers: authHeaders(token), body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Update failed');
        showToast('Product updated successfully.', 'success');
      } else {
        const res = await fetch('/api/products', {
          method: 'POST', headers: authHeaders(token), body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Create failed');
        showToast('Product added successfully.', 'success');
      }
      await fetchProducts();
      resetForm();
    } catch {
      showToast('Failed to save product.', 'error');
    } finally {
      setFormLoading(false);
      setUploadingImage(false);
    }
  };

  // ── Delete product ──────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product permanently?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE', headers: authHeaders(token) });
      if (!res.ok) throw new Error();
      showToast('Product deleted.', 'success');
      await fetchProducts();
    } catch {
      showToast('Failed to delete product.', 'error');
    }
  };

  // ── Toggle sold ─────────────────────────────────────────────────────────────
  const handleToggleSold = async (p: Product) => {
    try {
      const res = await fetch(`/api/products/${p.id}`, {
        method: 'PUT',
        headers: authHeaders(token),
        body: JSON.stringify({ ...p, isSold: !p.isSold }),
      });
      if (!res.ok) throw new Error();
      await fetchProducts();
    } catch {
      showToast('Failed to update sold status.', 'error');
    }
  };

  // ── Update order status ─────────────────────────────────────────────────────
  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT', headers: authHeaders(token), body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      showToast('Order status updated.', 'success');
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: status as Order['status'] } : o));
    } catch {
      showToast('Failed to update order status.', 'error');
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#fafaf8]">

      {/* Topbar */}
      <div className="bg-white border-b border-[#E5E3DE] px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div>
          <h1 className="font-heading text-xl font-bold text-[#1C1C1A]">ETZ A Shoppe</h1>
          <p className="text-xs text-[#6B6B65]">Owner Panel</p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 text-xs font-medium text-[#6B6B65] hover:text-[#1C1C1A] transition-colors cursor-pointer bg-transparent border-none"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Products', value: products.length, color: 'text-[#1C1C1A]' },
            { label: 'Available', value: products.filter(p => !p.isSold).length, color: 'text-[#2D6A4F]' },
            { label: 'Sold', value: products.filter(p => p.isSold).length, color: 'text-[#D4A853]' },
            { label: 'Total Orders', value: orders.length, color: 'text-[#1C1C1A]' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-[#E5E3DE] rounded-xl p-4">
              <p className="text-xs text-[#6B6B65] mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-[#E5E3DE] mb-8">
          {(['products', 'orders'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); resetForm(); }}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-medium transition-colors cursor-pointer capitalize shrink-0 bg-transparent ${
                activeTab === tab
                  ? 'border-[#2D6A4F] text-[#2D6A4F] font-semibold'
                  : 'border-transparent text-[#6B6B65] hover:text-[#1C1C1A]'
              }`}
              id={`admin-tab-${tab}`}
            >
              {tab === 'products' ? <Package className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
              {tab === 'products' ? `Products (${products.length})` : `Orders (${orders.length})`}
            </button>
          ))}
        </div>

        {/* ── PRODUCTS TAB ── */}
        {activeTab === 'products' && (
          <div className="space-y-6">

            {/* Add / Edit Form */}
            {isAdding ? (
              <div className="bg-white border border-[#E5E3DE] rounded-2xl p-6">
                <h2 className="font-heading text-lg font-bold text-[#1C1C1A] mb-5">
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-[#1C1C1A] uppercase tracking-wide">Product Name *</label>
                    <input value={name} onChange={e => setName(e.target.value)} required
                      className="w-full px-3 py-2.5 text-sm bg-[#F7F6F2] border border-[#E5E3DE] rounded-xl text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F]"
                      placeholder="e.g. Vintage Levi's Denim Jacket" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1C1C1A] uppercase tracking-wide">Price (₱) *</label>
                    <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} min={1} required
                      className="w-full px-3 py-2.5 text-sm bg-[#F7F6F2] border border-[#E5E3DE] rounded-xl text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F]" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1C1C1A] uppercase tracking-wide">Size *</label>
                    <input value={size} onChange={e => setSize(e.target.value)} required
                      className="w-full px-3 py-2.5 text-sm bg-[#F7F6F2] border border-[#E5E3DE] rounded-xl text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F]"
                      placeholder="e.g. M, L, 2T, 32x30" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1C1C1A] uppercase tracking-wide">Category *</label>
                    <select value={category} onChange={e => setCategory(e.target.value as Category)}
                      className="w-full px-3 py-2.5 text-sm bg-[#F7F6F2] border border-[#E5E3DE] rounded-xl text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F]">
                      <option value="mens">Men's</option>
                      <option value="womens">Women's</option>
                      <option value="kids">Kids</option>
                      <option value="accessories">Accessories</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1C1C1A] uppercase tracking-wide">Condition *</label>
                    <select value={condition} onChange={e => setCondition(e.target.value as ConditionGrade)}
                      className="w-full px-3 py-2.5 text-sm bg-[#F7F6F2] border border-[#E5E3DE] rounded-xl text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F]">
                      <option value="Like New">Like New</option>
                      <option value="Gently Loved">Gently Loved</option>
                      <option value="Well-Loved">Well-Loved</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-[#1C1C1A] uppercase tracking-wide">Condition Note *</label>
                    <input value={conditionNote} onChange={e => setConditionNote(e.target.value)} required
                      className="w-full px-3 py-2.5 text-sm bg-[#F7F6F2] border border-[#E5E3DE] rounded-xl text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F]"
                      placeholder="e.g. Minor fading on left pocket, no tears" />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-[#1C1C1A] uppercase tracking-wide">Product Images</label>
                    <input type="file" accept="image/*" multiple onChange={e => setSelectedFiles(e.target.files)}
                      className="w-full px-3 py-2.5 text-sm bg-[#F7F6F2] border border-[#E5E3DE] rounded-xl text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F]" />
                    <p className="text-xs text-[#6B6B65]">Upload one or more images from your device. You can also paste an image URL below.</p>
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-[#1C1C1A] uppercase tracking-wide">Image URL</label>
                    <input value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm bg-[#F7F6F2] border border-[#E5E3DE] rounded-xl text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F]"
                      placeholder="https://... (leave blank for placeholder)" />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-[#1C1C1A] uppercase tracking-wide">Description *</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} required
                      className="w-full px-3 py-2.5 text-sm bg-[#F7F6F2] border border-[#E5E3DE] rounded-xl text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F] resize-none"
                      placeholder="Describe the garment in detail..." />
                  </div>

                  {editingId && (
                    <div className="sm:col-span-2 flex items-center gap-2">
                      <input type="checkbox" id="is-sold" checked={isSold} onChange={e => setIsSold(e.target.checked)} className="w-4 h-4 cursor-pointer" />
                      <label htmlFor="is-sold" className="text-sm text-[#1C1C1A] cursor-pointer">Mark as Sold</label>
                    </div>
                  )}

                  <div className="sm:col-span-2 flex gap-3 pt-2">
                    <button type="submit" disabled={formLoading || uploadingImage}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#2D6A4F] hover:bg-[#245840] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer border-none disabled:opacity-60">
                      {formLoading || uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {uploadingImage ? 'Uploading Image...' : editingId ? 'Save Changes' : 'Add Product'}
                    </button>
                    <button type="button" onClick={resetForm}
                      className="px-5 py-2.5 text-sm font-medium text-[#6B6B65] hover:text-[#1C1C1A] hover:bg-[#EBE9E3] rounded-xl transition-colors cursor-pointer bg-transparent border-none">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#1C1C1A] hover:bg-[#2D6A4F] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer border-none"
                id="admin-add-product"
              >
                <Plus className="w-4 h-4" />
                Add New Product
              </button>
            )}

            {/* Product List */}
            {productsLoading ? (
              <div className="flex items-center justify-center py-16 text-[#6B6B65]">
                <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading products…
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 text-[#6B6B65]">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No products yet. Add your first item above.</p>
              </div>
            ) : (
              <div className="bg-white border border-[#E5E3DE] rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[#F7F6F2] border-b border-[#E5E3DE]">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B65] uppercase tracking-wide">Item</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B65] uppercase tracking-wide hidden sm:table-cell">Category</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B65] uppercase tracking-wide">Price</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B65] uppercase tracking-wide hidden md:table-cell">Condition</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B65] uppercase tracking-wide">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B65] uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EEE8]">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-[#FAFAF8] transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-lg border border-[#E5E3DE] shrink-0" onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=60&q=80'; }} />
                            <div>
                              <p className="font-medium text-[#1C1C1A] leading-tight">{p.name}</p>
                              <p className="text-xs text-[#9B9B93]">Size: {p.size}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[#6B6B65] capitalize hidden sm:table-cell">{p.category}</td>
                        <td className="px-4 py-3 font-semibold text-[#1C1C1A]">₱{p.price.toLocaleString()}</td>
                        <td className="px-4 py-3 text-[#6B6B65] hidden md:table-cell">{p.condition}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleToggleSold(p)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                              p.isSold
                                ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                                : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                            }`}
                          >
                            {p.isSold ? <XCircle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                            {p.isSold ? 'Sold' : 'Available'}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleEditClick(p)} title="Edit"
                              className="p-1.5 rounded-lg text-[#6B6B65] hover:text-[#1C1C1A] hover:bg-[#EBE9E3] transition-colors cursor-pointer bg-transparent border-none">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(p.id)} title="Delete"
                              className="p-1.5 rounded-lg text-[#6B6B65] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer bg-transparent border-none">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── ORDERS TAB ── */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-[#1C1C1A]">Orders</h2>
              <button onClick={fetchOrders} disabled={ordersLoading}
                className="flex items-center gap-1.5 text-xs text-[#6B6B65] hover:text-[#1C1C1A] transition-colors cursor-pointer bg-transparent border-none">
                <RefreshCw className={`w-3.5 h-3.5 ${ordersLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {ordersLoading ? (
              <div className="flex items-center justify-center py-16 text-[#6B6B65]">
                <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading orders…
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 text-[#6B6B65]">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No orders yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map(order => (
                  <div key={order.id} className="bg-white border border-[#E5E3DE] rounded-2xl p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold text-[#1C1C1A] text-sm">{order.id}</span>
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_COLORS[order.status]}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-xs text-[#6B6B65]">{order.dateCreated}</p>
                      </div>

                      {/* Status Selector */}
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={e => handleStatusChange(order.id, e.target.value)}
                          className="appearance-none pr-7 pl-3 py-1.5 text-xs font-medium border border-[#E5E3DE] rounded-lg bg-[#F7F6F2] text-[#1C1C1A] focus:outline-none focus:border-[#2D6A4F] cursor-pointer"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#6B6B65] pointer-events-none" />
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 bg-[#F7F6F2] rounded-xl p-3">
                      <div>
                        <p className="text-xs text-[#6B6B65]">Customer</p>
                        <p className="text-sm font-medium text-[#1C1C1A]">{order.customerName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6B6B65]">Contact</p>
                        <p className="text-sm text-[#1C1C1A]">{order.customerPhone}</p>
                        <p className="text-xs text-[#6B6B65]">{order.customerEmail}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6B6B65]">Delivery</p>
                        <p className="text-sm text-[#1C1C1A] capitalize">{order.deliveryMethod}</p>
                        {order.deliveryAddress && <p className="text-xs text-[#6B6B65]">{order.deliveryAddress}</p>}
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-2">
                      {(Array.isArray(order.items) ? order.items : []).map((item: { productId: string; productName: string; price: number; size: string }, i: number) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-[#1C1C1A]">{item.productName} <span className="text-[#9B9B93]">({item.size})</span></span>
                          <span className="font-semibold text-[#1C1C1A]">₱{item.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-[#E5E3DE] mt-3 pt-3 flex justify-between items-center">
                      <span className="text-xs text-[#6B6B65]">{order.note ? `Note: ${order.note}` : ''}</span>
                      <span className="font-bold text-[#1C1C1A]">Total: ₱{order.subtotal.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm z-50 ${
          toast.type === 'success' ? 'bg-white border-[#2D6A4F]/20 text-[#1C1C1A]' : 'bg-white border-red-200 text-red-700'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4 text-[#2D6A4F]" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
          <span className="font-medium">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
