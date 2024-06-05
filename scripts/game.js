const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const sprite = new Image();
sprite.src = "./sprites/sprite.png";

sprite.onload = () => {
  startScreen();
};

const sounds = {
  hit: new Audio("./sounds/sfx_hit.wav"),
  point: new Audio("./sounds/sfx_point.wav"),
  swooshing: new Audio("./sounds/sfx_swooshing.wav"),
  die: new Audio("./sounds/sfx_die.wav"),
  wing: new Audio("./sounds/sfx_wing.wav"),
};

canvas.width = 288;
canvas.height = 512;

class Bird {
  constructor() {
    this.x = canvas.width / 2 - 75;
    this.y = canvas.height / 2;
    this.vy = 0;
    this.curve = 0;
    this.spriteX = 0;
    this.spriteY = 0;
    this.weight = 1;
    this.width = 17;
    this.height = 12;
    this.skin = "yellow";
    this.frame = 0;
    this.animationFrame = 0;
    this.rotation = 0;
    this.rotationSpeed = 5;
    this.animation = {
      yellow: [
        { sX: 3, sY: 491 },
        { sX: 31, sY: 491 },
        { sX: 59, sY: 491 },
      ],
      blue: [
        { sX: 88, sY: 491 },
        { sX: 116, sY: 491 },
        { sX: 144, sY: 491 },
      ],
      red: [
        { sX: 168, sY: 491 },
        { sX: 196, sY: 491 },
        { sX: 224, sY: 491 },
      ],
    };
  }

  update() {
    this.curve = Math.sin(angle) * 10;

    if (this.y > canvas.height - this.height || this.y < 0) {
      gameOver();
    }

    if (frame % 10 === 0) {
      this.animationFrame++;
      if (this.animationFrame > 2) this.animationFrame = 0;
    }

    let targetRotation;
    if (this.vy < 2) {
      targetRotation = -15;
    } else if (this.vy < 8) {
      targetRotation = 15;
    } else {
      targetRotation = 90;
    }

    if (this.rotation < targetRotation) {
      this.rotation = Math.min(
        this.rotation + this.rotationSpeed,
        targetRotation
      );
    } else if (this.rotation > targetRotation) {
      this.rotation = Math.max(
        this.rotation - this.rotationSpeed,
        targetRotation
      );
    }

    this.vy += this.weight;
    this.vy *= 0.9;
    this.y += this.vy;

    if (this.y >= canvas.height - this.height) {
      this.y = canvas.height - this.height;
    }

    if (this.y <= 0) {
      this.y = 0;
    }

    this.draw();
  }

  wave() {
    this.curve = Math.sin(angle) * 10;
    if (frame % 10 === 0) {
      this.animationFrame++;
      if (this.animationFrame > 2) this.animationFrame = 0;
    }
    this.draw();
  }

  checkCollision(pipe) {
    if (
      this.x + this.width >= pipe.x &&
      this.x <= pipe.x + pipe.width * 2 &&
      (this.y <= pipe.top + pipe.height * 2 ||
        this.y + this.height * 2 >= pipe.top + pipe.height * 2 + pipe.gapSize)
    ) {
      return true;
    }
    return false;
  }

  checkBottomCollision() {
    return this.y + this.height >= canvas.height - foreground.h;
  }

  draw() {
    let bird = this.animation[this.skin][this.animationFrame];
    ctx.save();
    ctx.translate(this.x, this.y + this.curve);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.drawImage(
      sprite,
      bird.sX,
      bird.sY,
      this.width,
      this.height,
      -this.width / 2,
      -this.height / 2,
      this.width * 2,
      this.height * 2
    );
    ctx.restore();
  }

  flap() {
    this.vy -= 25;
    sounds.wing.play();
  }

  reset() {
    this.x = canvas.width / 2 - 75;
    this.y = canvas.height / 2;
    this.vy = 0;
    this.weight = 1;
    this.curve = 0;
    this.rotation = 0;
  }
}

class Pipe {
  constructor() {
    this.spacing = 200;
    this.gapSize = 150;
    this.top = -Math.random() * 130 - 75;
    this.bottom = canvas.height;
    this.x = canvas.width;
    this.width = 26;
    this.height = 160;
    this.topSpriteX = 56;
    this.bottomSpriteX = 84;
    this.spriteY = 323;
    this.counted = false;
  }

