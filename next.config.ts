/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // تجاهل أخطاء وتحذيرات ESLLint أثناء البناء
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
// أو لو تستعمل ESM:
// export default nextConfig;
