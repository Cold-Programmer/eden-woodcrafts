/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      // Covers encrypted-tbn0/1/2/3.gstatic.com — Google Images thumbnails.
      { protocol: "https", hostname: "*.gstatic.com" }
    ]
  },
  // Silences the "cross origin request" dev warning when accessing the dev
  // server from another device on your LAN (e.g. http://192.168.x.x:3000).
  allowedDevOrigins: ["localhost", "127.0.0.1", "192.168.0.0/16"]
};
module.exports = nextConfig;
