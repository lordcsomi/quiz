// socket.io
const socket = io();

//--------- get elements from the html ---------//
// the name input
const nameF = document.getElementById('nameform');
const nameI = document.getElementById('nameput');
const nameB = document.getElementById('namebutton');

// the waiting screen
const w = document.getElementById('waiting');
w.style.display = 'none';
const dw = document.getElementById('players'); // div for the players
const pc = document.getElementById('playercounter'); // player counter: has a p element inside 10/x players

// time bar
let timerBar = document.getElementById('timer-bar');

// the question 
const k = document.getElementById('kahoot');
const kTf = document.getElementById('kahoot-tf');
const kS = document.getElementById('kahoot-slider');
const kI = document.getElementById('kahoot-input-number');
k.style.display = 'none';
kTf.style.display = 'none';
kS.style.display = 'none';
kI.style.display = 'none';

// the question (input)
let a1 = document.getElementById('ans1');
let a2 = document.getElementById('ans2');
let a3 = document.getElementById('ans3');
let a4 = document.getElementById('ans4');

// for clicking on the answer boxes
let b1 = document.getElementById('answerbox1');
let b2 = document.getElementById('answerbox2');
let b3 = document.getElementById('answerbox3');
let b4 = document.getElementById('answerbox4');

// the true/false question
let tFi1 = document.getElementById('tf-ans1');
let tFi2 = document.getElementById('tf-ans2');

let tFb1 = document.getElementById('tf-true');
let tFb2 = document.getElementById('tf-false');

// the slider question
let sI = document.getElementById('slider-input');

// the input question
let iI = document.getElementById('number-guess');
let iB = document.getElementById('number-guess-submit');

// for waiting for score
const s = document.getElementById('score');

// correct
const c = document.getElementById('correct');
const cp = document.getElementById('yscore'); // correct points

// wrong
const r = document.getElementById('wrong');
const rp = document.getElementById('nscore'); // wrong points

// leaderboard
const l = document.getElementById('leaderboard');
const lb = document.getElementById('leaderboardlist'); // leaderboard list

// podium
const p = document.getElementById('podium');
const p1 = document.getElementById('p1');
const p2 = document.getElementById('p2');
const p3 = document.getElementById('p3');

// end
const e = document.getElementById('end');


// --------- variables ---------//
let players = []; // array of names of players
let myName = ''; // name of the current player
let expectedPlayers = 0; // number of players expected to join
let reaminingTime = 0; // remaining time for the question


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
    console.log('a1');
});
b2.addEventListener('click', function() {
    a1.checked = false;
    a2.checked = true;
    a3.checked = false;
    a4.checked = false;
    console.log('a2');
});
b3.addEventListener('click', function() {
    a1.checked = false;
    a2.checked = false;
    a3.checked = true;
    a4.checked = false;
    console.log('a3');
});
b4.addEventListener('click', function() {
    a1.checked = false;
    a2.checked = false;
    a3.checked = false;
    a4.checked = true;
    console.log('a4');
});

// socket.io client listens to the server
socket.on('alert', (message) => {
    alert(message);
});

socket.on('page', (page) => {
    if (page == 'waiting') {
        console.log('waiting');
        nameF.style.display = 'none';
        w.style.display = 'flex';
        k.style.display = 'none';
        s.style.display = 'none';
        c.style.display = 'none';
        r.style.display = 'none';
        l.style.display = 'none';
        timerBar.style.display = 'none';
    } else if (page == 'question') {
        console.log('question');
        w.style.display = 'none';
        k.style.display = 'grid';
        s.style.display = 'none';
        c.style.display = 'none';
        r.style.display = 'none';
        l.style.display = 'none';
        timerBar.style.display = 'block';
    } else if (page == 'waitforscore') {
        console.log('waitforscore');
        k.style.display = 'none';
        s.style.display = 'flex';
        c.style.display = 'none';
        r.style.display = 'none';
        l.style.display = 'none';
        timerBar.style.display = 'none';
    } else if (page == 'correct') {
        console.log('correct');
        s.style.display = 'none';
        c.style.display = 'flex';
        k.style.display = 'none';
        l.style.display = 'none';
        timerBar.style.display = 'none';
    } else if (page == 'wrong') {
        console.log('wrong');
        s.style.display = 'none';
        r.style.display = 'flex';
        k.style.display = 'none';
        l.style.display = 'none';
        timerBar.style.display = 'none';
    } else if (page == 'leaderboard') {
        console.log('leaderboard');
        s.style.display = 'none';
        c.style.display = 'none';
        r.style.display = 'none';
        k.style.display = 'none';
        l.style.display = 'flex';
        p.style.display = 'none';
        timerBar.style.display = 'none';
    } else if (page == 'podium') {
        console.log('podium');
        s.style.display = 'none';
        c.style.display = 'none';
        r.style.display = 'none';
        k.style.display = 'none';
        l.style.display = 'none';
        p.style.display = 'flex';
        timerBar.style.display = 'none';
    } else if (page == 'end') {
        console.log('end');
        s.style.display = 'none';
        c.style.display = 'none';
        r.style.display = 'none';
        k.style.display = 'none';
        l.style.display = 'none';
        p.style.display = 'none';
        e.style.display = 'flex';
        timerBar.style.display = 'none';
    } else {
        console.log('page not found');
    }
});

