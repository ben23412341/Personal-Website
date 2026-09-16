import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 defaults images.qualities to [75] and coerces anything else to
    // the nearest allowed value. Screenshots of dense UI need more than that.
    qualities: [75, 90],
  },
};

export default nextConfig;
