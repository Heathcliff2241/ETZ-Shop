import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  key?: string | number;
  isSaved?: boolean;
  onToggleSave?: (productId: string, e: React.MouseEvent) => void;
}

export default function ProductCard({ product, onClick, isSaved = false, onToggleSave }: ProductCardProps) {
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.22)',
      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform-origin 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transform: 'scale(1)',
      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    });
  };

  const getConditionStyle = (cond: string) => {
    switch (cond) {
      case 'Like New':
        return 'bg-accent text-white';
      case 'Gently Loved':
        return 'bg-surface-tint text-text-primary';
      case 'Well-Loved':
        return 'bg-accent-warm/15 text-accent-warm';
      default:
        return 'bg-surface-tint text-text-primary';
    }
  };

  const categoryLabel = product.category === 'mens' ? "Men's"
    : product.category === 'womens' ? "Women's"
    : product.category === 'kids' ? 'Kids'
    : 'Accessories';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
      className="bg-surface-tint/25 border border-border/80 rounded-[2rem] p-1.5 transition-all duration-500 flex flex-col h-full cursor-pointer group shadow-xs hover:shadow-sm"
      style={{ transition: 'box-shadow 0.5s cubic-bezier(0.32, 0.72, 0, 1), transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)' }}
      onClick={() => onClick(product)}
      id={`product-card-${product.id}`}
    >
      {/* Inner Core */}
      <div className="bg-white rounded-[calc(2rem-0.375rem)] overflow-hidden border border-border/10 flex flex-col h-full flex-grow">
        {/* Product Image */}
        <div 
          className="relative aspect-[4/5] bg-surface-tint overflow-hidden shrink-0 cursor-zoom-in"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={product.images[0] || 'https://picsum.photos/seed/vintage/400/500'}
            alt={product.name}
            className="w-full h-full object-cover"
            style={zoomStyle}
            referrerPolicy="no-referrer"
            loading="lazy"
          />

          {/* Condition Badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className={`text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full ${getConditionStyle(product.condition)}`}>
              {product.condition}
            </span>
          </div>

          {/* Wishlist Toggle */}
          {onToggleSave && (
            <button
              onClick={(e) => onToggleSave(product.id, e)}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-text-primary hover:text-accent hover:scale-110 transition-all duration-300 z-30 cursor-pointer active:scale-95"
              id={`wishlist-toggle-${product.id}`}
              title={isSaved ? "Remove from wishlist" : "Save for later"}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-accent text-accent' : ''}`} />
            </button>
          )}

          {/* Sold Overlay */}
          {product.isSold && (
            <div className="absolute inset-0 bg-text-primary/60 backdrop-blur-[2px] flex items-center justify-center z-20">
              <span className="font-heading text-lg uppercase tracking-[0.2em] text-white border border-white/50 px-5 py-1.5 rotate-[-3deg]">
                Sold
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-grow justify-between">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-accent font-semibold">
                {categoryLabel}
              </span>
              <span className="text-[11px] font-mono text-text-secondary font-medium">
                {product.size.split('(')[0].trim()}
              </span>
            </div>

            <h3 className="font-heading text-[15px] text-text-primary leading-snug group-hover:text-accent transition-colors duration-300 line-clamp-1">
              {product.name}
            </h3>

            <p className="text-[12px] text-text-secondary line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price */}
          <div className="pt-3 mt-auto flex items-center justify-between">
            <span className="text-[17px] font-bold text-text-primary font-mono">
              ₱{product.price.toLocaleString()}
            </span>
            <span className="text-[11px] text-accent font-medium group-hover:translate-x-0.5 transition-transform duration-300">
              {product.isSold ? 'View details' : 'View →'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
