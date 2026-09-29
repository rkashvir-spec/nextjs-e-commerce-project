import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["files.stripe.com"]
  },
  reactCompiler: true,
};

export default nextConfig;
