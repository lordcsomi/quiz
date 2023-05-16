// express server with socket.io

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// serve static files from the public directory
app.use(express.static('public'));

// start the express web server listening on 8080
server.listen(8080, () => {
    console.log('listening on port 8080');
    }
);

// socket.io server listens to our app
io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});