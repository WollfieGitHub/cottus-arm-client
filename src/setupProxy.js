const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    const target = 'http://127.0.0.1:8080/';
    app.use(
        '/api',
        createProxyMiddleware({
            target: target,
            logLevel: "debug",
            pathRewrite: {
                '^/api': '/api' //remove /service/api
            },
        })
    );
};