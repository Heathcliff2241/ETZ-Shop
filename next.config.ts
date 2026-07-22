import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Keep the Express API running as Vercel serverless functions
  // All /api/* requests are handled by api/index.ts
  images: {
    remotePatterns: [
      { hostname: 'images.unsplash.com' },
      { hostname: '*.public.blob.vercel-storage.com' },
      { hostname: 'picsum.photos' },
    ],
    // Unoptimized for external URLs from DB that may vary — prevents build errors
    unoptimized: false,
  },
  // Suppress vendor chunk size warnings for large admin panel
  experimental: {},
};

export default nextConfig;
