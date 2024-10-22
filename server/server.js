// express server with socket.io
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require("path");
const os = require('os');

// global variables
const version = '0.8.0';
const environment = 'development';
const host = 'localhost';
const port = 8080;
let gameRunning = false;

// questions
let questions = [
    { 
        question: 'Which station in the Moscow Metro has a design that includes sculptures of soldiers, athletes, and workers?',
        options: ['Kievskaya (Киевская)', 'Park Pobedy (Парк Победы)', 'Ploshchad Revolyutsii (Площадь Революции)', 'Arbatskaya (Арбатская)'],
        correct: 2,
        time: 15
    },
    {
        question: 'What year did the Moscow Metro first open?',
        options: ['1925', '1935', '1940', '1950'],
        correct: 1,
        time: 10
    },
    {
        question: 'Which color is typically used for the oldest line on the Moscow Metro map?',
        options: ['Green', 'Red', 'Blue', 'Yellow'],
        correct: 1,
        time: 10
    },
    {
        question: 'Which of these animals can be seen "riding" the Moscow Metro from time to time?',
        options: ['Cats', 'Dogs', 'Bears', 'Wolves'],
        correct: 1,
        time: 10
    },
    {
        question: 'How many circle lines does the Moscow Metro have?',
        options: ['1', '2', '3', '4'],
        correct: 2,
        time: 10
    },
    {
        question: 'What is the busiest metro system in Europe?',
        options: ['Berlin U-Bahn', 'London Underground', 'Moscow Metro', 'Paris Métro'],
        correct: 2,
        time: 15
    },
    {
        question: 'How many million passengers use the Moscow Metro every day on average?',
        options: ['5 million', '6 million', '7.5 million', '9 million'],
        correct: 2,
        time: 10
    },
    {
        question: 'How many minutes would it take to travel the longest uninterrupted journey on the Moscow Metro?',
        options: ['10 minutes', '12 minutes', '15 minutes', '20 minutes'],
        correct: 2,
        time: 10
    },
    {
        question: 'How many stations does the Moscow Metro have with artistic decorations featuring chandeliers, mosaics, or sculptures?',
        options: ['40 stations', '60 stations', '80 stations', '100 stations'],
        correct: 2,
        time: 15
    },
    {
        question: 'How many different colors are used to identify lines on the Moscow Metro map?',
        options: ['10', '12', '15', '18'],
        correct: 2,
        time: 10
    },
    {
        question: 'How many pets (mainly dogs) have been known to regularly ride the Moscow Metro without owners, according to reports?',
        options: ['10', '20', '30', '40'],
        correct: 2,
        time: 15
    },
    {
        question: 'How many lines does the Moscow Metro currently operate?',
        options: ['15 lines', '17 lines', '19 lines', '21 lines'],
        correct: 2,
        time: 10
    },
    {
        question: 'How many meters below ground is the deepest part of the Moscow Metro?',
        options: ['50 meters', '60 meters', '73 meters', '80 meters'],
        correct: 2,
        time: 10
    },
    {
        question: 'In which year did the Moscow Metro first begin operating?',
        options: ['1930', '1935', '1940', '1945'],
        correct: 1,
        time: 10
    },
    {
        question: 'How many different chandeliers can be found at Komsomolskaya Station?',
        options: ['5', '6', '8', '10'],
        correct: 2,
        time: 15
    },
    {
        question: 'What is the maximum number of seconds for the shortest interval between trains during peak hours on the Moscow Metro?',
        options: ['60 seconds', '70 seconds', '80 seconds', '90 seconds'],
        correct: 2,
        time: 10
    }
];

let questionNumber = 0;
let questionTime = Date.now();
const maxPointPerQuestion = 1000;

let users = {}; // socket.id -> username, answers, score
let players = []; // array of names of players
let expectedPlayers = 14; // number of players expected to join

let exampleUsers = {
    'socket1': {
        name: 'user1',
        socket: 'socket1',
        answers: [0, 1, 2, 3, 0],
        score: [1000, 1000, 1000, 1000, 1000],
        state : 'end',
    },
    'socket2': {
        name: 'user2',
        socket: 'socket2',
        answers: [0, 1, 2, 3, 0],
        score: [1000, 1000, 1000, 1000, 1000],
        state : 'end',
    },
};


// serve static files from the public directory
app.use(express.static('public'));

