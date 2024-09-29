/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_BASE_URL: "https://mobilstore.aymankanawi.info/api",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mobilstore.aymankanawi.info",
      },
    ],
  },
  output: "standalone",
};

export default nextConfig;
