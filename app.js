const canvas = document.querySelector("#canvas");
const playBtn = document.querySelector("#play");
const resetBtn = document.querySelector("#reset");
const m1Input = document.querySelector("#m1");
const m2Input = document.querySelector("#m2");

const ctx = canvas.getContext("2d");

function init() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 200;
  resetBtn.style.display = "none";
  playBtn.style.display = "block";
  m1Input.value = b1Mass;
  m2Input.value = b2Mass;
  renderFrame();
}

document.addEventListener("DOMContentLoaded", init);
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 200;
}

window.addEventListener("resize", resize);

class Block {
  constructor(mass, pos, vel, color) {
    this.mass = mass;
    this.pos = pos;
    this.vel = vel;
    this.color = color;
    this.size = mass.toString().length * 10;
  }
  render() {
    ctx.fillStyle = "black";
    ctx.font = "20px Georgia";
    ctx.fillText(
      numberWithCommas(this.mass),
      this.pos,
      canvas.height - (this.size + 10)
    );
    ctx.fillStyle = this.color;
    ctx.fillRect(this.pos, canvas.height - this.size, this.size, this.size);
  }

  update(dt) {
    this.pos += this.vel * dt;
  }
}

const b1Pos = 100;
let b1Mass = 0;
let b2Mass = 0;
const b2Pos = 250;
const b2vel = -50;

const block1 = new Block(b1Mass, b1Pos, 0, "blue");
const block2 = new Block(b2Mass, b2Pos, b2vel, "red");

let count = 0;
let lastTime;
let quit = true;
let accumulator = 0;
const dt = 0.0001;
function loop(ts) {
  if (lastTime) {
    let frameTime = ts - lastTime;
    if (frameTime > 250) {
      frameTime = 250;
    }
    accumulator += frameTime;
    while (accumulator >= dt) {
      update(dt);
      accumulator -= dt;
    }
    playClack();
    renderFrame();
  }
  if (!quit) {
    requestAnimationFrame(loop);
    lastTime = ts;
  }
}

function update(dt) {
  block1.update(dt / 1000);
  block2.update(dt / 1000);
  checkWall(block1);
  checkBlockCollision(block1, block2);
}

function renderFrame() {
  ctx.fillStyle = "black";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "20px Georgia";
  ctx.fillText(`Collisions: ${numberWithCommas(count)}`, 10, 20);
  block1.render();
  block2.render();
}

function checkWall(blk) {
  if (blk.pos <= 0) {
    blk.pos = 0;
    blk.vel *= -1;
    count++;
    clacking = true;
  }
}

function checkBlockCollision(blk1, blk2) {
  if (blk1.pos + blk1.size >= blk2.pos) {
    blk1.pos = blk2.pos - blk1.size;

    const m1 = blk1.mass;
    const m2 = blk2.mass;
    const v1i = blk1.vel;
    const v2i = blk2.vel;

    const mom1 = m1 * v1i + m2 * v2i;

    const v2f = (m1 * v2i - m1 * v1i - mom1) / (-1 * m2 - m1);
    const v1f = v2i + v2f - v1i;

    blk1.vel = v1f;
    blk2.vel = v2f;
    count++;
    clacking = true;
  }
}

function play() {
  quit = false;
  playBtn.style.display = "none";
  resetBtn.style.display = "block";
  requestAnimationFrame(loop);
}

playBtn.addEventListener("click", play);

function reset() {
  quit = true;
  playBtn.style.display = "block";
  resetBtn.style.display = "none";
  block1.pos = b1Pos;
  block1.vel = 0;
  block2.pos = b2Pos;
  block2.vel = b2vel;
  count = 0;
  lastTime = null;
  renderFrame();
}

resetBtn.addEventListener("click", reset);

function updateMass(mass, blk) {
  blk.mass = mass;
  if (mass < 1) {
    blk.size = 5;
  } else {
    blk.size = mass.toString().length * 10;
  }
  renderFrame();
}

m1Input.addEventListener("input", e => updateMass(e.target.value, block1));
m2Input.addEventListener("input", e => updateMass(e.target.value, block2));

function numberWithCommas(x) {
  if (parseFloat(x) >= 1) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return x;
  }
}

const clack = new Audio("clack.wav");
let clacking = false;

const playClack = () => {
  if (clacking === true) {
    clack.currentTime = 0;
    clack.play();
    clacking = false;
  }
};