// if the client requests the /admin page
app.get('/admin', (req, res) => {
    const filePath = path.join(__dirname, '../admin/index.html');
    res.sendFile(filePath);
    console.log('admin page requested');
});

// start the express web server listening on 8080
server.listen(port, function () {
    const ip = Object.values(os.networkInterfaces())
      .flatMap((iface) => iface.filter((info) => info.family === 'IPv4' && !info.internal))
      .map((info) => info.address)[0];
      console.log(`Server version: ${version}`);
      console.log(`Server environment: ${environment}`);
      console.log(`Server listening on http://${host}:${port}`);
      console.log(`Server listening on http://${ip}:8080`);
  });

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
            socket: socket.id,
            answers: [],
            score: [],
            state : 'waiting',
            ingame : false,
        };

        // send the player to the next screen
        socket.emit('page', 'waiting'); 

        // send the player the expected number of players
        socket.emit('expectedPlayers', expectedPlayers);

        // emit the list of players to all clients
        io.emit('players', players);


        console.log('new player: ' + name);
    });

    socket.on('answer', (answer) => {
        // check if the client is in the users dictionary
        //console.log('recieved: ' + answer);
        if (socket.id in users) {
            // check if the user is in the "question" state
            //console.log('is a user');
            if (users[socket.id].state == 'question') {
                // check if the user has already answered the question
                //console.log('is in question');
                if (users[socket.id].answers.length < questionNumber + 1) {
                    // add the answer to the user's answers
                    //console.log('has not answered');
                    users[socket.id].answers.push(answer);
                    console.log(users[socket.id].name + ' answered: ' + answer + ' in ' + (Date.now() - questionTime) + 'ms');

                    // calculate the score
                    let score = 0;
                    if (answer == questions[questionNumber].correct) {
                        // give the user points based on how fast they answered the question
                        score = Math.round(maxPointPerQuestion - (maxPointPerQuestion * (Date.now() - questionTime) / (questions[questionNumber].time * 1000)));
                    }
                    // add the score to the user's score
                    users[socket.id].score.push(score);
                    console.log(users[socket.id].name + ' scored: ' + score);

                    // send the user to the sent answer page
                    io.to(users[socket.id].socket).emit('page', 'waitforscore');
                    users[socket.id].state = 'waitforscore';
                }
            }
        }
    });

    socket.on('disconnect', () => {
        // check if the client is in the users dictionary
        if (socket.id in users) {
            socket.broadcast.emit('player left', users[socket.id].name);
            console.log('user disconnected: ' + users[socket.id].name);

            // remove the player from the list of players
            for (let i = 0; i < players.length; i++) {
                if (players[i] == users[socket.id].name) {
                    players.splice(i, 1);
                };
            };

            // remove the player from the list of users
            delete users[socket.id];

            // emit the list of players to all clients
            io.emit('players', players);
        }
    });

    // admin page
    socket.on('setExpectedPlayers', (value) => {
        expectedPlayers = value;
        console.log('expected players: ' + expectedPlayers);
        io.emit('expectedPlayers', expectedPlayers);
    });

    socket.on('startQuiz', () => {
        console.log('starting quiz');
        if (gameRunning) {
            console.log('game already running');
            return;
        }
        gameRunning = true;

        // for every user if the user state is waiting
        for (let user in users) {
            if (users[user].state == 'waiting') {

                // send the user to the question page
                io.to(users[user].socket).emit('page', 'question');

                // set the user to question
                users[user].state = 'question';
                users[user].ingame = true;
            }
        }    
        quiz();   
    });

    /*socket.on('stop', () => {
        // restart server
        console.log('stopping server');
        process.exit();
    }); */
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
  
