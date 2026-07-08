import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Product, Category } from '../types';

interface HomeProps {
  onNavigate: (page: string, category?: Category | 'all') => void;
  products: Product[];
  wishlist: string[];
  onToggleSave: (productId: string, e?: React.MouseEvent) => void;
  recentlyViewed: string[];
  handleProductClick: (product: Product) => void;
  renderRecentlyViewedSection: () => React.ReactNode;
}

export default function Home({
  onNavigate,
  products,
  wishlist,
  onToggleSave,
  recentlyViewed,
  handleProductClick,
  renderRecentlyViewedSection
}: HomeProps) {
  return (
    <div className="w-full flex flex-col gap-16 pb-16" id="homepage-view">
      {/* Full-Bleed Minimal Hero — premium editorial typography, text positioning fit beautifully on the left */}
      <div className="relative w-full min-h-[100dvh] flex items-center overflow-hidden bg-bg-primary select-none">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero2.png"
            alt="ETZ Lookbook Cover Model"
            className="w-full h-full object-cover scale-101 filter brightness-[0.78] contrast-[1.08] saturate-[0.85]"
          />
          {/* Left-side dark gradient to ensure text legibility and luxurious depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/45 to-transparent md:block hidden" />
          <div className="absolute inset-0 bg-black/40 md:hidden block" />
        </div>

        <div className="absolute inset-0 z-20 pointer-events-none">
          <img
            src="/images/hero2-overlay.png"
            alt=""
            className="w-full h-full object-contain object-center opacity-90"
          />
        </div>

        {/* Bold and Confident Text Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 lg:px-20 text-left">
          <div className="max-w-3xl">
            {/* Title: Intentional pairing of modern heavy sans & delicate classic italic serif */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans font-bold text-white tracking-tighter leading-[0.9] text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] text-balance"
            >
              Good clothes.
              <br />
              <span className="font-cursive text-accent-warm tracking-normal text-5xl sm:text-7xl md:text-8xl lg:text-[8.5rem] mt-3 block normal-case font-normal select-none leading-none">
                Already lived in.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 text-[14px] sm:text-[16px] text-white/80 max-w-md leading-relaxed font-light tracking-wide font-sans text-balance"
            >
              Hand-checked in Tabogon, Cebu. Every piece is inspected under high-intensity light for flaws, flat-measured for exact fit, and prepared for its next chapter.
            </motion.p>

            {/* Sleek CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center"
            >
              <button
                onClick={() => onNavigate('shop', 'all')}
                className="group relative bg-white hover:bg-neutral-100 text-text-primary font-semibold tracking-[0.1em] px-8 py-4 transition-all duration-300 ease-out active:scale-[0.98] cursor-pointer text-[11px] uppercase flex items-center justify-center gap-3 shadow-2xl rounded-none border-none"
              >
                <span>Shop the Rack</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 shrink-0" />
              </button>
              
              <button
                onClick={() => onNavigate('how-it-works')}
                className="group flex items-center justify-center gap-2 text-white hover:text-accent-warm text-[11px] tracking-[0.1em] uppercase font-semibold transition-all duration-300 cursor-pointer bg-transparent border border-white/20 hover:border-white/50 px-8 py-4 rounded-none"
              >
                <span>How It Works</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Contained content wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-24">
        
        {/* Why Shop Here Section (Refined Card-Free Editorial Layout) */}
        <div className="border-t border-b border-border/80 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-5">
            <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-accent font-mono">[ OUR STANDARDS ]</span>
            <h2 className="font-heading text-4xl sm:text-5xl text-text-primary tracking-tight font-light leading-[1.1] text-balance">
              You know exactly<br />
              <span className="italic font-normal text-accent">what you are getting</span>
            </h2>
            <p className="text-[14px] text-text-secondary leading-relaxed max-w-sm text-balance font-light">
              We remove the gamble from secondhand shopping. Every single garment undergoes a rigorous multi-step inspection and measurement process.
            </p>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8 lg:pl-8 lg:border-l border-border/40">
            <div className="space-y-4">
              <div className="text-xs font-mono font-bold text-accent tracking-wider">01 // QUALITY</div>
              <h3 className="font-sans text-lg font-bold text-text-primary tracking-tight">100% Hand-Checked</h3>
              <p className="text-xs text-text-secondary leading-relaxed font-light">
                No dusty piles, no hidden surprise stains, no unmentioned holes. Under high-intensity inspection lights, we evaluate each item and document any wear with complete transparency.
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-xs font-mono font-bold text-accent tracking-wider">02 // INDIVIDUAL MEASUREMENTS</div>
              <h3 className="font-sans text-lg font-bold text-text-primary tracking-tight">Honest Sizing Details</h3>
              <p className="text-xs text-text-secondary leading-relaxed font-light">
                Vintage tags lie and modern brands vary wildly. We ignore the label size and measure every piece flat in inches so you can cross-compare against your best-fitting clothes.
              </p>
            </div>
          </div>
        </div>

        {/* Shop By Category Bento Grid */}
        <div className="space-y-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-border/80 pb-6">
            <div className="space-y-1">
              <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-accent font-mono">[ COLLECTIONS ]</span>
              <h2 className="font-heading text-4xl sm:text-5xl font-light text-text-primary tracking-tight leading-none">
                Find your size, <span className="italic font-normal text-accent">your style</span>
              </h2>
            </div>
            <button
              onClick={() => onNavigate('shop', 'all')}
              className="text-xs font-semibold text-accent hover:text-accent-hover flex items-center gap-1.5 group cursor-pointer border-none bg-transparent font-sans tracking-wider uppercase"
            >
              <span>Explore All</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Mens Curated */}
            <div
              onClick={() => onNavigate('shop', 'mens')}
              className="md:col-span-2 group cursor-pointer bg-white border border-border/60 rounded-xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 relative aspect-[16/9] md:aspect-[21/9]"
            >
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src="/images/mens_vintage_jacket_1783176811459.jpg"
                  alt="Men's collection"
                  className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 transition-opacity duration-300 group-hover:opacity-90" />
              </div>
              <div className="absolute bottom-6 left-6 right-6 text-white flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-accent-warm font-bold">01 // CURATED ARCHIVE</span>
                  <h4 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-white leading-none">Men's Apparel</h4>
                  <p className="text-xs text-white/70 font-light mt-1">Vintage outerwear, heavy knits, denim & custom utility wear.</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Womens */}
            <div
              onClick={() => onNavigate('shop', 'womens')}
              className="group cursor-pointer bg-white border border-border/60 rounded-xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 relative min-h-[300px] md:min-h-0 md:h-full"
            >
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src="/images/womens_floral_dress_1783176824055.jpg"
                  alt="Women's collection"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 transition-opacity duration-300 group-hover:opacity-90" />
              </div>
              <div className="absolute bottom-6 left-6 right-6 text-white flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-accent-warm font-bold">02 // LINEN & SILK</span>
                  <h4 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-white leading-none">Women's Section</h4>
                  <p className="text-xs text-white/70 font-light mt-1">Timeless dresses, organic cotton tops & seasonal fits.</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Kids */}
            <div
              onClick={() => onNavigate('shop', 'kids')}
              className="group cursor-pointer bg-white border border-border/60 rounded-xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 relative min-h-[300px] md:min-h-0 md:h-full"
            >
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src="/images/kids_denim_overalls_1783176838795.jpg"
                  alt="Kids clothing"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 transition-opacity duration-300 group-hover:opacity-90" />
              </div>
              <div className="absolute bottom-6 left-6 right-6 text-white flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-accent-warm font-bold">03 // PLAYPROOF</span>
                  <h4 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-white leading-none">Kids' Clothing</h4>
                  <p className="text-xs text-white/70 font-light mt-1">Sturdy, soft fabrics, denim overalls & comfortable garments.</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Accessories */}
            <div
              onClick={() => onNavigate('shop', 'accessories')}
              className="md:col-span-2 group cursor-pointer bg-white border border-border/60 rounded-xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 relative aspect-[16/9] md:aspect-[21/9]"
            >
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src="/images/vintage_leather_bag_1783176854555.jpg"
                  alt="Accessories"
                  className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 transition-opacity duration-300 group-hover:opacity-90" />
              </div>
              <div className="absolute bottom-6 left-6 right-6 text-white flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-accent-warm font-bold">04 // FINE DETAILS</span>
                  <h4 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-white leading-none">Accessories</h4>
                  <p className="text-xs text-white/70 font-light mt-1">Genuine leather messengers, woven bags & handcrafted details.</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section (Curated & Refined) */}
        <div className="bg-[#FAF9F5] border border-border/80 p-10 sm:p-16 rounded-xl space-y-12">
          <div className="max-w-xl space-y-3">
            <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-accent font-mono">[ DIRECT COMMERCE ]</span>
            <h3 className="font-sans text-3xl sm:text-4xl text-text-primary tracking-tight font-bold">Personal, transparent ordering</h3>
            <p className="text-[14px] text-text-secondary leading-relaxed font-light">
              No automatic credit card billing or faceless processors. Every order is verified and coordinated personally by us to ensure the best service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            <div className="space-y-4 md:border-r border-border/50 md:pr-8">
              <div className="text-[10px] font-mono font-bold text-accent tracking-[0.15em] uppercase">Step 01 // Request</div>
              <h4 className="font-sans text-lg font-bold text-text-primary">Add to Bag & Checkout</h4>
              <p className="text-xs text-text-secondary leading-relaxed font-light">
                Since all garments are 1-of-1, add your selected pieces to the cart and submit your delivery details. You pay ₱0 during checkout.
              </p>
            </div>
            <div className="space-y-4 md:border-r border-border/50 md:px-8">
              <div className="text-[10px] font-mono font-bold text-accent tracking-[0.15em] uppercase">Step 02 // Confirm</div>
              <h4 className="font-sans text-lg font-bold text-text-primary">Direct SMS or Chat</h4>
              <p className="text-xs text-text-secondary leading-relaxed font-light">
                We double-check the item's availability on our rack, then contact you directly via SMS or Messenger to personally confirm your order.
              </p>
            </div>
            <div className="space-y-4 md:pl-8">
              <div className="text-[10px] font-mono font-bold text-accent tracking-[0.15em] uppercase">Step 03 // Handover</div>
              <h4 className="font-sans text-lg font-bold text-text-primary">Secure Payment & Pickup</h4>
              <p className="text-xs text-text-secondary leading-relaxed font-light">
                Pay securely via GCash transfer or cash. Opt for fast shipping across Cebu, or pick up in person at Loong, Tabogon.
              </p>
            </div>
          </div>
        </div>

        {/* Recently Viewed Items */}
        {renderRecentlyViewedSection()}

        {/* Location and Closing CTA (Upscale Editorial Banner) */}
        <div className="bg-bg-deep text-white p-10 sm:p-16 rounded-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10 select-none shadow-xl border-none">
          {/* Noise effect */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(45,106,79,0.25),transparent)] pointer-events-none" />
          
          <div className="space-y-4 max-w-2xl text-center lg:text-left relative z-10">
            <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-accent-warm font-mono">// VISIT THE RACK IN CEBU</span>
            <h3 className="font-heading text-3xl sm:text-4xl text-white font-light tracking-tight leading-tight">
              Pickup locally in <span className="italic">Tabogon</span> or delivered direct to your door
            </h3>
            <p className="text-xs text-white/70 leading-relaxed max-w-lg font-light">
              Skip shipping fees by arranging a convenient local pickup in Loong, Tabogon. We also arrange fast courier transport and regular shipping to all towns and cities across Cebu.
            </p>
          </div>
          
          <div className="w-full lg:w-auto shrink-0 relative z-10">
            <button
              onClick={() => onNavigate('shop', 'all')}
              className="w-full lg:w-auto bg-[#2D6A4F] hover:bg-[#347c5b] text-white font-semibold tracking-[0.1em] px-10 py-4 transition-all duration-300 active:scale-[0.98] cursor-pointer text-[11px] uppercase rounded-none border border-white/15 hover:border-white/30"
            >
              Start shopping the collection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}