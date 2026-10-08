import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  // Dynamic filesystem reads are not reliably discovered by serverless tracing.
  outputFileTracingIncludes: { "/*": ["./installers/uptime-kuma/v1/*"] }
};

export default nextConfig;
