import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import setupSocketHandler from './logic/socketController.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow Vercel frontend to connect
        methods: ["GET", "POST"]
    }
});

const __dirname = path.resolve();
const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');

// Serve static files from the React app
app.use(express.static(distPath));

import fs from 'fs';

// ... (existing code)

// Catch-all route for React SPA or API status
app.get('*', (req, res) => {
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.setHeader('Content-Type', 'text/html');
        res.send(`
            <body style="background: #050510; color: #00ecff; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
                <div style="text-align: center; border: 1px solid #00ecff33; padding: 40px; border-radius: 20px; background: #ffffff05; backdrop-filter: blur(10px);">
                    <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px;">TOON ATTACKS BACKEND</h1>
                    <p style="color: #ffffff66; margin-top: 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Status: Online & Ready for Socket connections</p>
                    <div style="margin-top: 20px; font-size: 12px; color: #ffffff33;">(Frontend served separately via Vercel)</div>
                </div>
            </body>
        `);
    }
});

// Initialize game socket logic
setupSocketHandler(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
