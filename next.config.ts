import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiHost = apiUrl ? (() => { try { return new URL(apiUrl).hostname } catch { return "" } })() : "";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: apiHost
      ? [{ protocol: "https", hostname: apiHost, pathname: "/**" }]
      : [],
  },
};

export default nextConfig;
