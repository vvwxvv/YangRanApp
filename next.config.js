/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: [
    "antd",
    "@ant-design/cssinjs",
    "@ant-design/icons",
    "@ant-design/icons-svg",
    "rc-util",
    "rc-pagination",
    "rc-picker",
    "rc-table",
    "rc-tree",
    "rc-input",
    "rc-select",
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_APP_WEBSIT_FULL_ADDRESS || '**',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_APP_WEBSIT_SIMPLE_ADDRESS || '**',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '**',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
          { key: 'Access-Control-Max-Age', value: '86400' },
        ],
      },
    ];
  },
  // No redirects: `/` renders the sectioned home page (src/app/page.jsx).
  // (A 307 `/` → `/artworks` redirect used to live here.)
  serverExternalPackages: ['@aws-sdk/client-s3'],
};

module.exports = nextConfig;