import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */

const withNextIntl = createNextIntlPlugin();
const nextConfig = {
  reactStrictMode: false,
  // output: 'export',
};

export default withNextIntl(nextConfig);
