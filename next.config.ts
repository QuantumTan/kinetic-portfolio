import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["gsap", "@gsap/react"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
