/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ["avatarfiles.alphacoders.com"],
    },
    reactStrictMode: false, // Disable Strict Mode
    typescript: {
      ignoreBuildErrors: true,
    },
};

module.exports = nextConfig;
