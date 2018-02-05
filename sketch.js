var player1;
var player2;
var scl = 20;
var canvasWidth = 600;
var canvasHeight = 600;
var paused = true;

function setup(){
    createCanvas(canvasWidth,canvasHeight);

    player1 = new Player(0, 0, 1, 0, 0, 0, 255);
    player2 = new Player(canvasWidth, canvasHeight, -1, 0, 255, 0, 0);
    
    background(0);

    frameRate(15);
}

function draw() {

    if(!paused) {
        background(0);

        player1.update();
        player2.update();

        player1.checkIfDied(player2);
        player2.checkIfDied(player1);

        player1.show();
        player2.show();
    }else{
        fill(255);
        textSize(32);
        textAlign(CENTER);
        text('Tron Light cycle 2v2', canvasWidth / 2, canvasHeight / 3);
        text('Press SPACE to start', canvasWidth / 2, canvasHeight / 2);
    }
}

function keyPressed() {

    //PLAYER 1 MOVEMENT
    if (keyCode === 87) {
        if(player1.speedY !== 1) player1.direction(0, -1);
    }else if(keyCode === 83){
        if(player1.speedY !== -1) player1.direction(0, 1);
    }else if(keyCode === 65){
        if(player1.speedX !== 1) player1.direction(-1, 0);
    }else if(keyCode === 68){
        if(player1.speedX !== -1) player1.direction(1, 0);
    }

    //PLAYER 2 MOVEMENT
    if (keyCode === UP_ARROW) {
        if(player2.speedY !== 1) player2.direction(0, -1);
    }else if(keyCode === DOWN_ARROW){
        if(player2.speedY !== -1) player2.direction(0, 1);
    }else if(keyCode === LEFT_ARROW){
        if(player2.speedX !== 1) player2.direction(-1, 0);
    }else if(keyCode === RIGHT_ARROW){
        if(player2.speedX !== -1) player2.direction(1, 0);
    }

    //Start the game
    if(keyCode === 32){
        paused = 0;
    }
}

function gameOver(winner, loser) {
    winner.reset();
    loser.reset();

    fill(winner.r, winner.g, winner.b);
    rect(0, 0, canvasWidth, canvasHeight);

    paused = 1;
}

function Player(x, y, speedX, speedY, r, g, b){
    //initial state
    this.initialX = x;
    this.initialY = y;
    this.initialSpeedX = speedX;
    this.initialSpeedY = speedY;

    //color
    this.r = r;
    this.g = g;
    this.b = b;

    //current state
    this.x = x;
    this.y = y;
    this.speedX = speedX;
    this.speedY = speedY;
    this.tail = [];

    this.update = function () {
        this.tail.push([this.x, this.y]);

        this.x += this.speedX * scl;
        this.y += this.speedY * scl;

        this.x = constrain(this.x , 0 , width - scl);
        this.y = constrain(this.y , 0 , height - scl);
    };
    
    this.show = function () {
        fill(this.r, this.g, this.b);
        for(var i = 0; i < this.tail.length; i++){
            rect(this.tail[i][0] + scl/2, this.tail[i][1] + scl/2, scl/4, scl/4);
        }

        rect(this.x, this.y, scl, scl);
    };

    this.direction = function (x, y) {
        this.speedX = x;
        this.speedY = y;
    };

    this.checkIfDied = function (otherPlayer) {
        for(var i = 0; i < this.tail.length; i++){
            if(dist(this.tail[i][0], this.tail[i][1], this.x, this.y) < 1){
                gameOver(otherPlayer, this);
            }
        }

        for(var i = 0; i < otherPlayer.tail.length; i++){
            if(dist(otherPlayer.tail[i][0], otherPlayer.tail[i][1], this.x, this.y) < 1){
                gameOver(otherPlayer, this);
            }
        }
    };

    this.reset = function () {
        this.x = this.initialX;
        this.y = this.initialY;
        this.speedX = this.initialSpeedX;
        this.speedY = this.initialSpeedY;
        this.tail = [];
    }
}