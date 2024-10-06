/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_BASE_URL: "https://mobilstore.aymankanawi.info/api",
    SITE_KEY: "6Lf8yigqAAAAAOJAK-FeTazsJ3r72g0LcKSiNLHs",
    RECAPTCHA_SECRET_KEY: "6Lf8yigqAAAAAPKQ-Zxh9DcGVR4mmtd9_xSenjV3",
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
