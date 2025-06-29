import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  env:{
    JWT_SECRET: process.env.JWT_SECRET,
  },
  images: {
    remotePatterns:[
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
    },
    ]

  }
};

export default nextConfig;
