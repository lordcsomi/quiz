// express server with socket.io
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require("path");

// global variables
let users = {}; // socket.id -> username, answers, score
let players = []; // array of names of players


// serve static files from the public directory
app.use(express.static('public'));

// if the client requests the /admin page
app.get('/admin', (req, res) => {
    const filePath = path.join(__dirname, '../admin/index.html');
    res.sendFile(filePath);
});

// start the express web server listening on 8080
server.listen(8080, () => {
    console.log('listening on port 8080');
    }
);

// socket.io server listens to our app
io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('name', (name) => {
        // check if the name is valid
        if (name.length < 1) {
            socket.emit('alert', 'Please enter a name.');
            return;
        } if (name.length > 15) {
            socket.emit('alert', 'Please enter a shorter name.');
            return;
        };

        // check if the name is already taken
        for (let i = 0; i < players.length; i++) {
            if (players[i] == name) {
                socket.emit('alert', 'That name is already taken.');
                return;
            };
        };

        // add the player to the list of players
        players.push(name);

        // add the player to the list of users
        users[socket.id] = {
            name: name,
            answers: [],
            score: 0
        };

        // send the player to the next screen
        socket.emit('page', 'waiting'); 

        console.log('new player: ' + name);
    });


    socket.on('disconnect', () => {
        // check if the client is in the users dictionary
        if (socket.id in users) {
            console.log('user disconnected: ' + users[socket.id].name);

            // remove the player from the list of players
            for (let i = 0; i < players.length; i++) {
                if (players[i] == users[socket.id].name) {
                    players.splice(i, 1);
                };
            };

            // remove the player from the list of users
            delete users[socket.id];

        }
    });
});