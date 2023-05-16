// socket.io
const socket = io();

// get elements
const nameF = document.getElementById('nameform');
const nameI = document.getElementById('nameput');
const nameB = document.getElementById('namebutton');

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


// event listeners for the name input
nameB.addEventListener('click', function() {
    // get the name
    let name = nameI.value;
    // send the name to the server
    socket.emit('name', name);
    // hide the name input
    nameF.style.display = 'none';
    k.style.display = 'grid';
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