socket.on('expectedPlayers', (ep) => {
    expectedPlayers = ep;
    pc.innerHTML = players.length + '/' + expectedPlayers + ' players';
});

socket.on('players', (p) => {
    players = p;
    dw.innerHTML = '';

    for (let i = 0; i < players.length; i++) {
        let p = document.createElement('p');
        p.innerHTML = players[i];
        p.classList.add('player');

        if (players[i] == myName) {
            p.classList.add('me');
        }

        dw.appendChild(p);
    };

    pc.innerHTML = players.length + '/' + expectedPlayers + ' players';
});

socket.on('question', (nq, no, tl) => {
    /* testing score system
    after 5 seconds send the answer a1
    setTimeout(function() {
        socket.emit('answer', 0);
    }, 5000); */

    // set up the timer
    reaminingTime = tl;
    let maxTime = tl;

    // Clear any previous content
    k.innerHTML = '';

    // Create the timer bar
    timerBar.style.width = '100%';
    timerBar.style.backgroundColor = 'green';

    // Update the timer bar every second
    let timer = setInterval(function() {
        reaminingTime--;
        let widthPercent = (reaminingTime / maxTime) * 100;
        timerBar.style.width = widthPercent + '%';

        // Gradually change color from green to red
        let redValue = 255 - Math.floor((reaminingTime / maxTime) * 255);
        let greenValue = Math.floor((reaminingTime / maxTime) * 255);
        timerBar.style.backgroundColor = `rgb(${redValue}, ${greenValue}, 0)`;

        if (reaminingTime < 1) {
            clearInterval(timer);
        }
    }, 1000);

    // Create the question
    let q = document.createElement('p');
    q.classList.add('question');
    q.innerHTML = nq;

    // Create the answer boxes
    let ab1 = document.createElement('div');
    ab1.classList.add('answerbox');
    ab1.classList.add('ans1');
    ab1.id = 'answerbox1';
    let ab2 = document.createElement('div');
    ab2.classList.add('answerbox');
    ab2.classList.add('ans2');
    ab2.id = 'answerbox2';
    let ab3 = document.createElement('div');
    ab3.classList.add('answerbox');
    ab3.classList.add('ans3');
    ab3.id = 'answerbox3';
    let ab4 = document.createElement('div');
    ab4.classList.add('answerbox');
    ab4.classList.add('ans4');
    ab4.id = 'answerbox4';

    // Create the radio buttons
    let r1 = document.createElement('input');
    r1.type = 'radio';
    r1.id = 'ans1';
    r1.name = 'q1';
    let r2 = document.createElement('input');
    r2.type = 'radio';
    r2.id = 'ans2';
    r2.name = 'q1';
    let r3 = document.createElement('input');
    r3.type = 'radio';
    r3.id = 'ans3';
    r3.name = 'q1';
    let r4 = document.createElement('input');
    r4.type = 'radio';
    r4.id = 'ans4';
    r4.name = 'q1';

    // Create the labels
    let l1 = document.createElement('label');
    l1.for = 'ans1';
    l1.innerHTML = no[0];
    let l2 = document.createElement('label');
    l2.for = 'ans2';
    l2.innerHTML = no[1];
    let l3 = document.createElement('label');
    l3.for = 'ans3';
    l3.innerHTML = no[2];
    let l4 = document.createElement('label');
    l4.for = 'ans4';
    l4.innerHTML = no[3];

    // Add the radio buttons and labels to the answer boxes
    ab1.appendChild(r1);
    ab1.appendChild(l1);
    ab2.appendChild(r2);
    ab2.appendChild(l2);
    ab3.appendChild(r3);
    ab3.appendChild(l3);
    ab4.appendChild(r4);
    ab4.appendChild(l4);

    // Add the question and answer boxes to the page
    k.appendChild(q);
    k.appendChild(ab1);
    k.appendChild(ab2);
    k.appendChild(ab3);
    k.appendChild(ab4);

    // Get the answer boxes
    b1 = document.getElementById('answerbox1');
    b2 = document.getElementById('answerbox2');
    b3 = document.getElementById('answerbox3');
    b4 = document.getElementById('answerbox4');

    // Get the radio buttons
    a1 = document.getElementById('ans1');
    a2 = document.getElementById('ans2');
    a3 = document.getElementById('ans3');
    a4 = document.getElementById('ans4');

    // Event listeners for the multiple choice answers
    b1.addEventListener('click', function() {
        a1.checked = true;
        a2.checked = false;
        a3.checked = false;
        a4.checked = false;
        socket.emit('answer', 0);
        console.log('a1');
        clearInterval(timer);
    });
    b2.addEventListener('click', function() {
        a1.checked = false;
        a2.checked = true;
        a3.checked = false;
        a4.checked = false;
        socket.emit('answer', 1);
        console.log('a2');
        clearInterval(timer);
    });
    b3.addEventListener('click', function() {
        a1.checked = false;
        a2.checked = false;
        a3.checked = true;
        a4.checked = false;
        socket.emit('answer', 2);
        console.log('a3');
        clearInterval(timer);
    });
    b4.addEventListener('click', function() {
        a1.checked = false;
        a2.checked = false;
        a3.checked = false;
        a4.checked = true;
        socket.emit('answer', 3);
        console.log('a4');
        clearInterval(timer);
    });
});

