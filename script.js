/* ============================================
   NEUROHACK
   VANILLA JAVASCRIPT
============================================ */


/* ============================================
   PARTICLES
============================================ */

const particleContainer = document.getElementById("particles");

for (let i = 0; i < 60; i++) {

    const particle = document.createElement("div");

    particle.className = "particle";

    particle.style.left = Math.random() * 100 + "%";

    particle.style.animationDuration =
        5 + Math.random() * 10 + "s";

    particle.style.animationDelay =
        Math.random() * 10 + "s";

    particleContainer.appendChild(particle);
}


/* ============================================
   SCREEN SYSTEM
============================================ */

function showScreen(id) {

    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    document.getElementById(id).classList.add("active");

}


/* ============================================
   CHALLENGES
============================================ */

const challenges = [

    {
        number: "01",
        tag: "REFLEX",
        title: "REACTION",
        description:
            "Test how quickly your nervous system responds to a visual stimulus."
    },

    {
        number: "02",
        tag: "MEMORY",
        title: "MEMORY MATRIX",
        description:
            "Memorize a neural pattern and reproduce it with perfect accuracy."
    },

    {
        number: "03",
        tag: "RECALL",
        title: "NUMBER RECALL",
        description:
            "Your brain has seconds to memorize a sequence before it disappears."
    },

    {
        number: "04",
        tag: "PRECISION",
        title: "PRECISION",
        description:
            "Hit as many targets as possible before the neural clock expires."
    },

    {
        number: "05",
        tag: "FOCUS",
        title: "FOCUS",
        description:
            "Find the anomaly hidden inside a field of identical symbols."
    }

];

let currentChallenge = 0;


/* ============================================
   SCORE STORAGE
============================================ */

let scores = {

    reaction: 0,
    memory: 0,
    number: 0,
    precision: 0,
    focus: 0

};


/* ============================================
   START
============================================ */

function startTest() {

    currentChallenge = 0;

    resetScores();

    updateChallenge();

    showScreen("select");

}


/* ============================================
   UPDATE CHALLENGE
============================================ */

function updateChallenge() {

    const challenge = challenges[currentChallenge];

    document.getElementById("challengeNumber").textContent =
        challenge.number;

    document.getElementById("challengeBigNumber").textContent =
        challenge.number;

    document.getElementById("challengeTag").textContent =
        challenge.tag;

    document.getElementById("challengeTitle").textContent =
        challenge.title;

    document.getElementById("challengeDescription").textContent =
        challenge.description;

}


/* ============================================
   BEGIN CHALLENGE
============================================ */

function beginChallenge() {

    showScreen("game");

    hideAllGames();

    const gameNumber = currentChallenge;

    if (gameNumber === 0) {

        document.getElementById("reactionGame")
            .classList.remove("hidden");

        startReaction();

    }

    if (gameNumber === 1) {

        document.getElementById("memoryGame")
            .classList.remove("hidden");

        startMemory();

    }

    if (gameNumber === 2) {

        document.getElementById("numberGame")
            .classList.remove("hidden");

        startNumberRecall();

    }

    if (gameNumber === 3) {

        document.getElementById("precisionGame")
            .classList.remove("hidden");

        startPrecision();

    }

    if (gameNumber === 4) {

        document.getElementById("focusGame")
            .classList.remove("hidden");

        startFocus();

    }

}


/* ============================================
   HIDE GAMES
============================================ */

function hideAllGames() {

    document.querySelectorAll(".game-area")
        .forEach(game => {

            game.classList.add("hidden");

        });

}


/* ============================================
   NEXT CHALLENGE
============================================ */

function nextChallenge() {

    currentChallenge++;

    if (currentChallenge >= challenges.length) {

        showResults();

        return;

    }

    updateChallenge();

    showScreen("select");

}


/* ============================================
   REACTION TEST
============================================ */

let reactionStartTime = 0;
let reactionTimeout;
let reactionFinished = false;

function startReaction() {

    const box = document.getElementById("reactionBox");

    const text = document.getElementById("reactionText");

    box.classList.remove("ready");
    box.classList.remove("too-soon");

    text.textContent = "WAIT FOR GREEN";

    reactionFinished = false;

    const delay = 1500 + Math.random() * 3500;

    reactionTimeout = setTimeout(() => {

        box.classList.add("ready");

        text.textContent = "CLICK NOW!";

        reactionStartTime = performance.now();

    }, delay);

}


function reactionClick() {

    const box = document.getElementById("reactionBox");

    const text = document.getElementById("reactionText");

    if (reactionFinished) return;

    if (!box.classList.contains("ready")) {

        clearTimeout(reactionTimeout);

        box.classList.add("too-soon");

        text.textContent = "TOO SOON!";

        reactionFinished = true;

        setTimeout(() => {

            startReaction();

        }, 1200);

        return;

    }

    const reactionTime =
        Math.round(performance.now() - reactionStartTime);

    scores.reaction = reactionTime;

    reactionFinished = true;

    text.textContent =
        reactionTime + " MS";

    setTimeout(nextChallenge, 1200);

}


/* ============================================
   MEMORY MATRIX
============================================ */

let memoryPattern = [];

