const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const sprite = new Image();
sprite.src = "sprite.png";

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
      this.counted = true;
    }
  }
}

const background = {
  sX: 0,
  sY: 0,
  x: 0,
  y: 0,
  w: 144,
  h: 256,
  day: true,

  draw: function () {
    ctx.drawImage(
      sprite,
      this.sX + (this.day ? 0 : this.w + 2),
      this.sY,
      this.w,
      this.h,
      this.x,
      this.y,
      ctx.canvas.width,
      ctx.canvas.height
    );
  },
};

const foreground = {
  sX: 292,
  sY: 0,
  x: 0,
  y: 0,
  w: 144,
  h: 56,
  dx: 0,

  update: function () {
    this.dx = (this.dx - 2) % (this.w / 2);
    this.draw();
  },

  draw: function () {
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x + this.dx,
      ctx.canvas.height - this.h,
      ctx.canvas.width,
      this.h * 2
    );
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x + this.dx + this.w / 2,
      ctx.canvas.height - this.h,
      ctx.canvas.width,
      this.h * 2
    );
  },
};

const numbers = {
  large: {
    sX: 292,
    sY: 160,
    w: 12,
    h: 18,
    x: 0,
    y: 0,
    draw: function (num, x, y) {
      let numStr = num.toString();
      for (let i = 0; i < numStr.length; i++) {
        let digit = parseInt(numStr[i]);
        let offset = numStr.length * this.w;
        ctx.drawImage(
          sprite,
          this.sX + digit * (this.w + 2),
          this.sY,
          this.w,
          this.h,
          x + this.w * 2 * i - offset,
          y,
          this.w * 2,
          this.h * 2
        );
      }
    },
  },
  medium: {
    sX: 292,
    sY: 184,
    w: 7,
    h: 10,
    x: 0,
    y: 0,
    draw: function (num, x, y) {
      let numStr = num.toString();
      let offset = numStr.length * this.w * 2;
      for (let i = 0; i < numStr.length; i++) {
        let digit = parseInt(numStr[i]);
        ctx.drawImage(
          sprite,
          this.sX + digit * (this.w + 2),
          this.sY,
          this.w,
          this.h,
          x + this.w * 2 * i - offset,
          y,
          this.w * 2,
          this.h * 2
        );
      }
    },
  },
  small: {
    sX: 292,
    sY: 200,
    w: 6,
    h: 7,
    x: 0,
    y: 0,
    draw: function (num, x, y) {
      let numStr = num.toString();
      for (let i = 0; i < numStr.length; i++) {
        let digit = parseInt(numStr[i]);
        ctx.drawImage(
          sprite,
          this.sX + digit * (this.w + 2),
          this.sY,
          this.w,
          this.h,
          x + this.w * 2 * i,
          y,
          this.w * 2,
          this.h * 2
        );
      }
    },
  },
};

const medals = {
  sX: 121,
  sY: 258,
  w: 22,
  h: 22,
  x: 0,
  y: 0,

  draw: function (medal, x, y) {
    ctx.drawImage(
      sprite,
      this.sX + medal * (this.w + 2),
      this.sY,
      this.w,
      this.h,
      x,
      y,
      this.w * 2,
      this.h * 2
    );
  },
};

const newLabel = {
  sX: 121,
  sY: 282,
  w: 16,
  h: 7,
  x: 0,
  y: 0,

  draw: function (x, y) {
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      x,
      y,
      this.w * 2,
      this.h * 2
    );
  },
};

const gameOverCard = {
  sX: 3,
  sY: 259,
  w: 113,
  h: 57,
  x: 0,
  y: 0,

  draw: function (medal) {
    let x = canvas.width / 2 - this.w;
    let y = canvas.height / 2 - this.h;
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      x,
      y,
      this.w * 2,
      this.h * 2
    );
    medal >= 0 && medals.draw(medal, x + 27, y + 42);
    if (score > bestScore) {
      console.log("new best score", score);
      bestScore = score;
      newLabel.draw(x + 135, y + 58);
      localStorage.setItem("flappyBestScore", bestScore);
    }
    numbers.medium.draw(score, x + 204, y + 32);
    numbers.medium.draw(Math.max(score, bestScore), x + 204, y + 74);
  },
};

const bird = new Bird();

const gameLogo = {
  sX: 351,
  sY: 91,
  w: 89,
  h: 24,
  x: 0,
  y: 0,
  bird: bird,
  animationFrame: 0,
  curve: 0,

  update: function () {
    this.curve = Math.sin(angle) * 10;
    if (frame % 10 === 0) {
      this.animationFrame++;
      if (this.animationFrame > 2) this.animationFrame = 0;
    }
    this.draw();
  },

  draw: function () {
    let x = canvas.width / 2 - this.w - bird.width - 5;
    let y = 100;
    ctx.save();
    ctx.translate(x, y + this.curve);
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      0,
      0,
      this.w * 2,
      this.h * 2
    );
    ctx.drawImage(
      sprite,
      this.bird.animation.yellow[this.animationFrame].sX,
      this.bird.animation.yellow[this.animationFrame].sY,
      this.bird.width,
      this.bird.height,
      this.w * 2 + 10,
      this.h - this.bird.height,
      this.bird.width * 2,
      this.bird.height * 2
    );
    ctx.restore();
  },
};

const startButton = {
  sX: 354,
  sY: 118,
  w: 52,
  h: 29,
  x: 0,
  y: 0,

  draw: function () {
    let x = canvas.width / 2 - this.w;
    let y = canvas.height / 2 + 50;
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      x,
      y,
      this.w * 2,
      this.h * 2
    );
  },
};

const getReady = {
  sX: 295,
  sY: 59,
  w: 92,
  h: 25,
  x: 0,
  y: 0,

  draw: function () {
    let x = canvas.width / 2 - this.w;
    let y = 125;
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      x,
      y,
      this.w * 2,
      this.h * 2
    );
  },
};

const tutorial = {
  sX: 292,
  sY: 91,
  w: 57,
  h: 49,
  x: 0,
  y: 0,

  draw: function () {
    let x = canvas.width / 2 - this.w;
    let y = 250;
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      x,
      y,
      this.w * 2,
      this.h * 2
    );
  },
};

const pauseButton = {
  sX: 121,
  sY: 291,
  w: 13,
  h: 14,
  x: 10,
  y: 10,
  state: "play",

  draw: function () {
    ctx.drawImage(
      sprite,
      this.sX + (this.state === "play" ? 0 : this.w + 2),
      this.sY,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w * 2,
      this.h * 2
    );
  },
};

const menuButton = {
  sX: 462,
  sY: 26,
  w: 40,
  h: 14,
  x: gameOverCard.w * 2 - 65,
  y: canvas.height / 2 + gameOverCard.h + 10,

  draw: function () {
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w * 2,
      this.h * 2
    );
  },
};

const okButton = {
  sX: 462,
  sY: 42,
  w: 40,
  h: 14,
  x: canvas.width / 2 - gameOverCard.w + 15,
  y: canvas.height / 2 + gameOverCard.h + 10,

  draw: function () {
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w * 2,
      this.h * 2
    );
  },
};

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
      gameState = "gameover";
      gameOver();
    }
  });

  if (bird.checkBottomCollision()) {
    cancelAnimationFrame(gameLoop);
    gameState = "gameover";
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

startScreen();
