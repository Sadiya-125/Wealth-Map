import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "lzlowmfbbpftwtosuany.supabase.co",
      "ap.rdcpix.com",
      "img.clerk.com",
    ],
  },
};

export default nextConfig;
