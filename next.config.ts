import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore - Ignore type error for eslint config
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/makaleler',
        destination: '/hukuk-notlari',
        permanent: true,
      },
      {
        source: '/makaleler/:slug',
        destination: '/hukuk-notlari/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
