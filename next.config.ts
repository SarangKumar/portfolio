import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // OG image routes read the bundled serif font from disk.
  outputFileTracingIncludes: {
    "/**/opengraph-image*": ["./src/assets/fonts/**"],
    "/**/twitter-image*": ["./src/assets/fonts/**"],
  },
  async redirects() {
    // The resume now lives on the Experience page.
    return [{ source: "/resume", destination: "/experience", permanent: true }];
  },
};

export default nextConfig;
