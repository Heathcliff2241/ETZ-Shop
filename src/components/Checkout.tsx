import React from 'react';
import { motion } from 'motion/react';
import { CartItem } from '../types';

interface CheckoutProps {
  cart: CartItem[];
  fullName: string;
  setFullName: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  deliveryMethod: 'pickup' | 'delivery';
  setDeliveryMethod: (val: 'pickup' | 'delivery') => void;
  address: string;
  setAddress: (val: string) => void;
  contactMethod: 'phone' | 'email' | 'facebook';
  setContactMethod: (val: 'phone' | 'email' | 'facebook') => void;
  note: string;
  setNote: (val: string) => void;
  shopGcash: string;
  handlePlaceOrder: (e: React.FormEvent) => void;
  onNavigate: (page: string) => void;
}

export default function Checkout({
  cart,
  fullName,
  setFullName,
  phone,
  setPhone,
  email,
  setEmail,
  deliveryMethod,
  setDeliveryMethod,
  address,
  setAddress,
  contactMethod,
  setContactMethod,
  note,
  setNote,
  shopGcash,
  handlePlaceOrder,
  onNavigate
}: CheckoutProps) {
  const subtotal = cart.reduce((acc, item) => acc + item.product.price, 0);

  return (
    <div
      className="max-w-5xl mx-auto px-4 py-10 w-full space-y-8"
      id="checkout-view"
    >
      <div className="border-b border-border pb-4">
        <h1 className="font-heading text-3xl font-bold text-text-primary">Place Order Request</h1>
        <p className="text-xs text-text-secondary uppercase tracking-widest font-mono font-bold">Almost Done - No Online Payment Required</p>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-10 bg-white border border-border rounded-2xl shadow-sm">
          <p className="text-sm">Please add items to cart first before checking out.</p>
          <button onClick={() => onNavigate('shop')} className="mt-4 bg-[#2D6A4F] text-white px-4 py-2 rounded-full text-xs border-none cursor-pointer">
            Go to shop
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Checkout Form */}
          <form onSubmit={handlePlaceOrder} className="lg:col-span-7 bg-white border border-border p-6 rounded-3xl space-y-5 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
            <h3 className="font-heading text-lg font-bold text-accent border-b border-border pb-2">Your Contact & Shipping Info</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider font-bold text-text-secondary uppercase block">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Juan dela Cruz"
                  className="w-full bg-surface-tint-alt border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider font-bold text-text-secondary uppercase block">Mobile Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0912 345 6789"
                  className="w-full bg-surface-tint-alt border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent font-mono"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-mono tracking-wider font-bold text-text-secondary uppercase block">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. juan@gmail.com"
                  className="w-full bg-surface-tint-alt border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-mono tracking-wider font-bold text-text-secondary uppercase block">Preferred Follow-up Contact *</label>
                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-text-primary">
                    <input
                      type="radio"
                      name="contact"
                      checked={contactMethod === 'phone'}
                      onChange={() => setContactMethod('phone')}
                      className="text-accent focus:ring-accent"
                    />
                    <span>SMS / Phone Call</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-text-primary">
                    <input
                      type="radio"
                      name="contact"
                      checked={contactMethod === 'email'}
                      onChange={() => setContactMethod('email')}
                      className="text-accent focus:ring-accent"
                    />
                    <span>Email</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-text-primary">
                    <input
                      type="radio"
                      name="contact"
                      checked={contactMethod === 'facebook'}
                      onChange={() => setContactMethod('facebook')}
                      className="text-accent focus:ring-accent"
                    />
                    <span>Messenger</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-mono tracking-wider font-bold text-text-secondary uppercase block">Delivery or Pickup Method *</label>
                <div className="flex gap-6 pt-1">
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-accent">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === 'delivery'}
                      onChange={() => setDeliveryMethod('delivery')}
                      className="text-accent focus:ring-accent"
                    />
                    <span>Islandwide Delivery</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-accent">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === 'pickup'}
                      onChange={() => setDeliveryMethod('pickup')}
                      className="text-accent focus:ring-accent"
                    />
                    <span>Local Pickup in Tabogon</span>
                  </label>
                </div>
              </div>

              {deliveryMethod === 'delivery' && (
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-mono tracking-wider font-bold text-text-secondary uppercase block">Detailed Shipping Address *</label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street, Barangay, City/Town, Cebu, Philippines"
                    className="w-full bg-surface-tint-alt border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                  />
                </div>
              )}

              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-mono tracking-wider font-bold text-text-secondary uppercase block">Optional Note (sizing questions / flaws check)</label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Please let me know if the waist can stretch, or I confirm the condition..."
                  className="w-full bg-surface-tint-alt border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-between items-center">
              <button
                type="button"
                onClick={() => onNavigate('cart')}
                className="text-xs font-bold text-accent hover:underline active:scale-95 transition-transform border-none bg-transparent cursor-pointer"
              >
                Return to Cart
              </button>
              <button
                type="submit"
                className="bg-[#2D6A4F] hover:bg-[#245840] text-white font-semibold py-3 px-8 rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer active:scale-[0.98] border-none"
                id="btn-place-order"
              >
                Place Order (₱0 Upfront)
              </button>
            </div>
          </form>

          {/* Sidebar summary */}
          <div className="lg:col-span-5 bg-surface-tint border border-border p-6 rounded-3xl space-y-4">
            <h3 className="font-heading text-lg font-bold text-accent border-b border-border pb-2">Order Summary</h3>
            
            <div className="divide-y divide-border space-y-2">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between py-2 text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-10 h-12 object-cover rounded border border-border"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <strong className="text-text-primary block leading-tight">{item.product.name}</strong>
                      <span className="text-[10px] text-text-secondary font-mono">({item.product.size.split('(')[0].trim()})</span>
                    </div>
                  </div>
                  <span className="font-bold text-text-primary font-mono">₱{item.product.price.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-border flex justify-between items-center text-sm font-bold text-text-primary">
              <span>Items Subtotal:</span>
              <span className="text-lg text-accent font-mono">₱{subtotal.toLocaleString()}</span>
            </div>

            <div className="bg-white border border-border p-4 rounded-xl text-xs text-text-secondary leading-relaxed space-y-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
              <span className="font-bold text-[#2D6A4F] block uppercase tracking-wider text-[10px] font-mono">What Happens Next?</span>
              <p>1. Order is logged in our owner portal instantly.</p>
              <p>2. Owner checks the piece and texts/messages you within 24 hours.</p>
              <p>3. Finalize GCash/Cash payment and physical handover/shipping. Zero card data collected!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