async function quiz() {
    // Loop through the questions
    for (let i = 0; i < questions.length; i++) {
        // if there are no users in game
        const currentQuestion = questions[i].question;
        questionNumber = i;
        questionTime = Date.now();
        const currentOptions = questions[i].options;
        const correctAnswer = questions[i].correct;
        const timeLimit = questions[i].time;

        console.log('\n');
        console.log('question: ' + currentQuestion);
        console.log('options: ' + currentOptions);
        console.log('correct: ' + correctAnswer);
        console.log('time: ' + timeLimit + '\n');

        // Send the question to all users in the "question" state
        for (const user in users) {
            if (users[user].state === 'question') {
                io.to(users[user].socket).emit('question', currentQuestion, currentOptions, timeLimit);
                //console.log('question sent to ' + users[user].name);
            }
        }
        console.log('question sent to all users');

        // Wait for all users to submit their answers or until the time limit is reached
        const answersPromise = new Promise((resolve) => {
            let answeredCount = 0;

            const checkAnswers = setInterval(() => {
            let allAnswered = true;

            // Check if all users have submitted their answers
            for (const user in users) {
                if (users[user].state === 'question' && users[user].answers.length < i + 1) {
                    allAnswered = false;
                    break;
                }
            }

            // If all users have answered or the time limit is reached, resolve the promise
            if (allAnswered || answeredCount >= timeLimit) {
              clearInterval(checkAnswers);
              resolve();
            }

            answeredCount++;
          }, 1000);
        });

        // Wait for the promise to resolve or until the time limit is reached
        await Promise.race([answersPromise, sleep(timeLimit * 1000)]);

        // if one of the users has not answered after the time limit is reached
        for (const user in users) {
            if (users[user].state === 'question' && users[user].answers.length < i + 1) {
                users[user].answers.push(-1);
                users[user].score.push(0);
                users[user].state = 'waitforscore';
                console.log(users[user].name + ' did not answer in time');
            }
        }

        // every user has answered or the time limit is reached ---------------------------------------------

        // send out the corrct answer to all users in the "waitforscore" state
        for (const user in users) {
            if (users[user].state === 'waitforscore') {
                io.to(users[user].socket).emit('correctAnswer', correctAnswer);
            }
        }

        // Send if the user's answer was correct or not to all users in the "waitforscore" state
        for (const user in users) {
            if (users[user].state === 'waitforscore') {
                if (users[user].score[i] > 0) {
                    io.to(users[user].socket).emit('correct', users[user].score[i]);
                    io.to(users[user].socket).emit('page', 'correct');
                } else {
                    io.to(users[user].socket).emit('wrong', users[user].score[i]);
                    io.to(users[user].socket).emit('page', 'wrong');
                }
            }
        }

        // wait for 5 seconds
        await sleep(5000);

        // if last round
        if (i == questions.length - 1) {
            break;
        }

        // create the leaderboard the top 5 users and their scores
        leadrboard = []; // array of objects {name, score} in descending order
        for (const user in users) {
            if (users[user].ingame){
                // add up the user's score
                let score = 0;
                for (let j = 0; j < users[user].score.length; j++) {
                    score += users[user].score[j];
                }
                // add the user to the leaderboard
                leadrboard.push({name: users[user].name, score: score});
            }
        }
        leadrboard.sort((a, b) => (a.score < b.score) ? 1 : -1);
        console.log(leadrboard);


        
        // send the user to the leaderboard page
        for (const user in users) {
            if (users[user].state === 'waitforscore') {
                io.to(users[user].socket).emit('page', 'leaderboard');
                io.to(users[user].socket).emit('leaderboard', leadrboard);
                users[user].state = 'leaderboard';
                console.log(users[user].name + ' sent to leaderboard');
            }
        }

        // wait for 5 seconds
        await sleep(5000);

        // set every user who is in game to question
        for (const user in users) {
            if (users[user].ingame) {
                users[user].state = 'question';
                io.to(users[user].socket).emit('page', 'question');
            }
        }

        console.log('next question --------------------');
    }
  
    // End the quiz and show the results
    end();
}

async function end() { // End the quiz and show the results
    console.log('ending quiz');

    // create podium 
    // is the same as leaderboard 
    leadrboard = []; // array of objects {name, score} in descending order
    for (const user in users) {
        if (users[user].ingame){
            // add up the user's score
            let score = 0;
            for (let j = 0; j < users[user].score.length; j++) {
                score += users[user].score[j];
            }
            // add the user to the leaderboard
            leadrboard.push({name: users[user].name, score: score});
        }
    }
    leadrboard.sort((a, b) => (a.score < b.score) ? 1 : -1);
    console.log(leadrboard);

    // send users to podium page
    for (const user in users) {
        if (users[user].ingame) {
            io.to(users[user].socket).emit('page', 'podium');
            io.to(users[user].socket).emit('podium', leadrboard);
        }
    }

    // wait for 5 seconds
    await sleep(30000);

    // send users to end page
    for (const user in users) {
        if (users[user].ingame) {
            io.to(users[user].socket).emit('page', 'end');
            users[user].state = 'end';
            users[user].ingame = false;
        }
    }

};
