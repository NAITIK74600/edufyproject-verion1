import type { NextConfig } from "next";

// NOTE (backend migration): this app now has real server-side login,
// registration, and lead-capture routes under src/app/api/* plus src/proxy.ts
// (session-gated /dashboard). Next.js static export (`output: "export"`)
// cannot run any of that — it can only produce static HTML — so it has been
// removed here. The site now needs a Node.js-capable host (Vercel is the
// simplest since Next.js is built by the same team). See
// .github/workflows/deploy.yml, which has been switched to manual-only until
// hosting is migrated off GitHub Pages.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
