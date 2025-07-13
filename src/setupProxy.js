// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/reed', // This is the path you'll use in your axios request
    createProxyMiddleware({
      target: 'https://www.reed.co.uk', // The real API server
      changeOrigin: true,
      pathRewrite: {
        '^/api/reed': '/api/1.0', // Rewrite the path to match the Reed API structure
      },
    })
  );
  app.use(
    '/api/findwork',
    createProxyMiddleware({
      target: 'https://findwork.dev',
      changeOrigin: true,
      pathRewrite: {
        '^/api/findwork': '/api',
      },
    })
  );
  // You can add proxies for Adzuna and Jooble here too if they cause issues
};