/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
      MONGO_URI: process.env.MONGO_URI
  }
};