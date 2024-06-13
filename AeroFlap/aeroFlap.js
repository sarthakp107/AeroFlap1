
//board

let board;
let boardWidth = 666;
let boardHeight = 900;
let context;


//plane

let birdWidth = 194;
let birdHeight = 164; 
let birdX = boardWidth/20;
let birdY = boardHeight/2;
let birdImg;

let bird= {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}


//towers

let pipeArray =[];
let pipeWidth = 64;
let pipeHeight = 412;
let pipeX = boardWidth;
let pipeY  = 0;

let topPipeImg;
let bottomPipeImg;


//collision image
let collisionImg;


//game physics
//negative acc. for towers, plane stays exactly at the same pixel but the towers moves toward the left which simulates the moving plane


let velocityX = -13; //towers moving left
let velocityY = 10; //plane jump speed

let gravity = 0.5;



//game over

let gameOver = false;

//score
let score = 0;


window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;

    context = board.getContext("2d"); //it is used for drawing on the board

   
   

    //load image

    birdImg = new Image();
    birdImg.src = "./plane1.png";
    birdImg.onload = function() {
        context.drawImage(birdImg , bird.x, bird.y, bird.width,bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./tower1.png"

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./tower1.png"

    //collision image
    collisionImg = new Image();
    collisionImg.src = "./collision.png"
     requestAnimationFrame(update);

     setInterval(placePipes , 900);
     document.addEventListener("keydown",moveBird);
}

function update()
{
    requestAnimationFrame(update);

    if(gameOver)
        {
            return;
        }
    context.clearRect(0,0,board.width,board.height);

    //plane
    velocityY += gravity;
    //bird.y += velocityY;

    bird.y = Math.max(bird.y + velocityY,0); //wont let go up than canvas
     
    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);



    //if the plane falls down gameover
        if(bird.y> board.height)
            {
                gameOver = true; 
            }
    //towers
    for (let i = 0;i<pipeArray.length;i++)
        {
            let pipe = pipeArray[i];
            pipe.x +=velocityX;
            context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);
            
            if(!pipe.passed && bird.x > pipe.x + pipe.width)
                {
                    score+=0.5;
                    pipe.passed = true;
                }
            //detect collision

            if(detectCollision(bird,pipe)){
                gameOver = true;
                context.drawImage(collisionImg, bird.x+70, bird.y, bird.width, bird.height); // Draw collision image on the plane
           // context.drawImage(collisionImg, pipe.x, pipe.y, pipe.width, pipe.height);
            }
        } 

        //score update

        context.fillStyle = "Black";
        context.font = "45px Courier New";
        context.fillText(score, 150, 60);
        context.fillText("SCORE:", 40,60,100);

        //gameover message

        if(gameOver)
            {
                context.fillStyle = "White"
                context.font = "45px Courier New";
                context.fillText("Too Close " , 250,450,500);
            }

        
}

function placePipes()
{
    if(gameOver)
        {
            return;
        }
    //let randomPipeY = pipeY - pipeHeight/40 - Math.random()*(pipeHeight/200);
    let randomPipeY = pipeY - (Math.random() * (pipeHeight / 2) + pipeHeight / 20);
    let openingSpace = board.height/2.5;

let topPipe = {
    img: topPipeImg,
    x:pipeX,
    y:randomPipeY,
    width : pipeWidth,
    height : pipeHeight,
    passed : false
}

pipeArray.push(topPipe);


let bottomPipe = {
    img : bottomPipeImg,
    x : pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width : pipeWidth,
    height : pipeHeight,
    passed : false
}
pipeArray.push(bottomPipe);
}

function moveBird(e)
{
    if(e.code == "Space" || e.code == "KeyX" || e.code == "ArrowUp")
        {
            //jump
            velocityY = -6;
        }
    
        //reset game
        if(gameOver)
            {
                bird.y = birdY;
                pipeArray = [];
                score =0;
                gameOver = false;
            }
}

function detectCollision(a,b) {
    return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}

