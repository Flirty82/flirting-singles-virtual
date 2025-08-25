const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const webpack = require('webpack');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from client/public for the welome page
app.use(express.static(path.join(__dirname, 'client/public')));

// Proxy /app routes to React development server (when running)
app.use('/app', createProxyMiddleware({
    target: 'http://localhost:3001', // React dev server
    changeOrigin: true,
    '^/app': '', // Remove /app prefix when forwarding
}));

// Serve welcome page for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/public/index.html'));
}, (req, res) => {
    // In development, this will be handled by the proxy above
    res.redirect('/')
}
)

app.listen(PORT, () => {
    console.log('Development server running on http://localhost:${PORT}');
    console.log('Welcome page available at http://localhost:${PORT}/');
    console.log('React app available at http://localhost:${PORT}/app');
    console.log('\n Make sure your React development server is running on port 3001.');
    console.log('  cd client && npm start');
});