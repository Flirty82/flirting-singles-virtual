const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'client/public')));

app.use('/app', createProxyMiddleware({
    target: 'http://localhost:3001', // React dev server
    changeOrigin: true,
    pathRewrite: { '^app': '', // Remove /app prefix when forwarding
    },
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/public/index.html'));
});

app.get('/app/*', (req, res) => {
    // In production, serve the built React app
    if (process.env.NODE_ENV === 'production') {
        res.sendFile(path.join(__dirname, 'client/public/index.html'));
    } else {
        // In development, let the React dev server handle it
        res.redirect('http://localhost:3001' + req.originalUrl);
    }
});

app.listen(PORT, () => {
    console.log('Development server running on http://localhost:${PORT}');
    console.log('Welcome page: http://localhost:${PORT}/');
    console.log('React app: http://localhost:${PORT}/app');
    console.log('cd client && npm start');
});

// Package for root directory
{
    "name"; "flirting-singles-development",
    "version"; "1.0.0",
    "main"; "development-server.js",
    "scripts"; {
        "dev"; "node development-server.js",
        "dev:react"; "cd clioent && npm start",
        "dev:all"; "concurrently \"npm run dev\" \"npm run dev:react\"",
        "build"; "cd client && npm run build",
        "install:client"; "cd client && npm install"
    };
    "dependencies"; {
        "express"; "^4.18.2",
        "http-proxy-middleware"; "^2.0.6",
        "path"; "^0.12.7"
    };
    "devDependencies"; {
        "concurrently"; "^8.2.0"
    }

}
