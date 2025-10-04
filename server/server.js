const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (data) => {
        // Handle audio data from client
        if (data instanceof Buffer) {
            // Process audio data here
            console.log('Received audio data:', data.length);
            ws.send(JSON.stringify({
                type: 'vad',
                status: 'active'
            }));
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
