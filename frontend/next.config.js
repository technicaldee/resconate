const path = require("node:path");
module.exports = {
  pageExtensions: ["screen.js"],
  devIndicators: false,
  agentRules: false,
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, ".."),
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_INTERNAL_URL || "http://127.0.0.1:3001"}/api/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      { source: "/hr", destination: "/app", permanent: false },
      { source: "/hr/lite/:path*", destination: "/app", permanent: false },
      { source: "/hr/remote/login", destination: "/login", permanent: false },
      {
        source: "/hr/remote/forgot",
        destination: "/forgot-password",
        permanent: false,
      },
      { source: "/hr/remote/dashboard", destination: "/app", permanent: false },
      ...[
        "hr-login",
        "employee-login",
        "employee-portal",
        "hr-dashboard",
        "admin-dashboard",
      ].map((p) => ({
        source: `/${p}`,
        destination: "/app",
        permanent: false,
      })),
      { source: "/d2e/:path*", destination: "/services", permanent: false },
      { source: "/checkout", destination: "/app/settings", permanent: false },
      { source: "/team", destination: "/about", permanent: false },
      { source: "/case-studies", destination: "/about", permanent: false },
      { source: "/resources", destination: "/help", permanent: false },
      { source: "/portfolio", destination: "/services", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};
