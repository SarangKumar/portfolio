import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // The resume now lives on the Experience page.
    return [{ source: "/resume", destination: "/experience", permanent: true }];
  },
};

export default nextConfig;
