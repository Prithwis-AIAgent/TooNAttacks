import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import setupSocketHandler from '../logic/socketHandler.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

setupSocketHandler(io);

export default (req, res) => {
    if (!res.socket.server.io) {
        res.socket.server.io = io;
        io.attach(res.socket.server);
    }
    app(req, res);
};
