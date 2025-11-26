const exclude = ["/api/*", "/cart/*", "/checkout/*", "/account/*"];

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://ivostores.com",
  generateRobotsTxt: true,
  changefreq: null,
  priority: null,
  sitemapSize: 5000,
  exclude,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
};
