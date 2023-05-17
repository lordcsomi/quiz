// socket.io
const socket = io();

//--------- get elements
// the name input
const nameF = document.getElementById('nameform');
const nameI = document.getElementById('nameput');
const nameB = document.getElementById('namebutton');

// the waiting screen
const w = document.getElementById('waiting');
w.style.display = 'none';
const dw = document.getElementById('players'); // div for the players

// the question
const k = document.getElementById('kahoot');
k.style.display = 'none';

// the question (input)
const a1 = document.getElementById('ans1');
const a2 = document.getElementById('ans2');
const a3 = document.getElementById('ans3');
const a4 = document.getElementById('ans4');

// for clicking on the answer boxes
const b1 = document.getElementById('answerbox1');
const b2 = document.getElementById('answerbox2');
const b3 = document.getElementById('answerbox3');
const b4 = document.getElementById('answerbox4');

// global variables
let users = {}; // socket.id -> username, answers, score
let players = []; // array of names of players
let myName = ''; // name of the current player


// event listeners for the name input
nameB.addEventListener('click', function() {
    let name = nameI.value;

    // check if the name is valid
    if (name.length < 1) {
        alert('Please enter a name.');
        return;
    } if (name.length > 15) {
        alert('Please enter a shorter name.');
        return;
    };

    myName = name;
    socket.emit('name', myName);

});
    


// event listeners for the multiple choice answers
b1.addEventListener('click', function() {
    a1.checked = true;
    a2.checked = false;
    a3.checked = false;
    a4.checked = false;
});
b2.addEventListener('click', function() {
    a1.checked = false;
    a2.checked = true;
    a3.checked = false;
    a4.checked = false;
});
b3.addEventListener('click', function() {
    a1.checked = false;
    a2.checked = false;
    a3.checked = true;
    a4.checked = false;
});
b4.addEventListener('click', function() {
    a1.checked = false;
    a2.checked = false;
    a3.checked = false;
    a4.checked = true;
});

// socket.io client listens to the server
socket.on('alert', (message) => {
    alert(message);
});

socket.on('page', (page) => {
    if (page == 'waiting') {
        nameF.style.display = 'none';
        w.style.display = 'flex';
    } else if (page == 'question') {
        k.style.display = 'none';
        q.style.display = 'grid';
    };
});

// disconnect
socket.on('disconnect', () => {
    console.log('disconnected');
    location.reload();
});