  draw() {
    ctx.drawImage(
      sprite,
      this.topSpriteX,
      this.spriteY,
      this.width,
      this.height,
      this.x,
      this.top,
      this.width * 2,
      this.height * 2
    );
    ctx.drawImage(
      sprite,
      this.bottomSpriteX,
      this.spriteY,
      this.width,
      this.height,
      this.x,
      160 + this.top + this.height + this.gapSize,
      this.width * 2,
      this.height * 2
    );
  }

  update(bird) {
    this.x -= 2;
    if (!this.counted && this.x < bird.x) {
      score++;
      sounds.point.play();
      this.counted = true;
    }
  }
}

const bird = new Bird();

const pipes = [];
let angle = 0;
let frame = 0;
let score = 0;
let bestScore = localStorage.getItem("flappyBestScore") || 0;
let startFrame = 0;
let gameState = "start";
let getReadyScreen = true;

function drawScore() {
  numbers.large.draw(score, canvas.width / 2, 50);
}

function gameOver() {
  let medal = -1;
  if (score >= 10 && score < 20) {
    medal = 0;
  } else if (score >= 20 && score < 30) {
    medal = 1;
  } else if (score >= 30 && score < 40) {
    medal = 2;
  } else if (score >= 40) {
    medal = 3;
  }
  gameOverCard.draw(medal);
  menuButton.draw();
  okButton.draw();
}

function gameLoop() {
  if (gameState !== "play" && gameState !== "pause") return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  background.draw();

  if (getReadyScreen) {
    drawScore();
    angle += 0.1;
    frame++;
    bird.wave();
    foreground.update();
    getReady.draw();
    tutorial.draw();
    requestAnimationFrame(gameLoop);
    return;
  }

  pipes.forEach((pipe) => {
    pipe.draw();
  });

  if (gameState === "pause") {
    drawScore();
    bird.wave();
    foreground.draw();
    pauseButton.draw();
    requestAnimationFrame(gameLoop);
    return;
  }

  frame++;
  angle += 0.1;

  bird.update();
  foreground.update();
  pauseButton.draw();
  drawScore();

  if (frame % 100 === 0) {
    pipes.push(new Pipe());
  }

  pipes.forEach((pipe, index) => {
    if (pipe.x + pipe.width * 2 < 0) {
      pipes.splice(index, 1);
    }
  });

  pipes.forEach((pipe) => {
    pipe.update(bird);
    if (bird.checkCollision(pipe)) {
      cancelAnimationFrame(gameLoop);
      sounds.hit.play();
      gameState = "gameover";
      gameOver();
    }
  });

  if (bird.checkBottomCollision()) {
    cancelAnimationFrame(gameLoop);
    gameState = "gameover";
    sounds.hit.play();
    gameOver();
  } else {
    requestAnimationFrame(gameLoop);
  }
}

function startScreen() {
  if (gameState !== "start") return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  background.draw();
  angle += 0.1;
  frame++;
  score = 0;
  bird.reset();
  pipes.splice(0, pipes.length);
  getReadyScreen = true;

  foreground.update();
  gameLogo.update();
  startButton.draw();
  startFrame++;

  requestAnimationFrame(startScreen);
}

window.addEventListener("keydown", (e) => {
  if (e.code !== "Space") return;
  switch (gameState) {
    case "start":
      gameState = "play";
      cancelAnimationFrame(startScreen);
      gameLoop();
      break;
    case "play":
      if (getReadyScreen) {
        getReadyScreen = false;
      }
      bird.flap();
      break;
    case "gameover":
      gameState = "start";
      cancelAnimationFrame(gameLoop);
      startScreen();
      break;
  }
});

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (
    x >= pauseButton.x &&
    x <= pauseButton.x + pauseButton.w * 2 &&
    y >= pauseButton.y &&
    y <= pauseButton.y + pauseButton.h * 2
  ) {
    if (gameState === "play") {
      gameState = "pause";
      pauseButton.state = "pause";
    } else if (gameState === "pause") {
      gameState = "play";
      pauseButton.state = "play";
    }
    return;
  }

  switch (gameState) {
    case "start":
      gameState = "play";
      cancelAnimationFrame(startScreen);
      gameLoop();
      break;
    case "play":
      if (getReadyScreen) {
        getReadyScreen = false;
      }
      bird.flap();
      break;
    case "gameover":
      gameState = "start";
      cancelAnimationFrame(gameLoop);
      startScreen();
      break;
  }
});
