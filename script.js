let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let isRunning = false;

const display = document.getElementById('display');
const startStopBtn = document.getElementById('startStop');
const resetBtn = document.getElementById('reset');
const lapBtn = document.getElementById('lap');
const laps = document.getElementById('laps');

function timeToString(time) {
  const diff = new Date(time);
  const hours = String(diff.getUTCHours()).padStart(2, '0');
  const minutes = String(diff.getUTCMinutes()).padStart(2, '0');
  const seconds = String(diff.getUTCSeconds()).padStart(2, '0');
  const milliseconds = String(diff.getUTCMilliseconds()).padStart(3, '0');
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

function updateDisplay() {
  elapsedTime = Date.now() - startTime;
  display.textContent = timeToString(elapsedTime);
}

function startStop() {
  if (!isRunning) {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(updateDisplay, 10);
    isRunning = true;
    startStopBtn.textContent = 'Pause';
    startStopBtn.classList.add('pause');
  } else {
    clearInterval(timerInterval);
    isRunning = false;
    startStopBtn.textContent = 'Start';
    startStopBtn.classList.remove('pause');
  }
}

function reset() {
  clearInterval(timerInterval);
  display.textContent = '00:00:00.000';
  elapsedTime = 0;
  isRunning = false;
  startStopBtn.textContent = 'Start';
  startStopBtn.classList.remove('pause');
  laps.innerHTML = '';
}

function recordLap() {
  if (!isRunning) return;
  const li = document.createElement('li');
  li.textContent = `Lap ${laps.children.length + 1} - ${timeToString(elapsedTime)}`;
  laps.appendChild(li);
}
const canvas = document.getElementById("analog");
const ctx = canvas.getContext("2d");
const radius = canvas.height / 2;
ctx.translate(radius, radius);

function drawClock() {
  ctx.clearRect(-radius, -radius, canvas.width, canvas.height);
  drawFace();
  drawTime(elapsedTime);
}

function drawFace() {
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.95, 0, 2 * Math.PI);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 4;
  ctx.stroke();
  for (let num = 1; num <= 12; num++) {
    const angle = (num * Math.PI) / 6;
    ctx.rotate(angle);
    ctx.translate(0, -radius * 0.8);
    ctx.rotate(-angle);
    ctx.fillText(num.toString(), -5, 5);
    ctx.rotate(angle);
    ctx.translate(0, radius * 0.8);
    ctx.rotate(-angle);
  }
}

function drawHand(pos, length, width, color) {
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.strokeStyle = color;
  ctx.moveTo(0, 0);
  ctx.rotate(pos);
  ctx.lineTo(0, -length);
  ctx.stroke();
  ctx.rotate(-pos);
}

function drawTime(time) {
  const t = new Date(time);
  let hour = t.getUTCHours();
  let minute = t.getUTCMinutes();
  let second = t.getUTCSeconds();
  let millis = t.getUTCMilliseconds();

  hour = hour % 12;
  hour = (hour * Math.PI) / 6 +
         (minute * Math.PI) / (6 * 60) +
         (second * Math.PI) / (360 * 60);
  minute = (minute * Math.PI) / 30 + (second * Math.PI) / (30 * 60);
  second = ((second + millis / 1000) * Math.PI) / 30;

  drawHand(hour, radius * 0.5, 6, "#333");
  drawHand(minute, radius * 0.7, 4, "#2980b9");
  drawHand(second, radius * 0.9, 2, "#e74c3c");
}

setInterval(() => {
  if (isRunning) drawClock();
}, 50);


startStopBtn.addEventListener('click', startStop);
resetBtn.addEventListener('click', reset);
lapBtn.addEventListener('click', recordLap);
