import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["zauxtgvbeoiowuoeljtn.supabase.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig
