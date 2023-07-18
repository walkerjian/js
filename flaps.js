function setup() {
	createCanvas(windowWidth, windowHeight);
	background(100);
}



let bird;
let pipes = [];
let score = 0;

let birdImages = [];
let bgDay, bgNight, pipeImg, gameOverImg;
let currentBackground;

function preload() {
  birdImages[0] = loadImage('yellowbird-downflap.png');
  birdImages[1] = loadImage('yellowbird-midflap.png');
  birdImages[2] = loadImage('yellowbird-upflap.png');
  bgDay = loadImage('background-day.png');
  bgNight = loadImage('background-night.png');
  pipeImg = loadImage('pipe-green.png');
  gameOverImg = loadImage('gameover.png');
  currentBackground = bgDay;  // start with day background
}

function setup() {
  createCanvas(400, 600);
  bird = new Bird();
  pipes.push(new Pipe());
}

function draw() {
  background(currentBackground);
  
  // Add a new pipe every 100 frames
  if (frameCount % 100 === 0) {
    pipes.push(new Pipe());
  }

  for (let i = pipes.length-1; i >= 0; i--) {
    pipes[i].show();
    pipes[i].update();

    // Check if bird hits the pipe
    if (pipes[i].hits(bird)) {
      console.log('Game Over');
      image(gameOverImg, width / 2 - gameOverImg.width / 2, height / 2 - gameOverImg.height / 2);
      noLoop();
    }

    // Remove pipes that have gone off screen
    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }
  }

  bird.update();
  bird.show();

  // Display the score
  fill(255);
  textSize(32);
  text("Score: " + score, 10, 50);
}

function mouseClicked() {
  bird.up();
}

function Bird() {
  this.y = height / 2;
  this.x = 64;

  this.gravity = 0.7;
  this.lift = -12;
  this.velocity = 0;

  this.show = function() {
    // cycle through bird images to create flapping effect
    image(birdImages[frameCount % birdImages.length], this.x, this.y);
  }

  this.up = function() {
    this.velocity += this.lift;
  }

  this.update = function() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    if (this.y > height) {
      this.y = height;
      this.velocity = 0;
    }

    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  }
}

function Pipe() {
  this.top = random(height / 2);
  this.bottom = random(height / 2);
  this.x = width;
  this.w = 20;
  this.speed = 2;

  this.hits = function(bird) {
    if (bird.y < this.top || bird.y > height - this.bottom) {
      if (bird.x > this.x && bird.x < this.x + this.w) {
        return true;
      }
    }
    return false;
  }

  this.show = function() {
    image(pipeImg, this.x, 0, this.w, this.top); // upper pipe
    image(pipeImg, this.x, height-this.bottom, this.w, this.bottom); // lower pipe
  }

  this.update = function() {
    this.x -= this.speed;
    if (this.x < bird.x && !this.passed) {
      score++;
      this.passed = true;
    }
  }

  this.offscreen = function() {
    return (this.x < -this.w);
  }
}
