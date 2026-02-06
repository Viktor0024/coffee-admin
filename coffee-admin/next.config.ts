import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  // Для мобильного приложения: GET /orders/:id → тот же ответ, что и GET /api/orders/:id
  async rewrites() {
    return [{ source: "/orders/:id", destination: "/api/orders/:id" }];
  },
};

export default nextConfig;
