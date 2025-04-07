import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    experimental: {
        taint: true,
    },
    env: {

    }
};

export default nextConfig;
