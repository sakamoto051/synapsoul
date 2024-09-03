/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL ?? "https://synapsoul.vercel.app",
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ["/api/*", "/404"],
  robotsTxtOptions: {
    additionalSitemaps: [
      "https://synapsoul.vercel.app/server-sitemap.xml", // 動的なページ用のサイトマップ
    ],
  },
};
