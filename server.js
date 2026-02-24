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

// Catch-all route for React SPA
app.get('*', (req, res) => {
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error("BUILD ERROR: dist/index.html not found.");
            console.error("Make sure to run 'npm run build' before starting the server.");
            console.error("Path attempted:", indexPath);
            res.status(500).send("Server Error: Build files missing. Please run build step on deployment.");
        }
    });
});

// Initialize game socket logic
setupSocketHandler(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
