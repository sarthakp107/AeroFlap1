// Game board
let board;
let boardWidth = 666;
let boardHeight = 900;
let context;

// Plane (Bird)
let birdWidth = 194;
let birdHeight = 164;
let birdX = boardWidth / 20;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

// Towers (Pipes)
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 412;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// Collision image
let collisionImg;

// Game physics
let velocityX = -18; // Towers moving left
let velocityY = 10;  // Plane jump speed
let gravity = 0.5;

// Game over
let gameOver = false;

// Score
let score = 0;

// Tolerance for collision detection gap (adjust as needed)
let tolerance = 0  ;

window.onload = function () {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    // Load images
    birdImg = new Image();
    birdImg.src = "./plane1.png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./tower1.png"

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./tower1.png"

    // Collision image
    collisionImg = new Image();
    collisionImg.src = "./collision.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 900);
    document.addEventListener("keydown", moveBird);
}

function update() {
    requestAnimationFrame(update);

    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    // Update plane position
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0); // Prevent plane from going above the top of the canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    // Check if plane falls below the canvas
    if (bird.y > board.height) {
        gameOver = true;
    }

    // Update and draw pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        // Check if plane passes through pipe
        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        // Check collision with tolerance
        if (detectCollisionWithTolerance(bird, pipe, tolerance)) {
            gameOver = true;
            context.drawImage(collisionImg, bird.x + 70, bird.y, bird.width, bird.height); // Draw collision image on the plane
        }
    }

    // Update score display
    context.fillStyle = "black";
    context.font = "45px Courier New";
    context.fillText("SCORE: " + score, 40, 60);

    // Display game over message
    if (gameOver) {
        context.fillStyle = "white";
        context.fillText("GAME OVER", 250, 450);
    }
}

function placePipes() {
    if (gameOver) {
        return;
    }

    // Randomize pipe positions
    let randomPipeY = pipeY - (Math.random() * (pipeHeight / 2) + pipeHeight / 20);
    let openingSpace = board.height / 2.5;

    // Top pipe
    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(topPipe);

    // Bottom pipe
    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "KeyX" || e.code == "ArrowUp") {
        // Jump
        velocityY = -6;
    }

    // Reset game on game over
    if (gameOver) {
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameOver = false;
    }
}

function detectCollisionWithTolerance(a, b, tolerance) {
    // Adjust conditions with tolerance
    return a.x < b.x + b.width + tolerance &&
           a.x + a.width > b.x - tolerance &&
           a.y < b.y + b.height + tolerance &&
           a.y + a.height > b.y - tolerance;
}
