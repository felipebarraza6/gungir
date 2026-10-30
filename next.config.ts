import type { NextConfig } from "next";

// Pages (staging y producción) definen NEXT_PUBLIC_BASE_PATH="/gungir".
// Sin esa variable el export sigue en la raíz, para un dominio propio futuro.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") || "";

const nextConfig: NextConfig = {
  output: "export",
  ...(basePath
    ? {
        basePath,
        assetPrefix: basePath,
        trailingSlash: true,
      }
    : {}),
  images: { unoptimized: true },
};

export default nextConfig;
