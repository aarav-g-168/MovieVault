import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["static.tvmaze.com"], // ✅ Allow TVMaze images
  },
};

export default nextConfig;
