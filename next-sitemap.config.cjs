/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL ?? "https://www.synapsoul.com/",
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ["/api/*", "/404"],
  robotsTxtOptions: {
    additionalSitemaps: [
      "https://www.synapsoul.com/server-sitemap.xml", // 動的なページ用のサイトマップ
    ],
  },
};
