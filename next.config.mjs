/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // API_BASE_URL: "https://api.logicprodev.com/api",
    API_BASE_URL: "http://127.0.0.1:8000/api",
    SITE_KEY: "6Lf8yigqAAAAAOJAK-FeTazsJ3r72g0LcKSiNLHs",
    RECAPTCHA_SECRET_KEY: "6Lf8yigqAAAAAPKQ-Zxh9DcGVR4mmtd9_xSenjV3",
    REVERB_APP_ID : '959138',
    REVERB_APP_KEY : '7kloc5wo6lks4gldux23',
    REVERB_APP_SECRET : 'mai5uptgfxdmc2jlcu2k',
    REVERB_HOST : '127.0.0.1',
    REVERB_PORT : '8080',
    REVERB_SCHEME : 'http',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000', // تأكد من مطابقة المنفذ مع التطبيق الخلفي الخاص بك
        pathname: '/storage/**', // أو المسار الخاص بالصور
      },
    ],
  },
  output: "standalone",
};

export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   env: {
//     API_BASE_URL: "https://api.logicprodev.com/api",
//     // API_BASE_URL: "http://127.0.0.1:8000/api",
//     SITE_KEY: "6Lf8yigqAAAAAOJAK-FeTazsJ3r72g0LcKSiNLHs",
//     RECAPTCHA_SECRET_KEY: "6Lf8yigqAAAAAPKQ-Zxh9DcGVR4mmtd9_xSenjV3",
//     REVERB_APP_ID : '959138',
//     REVERB_APP_KEY : '7kloc5wo6lks4gldux23',
//     REVERB_APP_SECRET : 'mai5uptgfxdmc2jlcu2k',
//     REVERB_HOST : '127.0.0.1',
//     REVERB_PORT : '8080',
//     REVERB_SCHEME : 'http',
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'api.logicprodev.com',
//         // port: '8000', // تأكد من مطابقة المنفذ مع التطبيق الخلفي الخاص بك
//         // pathname: '/storage/**', // أو المسار الخاص بالصور
//       },
//     ],
//   },
//   output: "standalone",
// };

// export default nextConfig;
