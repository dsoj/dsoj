/** @type {import('next').NextConfig} */

const nextConfig = {
  webpack: (config) => {
    config.resolve.alias["@"] = "./src";
    return config;
  },
  logging: {

  }
};

export default nextConfig;