socket.on('correct', (score) => {
    cp.innerHTML = score;
});

socket.on('wrong', (score) => {
    rp.innerHTML = score;
});

socket.on('leaderboard', (leaaderboard) => {
    //console.log('leaderboard');
    // lb is a sorted in descending order array of objects {name: name, score: score}
    /*
    <p class="topplayer">Player 1 <span class="topscore">1000</span></p>
    <p class="topplayer">Player 2 <span class="topscore">1000</span></p> 
    */

    // clear the leaderboard
    lb.innerHTML = '';

    // create the leaderboard
    for (let i = 0; i < leaaderboard.length; i++) {
        let p = document.createElement('p');
        p.classList.add('topplayer');
        p.classList.add('player');
        if (leaaderboard[i].name == myName) {
            p.classList.add('me');
        }
        p.innerHTML = leaaderboard[i].name + ' <span class="topscore">' + leaaderboard[i].score + '</span>';
        lb.appendChild(p);
    };
});

socket.on('podium', (podium) => {
    console.log('podium');
    console.log(podium);
    // podium is an array of objects {name: name, score: score}
    /*
    <div class="waiting" id="podium">
        <h1>Podium</h1>
        <div class="top" id="p1"></div>
        <div class="top" id="p2"></div>
        <div class="top" id="p3"></div>
    </div>
    */

    // clear the podium
    p1.innerHTML = '';
    p2.innerHTML = '';
    p3.innerHTML = '';

    // create the podium
    let p1p = document.createElement('p');
    p1p.classList.add('topplayer');
    p1p.innerHTML = podium[0].name + ' <span class="topscore">' + podium[0].score + '</span>';
    p1.appendChild(p1p);

    let p2p = document.createElement('p');
    p2p.classList.add('topplayer');
    p2p.innerHTML = podium[1].name + ' <span class="topscore">' + podium[1].score + '</span>';
    p2.appendChild(p2p);

    let p3p = document.createElement('p');
    p3p.classList.add('topplayer');
    p3p.innerHTML = podium[2].name + ' <span class="topscore">' + podium[2].score + '</span>';
    p3.appendChild(p3p);

});

// disconnect
socket.on('disconnect', () => {
    console.log('disconnected');
    location.reload();
});