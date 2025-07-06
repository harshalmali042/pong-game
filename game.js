const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 15;
const PLAYER_X = 20;
const AI_X = canvas.width - PADDLE_WIDTH - 20;
const PADDLE_SPEED = 8;
const AI_SPEED = 5;
const BALL_SPEED = 6;

// Game state
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballVelX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballVelY = BALL_SPEED * (Math.random() * 2 - 1);
let playerScore = 0;
let aiScore = 0;

// Draw everything
function draw() {
  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Middle dashed line
  ctx.setLineDash([10, 16]);
  ctx.strokeStyle = "#00ffea";
  ctx.beginPath();
  ctx.moveTo(canvas.width/2, 0);
  ctx.lineTo(canvas.width/2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Paddles
  ctx.fillStyle = "#00ffea";
  ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

  // Ball
  ctx.fillStyle = "#fff";
  ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);

  // Scores
  ctx.font = "48px Arial";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText(playerScore, canvas.width/2 - 60, 60);
  ctx.fillText(aiScore, canvas.width/2 + 60, 60);
}

// Collision detection
function collision(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

// Update game state
function update() {
  // Move ball
  ballX += ballVelX;
  ballY += ballVelY;

  // Wall collision (top/bottom)
  if (ballY <= 0) {
    ballY = 0;
    ballVelY *= -1;
  }
  if (ballY + BALL_SIZE >= canvas.height) {
    ballY = canvas.height - BALL_SIZE;
    ballVelY *= -1;
  }

  // Player paddle collision
  if (collision(ballX, ballY, BALL_SIZE, BALL_SIZE, PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT)) {
    ballX = PLAYER_X + PADDLE_WIDTH;
    ballVelX *= -1;
    // Add some effect based on where it hit the paddle
    let deltaY = ballY + BALL_SIZE/2 - (playerY + PADDLE_HEIGHT/2);
    ballVelY = deltaY * 0.25;
  }

  // AI paddle collision
  if (collision(ballX, ballY, BALL_SIZE, BALL_SIZE, AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT)) {
    ballX = AI_X - BALL_SIZE;
    ballVelX *= -1;
    let deltaY = ballY + BALL_SIZE/2 - (aiY + PADDLE_HEIGHT/2);
    ballVelY = deltaY * 0.25;
  }

  // Score
  if (ballX < 0) {
    aiScore++;
    resetBall(-1);
  } else if (ballX + BALL_SIZE > canvas.width) {
    playerScore++;
    resetBall(1);
  }

  // AI movement (simple: follow the ball)
  let aiCenter = aiY + PADDLE_HEIGHT/2;
  if (ballY + BALL_SIZE/2 > aiCenter + 10) {
    aiY += AI_SPEED;
  } else if (ballY + BALL_SIZE/2 < aiCenter - 10) {
    aiY -= AI_SPEED;
  }
  // Clamp AI paddle
  aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

// Reset ball
function resetBall(direction) {
  ballX = canvas.width / 2 - BALL_SIZE / 2;
  ballY = canvas.height / 2 - BALL_SIZE / 2;
  ballVelX = BALL_SPEED * direction;
  ballVelY = BALL_SPEED * (Math.random() * 2 - 1);
}

// Mouse controls for player paddle
canvas.addEventListener('mousemove', function(e) {
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  // Clamp
  playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Main loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();