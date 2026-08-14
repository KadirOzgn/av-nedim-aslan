import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
