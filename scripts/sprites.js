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
