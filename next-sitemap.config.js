// next-sitemap.config.js
module.exports = {
  siteUrl: process.env.SITE_URL || "https://empathica.vercel.app/",
  generateRobotsTxt: true, // (optional) Generate a robots.txt file
  exclude: ["/api/*", "/admin/*", "/app/*"],
  // You can also add additional configuration options here
};