function startMemory() {

    const grid = document.getElementById("memoryGrid");

    grid.innerHTML = "";

    memoryPattern = [];

    for (let i = 0; i < 16; i++) {

        const cell = document.createElement("div");

        cell.className = "memory-cell";

        cell.dataset.index = i;

        cell.onclick = () => memoryClick(cell);

        grid.appendChild(cell);

    }

    for (let i = 0; i < 5; i++) {

        memoryPattern.push(
            Math.floor(Math.random() * 16)
        );

    }

    memoryPattern =
        [...new Set(memoryPattern)];

    setTimeout(() => {

        memoryPattern.forEach(index => {

            grid.children[index]
                .classList.add("active");

        });

        setTimeout(() => {

            document
                .querySelectorAll(".memory-cell")
                .forEach(cell => {

                    cell.classList.remove("active");

                });

        }, 1000);

    }, 500);

}


let memorySelected = [];

function memoryClick(cell) {

    const index = Number(cell.dataset.index);

    if (memorySelected.includes(index)) return;

    memorySelected.push(index);

    cell.classList.add("active");

    if (memorySelected.length === memoryPattern.length) {

        const correct =
            memorySelected.every(index =>
                memoryPattern.includes(index)
            );

        scores.memory = correct ? 100 : 50;

        setTimeout(nextChallenge, 1000);

    }

}


/* ============================================
   NUMBER RECALL
============================================ */

let correctNumber = "";

function startNumberRecall() {

    const display =
        document.getElementById("numberDisplay");

    const input =
        document.getElementById("numberInput");

    input.value = "";

    const length = 5 + Math.floor(Math.random() * 3);

    correctNumber = "";

    for (let i = 0; i < length; i++) {

        correctNumber +=
            Math.floor(Math.random() * 10);

    }

    display.textContent = correctNumber;

    setTimeout(() => {

        display.textContent = "••••••";

        input.focus();

    }, 2500);

}


function checkNumber() {

    const input =
        document.getElementById("numberInput");

    if (input.value === correctNumber) {

        scores.number = 100;

    } else {

        scores.number = 40;

    }

    nextChallenge();

}


/* ============================================
   PRECISION
============================================ */

let precisionScore = 0;
let precisionTimer;

function startPrecision() {

    precisionScore = 0;

    document.getElementById("precisionScore")
        .textContent = "0";

    moveTarget();

    let seconds = 15;

    document.getElementById("timer")
        .textContent = seconds;

    precisionTimer = setInterval(() => {

        seconds--;

        document.getElementById("timer")
            .textContent = seconds;

        if (seconds <= 0) {

            clearInterval(precisionTimer);

            scores.precision =
                Math.min(100, precisionScore * 10);

            nextChallenge();

        }

    }, 1000);

}


function moveTarget() {

    const board =
        document.getElementById("precisionBoard");

    const target =
        document.getElementById("target");

    const maxX =
        board.clientWidth - 45;

    const maxY =
        board.clientHeight - 45;

    target.style.left =
        Math.random() * maxX + "px";

    target.style.top =
        Math.random() * maxY + "px";

}


document.getElementById("target").onclick = function () {

    precisionScore++;

    document.getElementById("precisionScore")
        .textContent = precisionScore;

    moveTarget();

};


/* ============================================
   FOCUS TEST
============================================ */

function startFocus() {

    const grid =
        document.getElementById("focusGrid");

    grid.innerHTML = "";

    const total = 48;

    const different =
        Math.floor(Math.random() * total);

    for (let i = 0; i < total; i++) {

        const cell =
            document.createElement("div");

        cell.className = "focus-cell";

        cell.textContent =
            i === different ? "0" : "O";

        cell.onclick = () => {

            if (i === different) {

                scores.focus = 100;

            } else {

                scores.focus = 30;

            }

            nextChallenge();

        };

        grid.appendChild(cell);

    }

}


/* ============================================
   RESULTS
============================================ */

function showResults() {

    showScreen("results");

    const reactionScore =
        Math.max(0, 100 - Math.floor(scores.reaction / 5));

    const finalScore =
        Math.round(
            (
                reactionScore +
                scores.memory +
                scores.number +
                scores.precision +
                scores.focus
            ) / 5
        );

    document.getElementById("finalScore")
        .textContent = finalScore;


    document.getElementById("reactionResult")
        .textContent =
        scores.reaction + "ms";


    document.getElementById("memoryResult")
        .textContent =
        scores.memory + "%";


    document.getElementById("precisionResult")
        .textContent =
        scores.precision + "%";


    document.getElementById("focusResult")
        .textContent =
        scores.focus + "%";


    let rank;

    if (finalScore >= 90) {

        rank = "NEURAL GOD";

    } else if (finalScore >= 75) {

        rank = "ELITE";

    } else if (finalScore >= 60) {

        rank = "ADVANCED";

    } else if (finalScore >= 40) {

        rank = "OPERATOR";

    } else {

        rank = "ROOKIE";

    }

    document.getElementById("rank")
        .textContent = rank;


    document.getElementById("resultMessage")
        .textContent =
        getResultMessage(finalScore);

}


function getResultMessage(score) {

    if (score >= 90) {

        return "Exceptional cognitive performance. Your neural processing speed is elite.";

    }

    if (score >= 75) {

        return "Excellent performance. Your cognitive system is operating above average.";

    }

    if (score >= 60) {

        return "Solid performance. Your neural system shows strong potential.";

    }

    if (score >= 40) {

        return "Decent performance. Train your reaction, memory and focus to improve.";

    }

    return "The neural system needs training. Run the test again and beat your score.";

}


/* ============================================
   RESTART
============================================ */

function restartTest() {

    resetScores();

    startTest();

}


/* ============================================
   RESET
============================================ */

function resetScores() {

    scores = {

        reaction: 0,
        memory: 0,
        number: 0,
        precision: 0,
        focus: 0

    };

}