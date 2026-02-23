import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import setupSocketHandler from './logic/socketHandler.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const __dirname = path.resolve();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all route for React SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Initialize game socket logic
setupSocketHandler(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
