import './style.css'

// 1. App State & Navigation Logic
const prevBtn = document.getElementById('nav-prev');
const nextBtn = document.getElementById('nav-next');
const indicatorsContainer = document.getElementById('nav-indicators');
const infoPanel = document.getElementById('info-panel');
const gameboyPanel = document.getElementById('gameboy-panel');
const phaseTitle = document.getElementById('phase-title');
const phaseDesc = document.getElementById('phase-desc');

const phaseData = [
  {
    title: "Stage 1: The Joystick Era",
    desc: "In the late 1970s and early 1980s, the simple joystick with a single action button defined home entertainment."
  },
  {
    title: "Stage 2: The D-Pad Revolution",
    desc: "The mid-1980s introduced the directional pad (D-pad), revolutionizing precise 2D movement and enabling complex platformers."
  },
  {
    title: "Stage 3: The Ergonomic Grip",
    desc: "As 16-bit consoles emerged in the 90s, controllers gained an ergonomic grip and shoulder buttons for expanded inputs."
  },
  {
    title: "Stage 4: Analog & Rumble",
    desc: "The late 90s saw the transition to 3D gaming, requiring analog sticks for smooth movement and rumble for tactile feedback."
  },
  {
    title: "Stage 5: Modern Wireless",
    desc: "Today's controllers feature precise wireless technology, advanced haptic feedback, and adaptive triggers."
  },
  {
    title: "Stage 6: Retro Play",
    desc: "Play the classics!" // Not really used because info panel is hidden
  }
];

const numPhases = 6;
let currentPhaseIndex = 0;

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  // Create indicators
  for (let i = 0; i < numPhases; i++) {
    const dot = document.createElement('div');
    dot.classList.add('indicator');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToPhase(i));
    indicatorsContainer.appendChild(dot);
  }
  
  // Initialize nav state
  updateNav();
});

function updateNav() {
  const indicators = document.querySelectorAll('.indicator');
  
  // Update buttons
  prevBtn.disabled = currentPhaseIndex === 0;
  nextBtn.disabled = currentPhaseIndex === numPhases - 1;

  // Update indicators
  indicators.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentPhaseIndex);
  });
  
  // Update UI & AR models
  if (currentPhaseIndex < 5) {
    // Show Info Panel, hide GameBoy
    infoPanel.style.display = 'flex';
    gameboyPanel.style.display = 'none';
    
    // Update text
    phaseTitle.textContent = phaseData[currentPhaseIndex].title;
    phaseDesc.textContent = phaseData[currentPhaseIndex].desc;
    
    // Update AR Models
    for (let i = 0; i < 5; i++) {
      const model = document.getElementById(`ar-model-${i}`);
      if (model) {
        model.setAttribute('visible', i === currentPhaseIndex);
      }
    }
  } else {
    // Show GameBoy, hide Info Panel
    infoPanel.style.display = 'none';
    gameboyPanel.style.display = 'flex';
    
    // Hide all AR Models
    for (let i = 0; i < 5; i++) {
      const model = document.getElementById(`ar-model-${i}`);
      if (model) {
        model.setAttribute('visible', false);
      }
    }
  }
}

function goToPhase(index) {
  currentPhaseIndex = index;
  updateNav();
}

prevBtn.addEventListener('click', () => {
  if (currentPhaseIndex > 0) goToPhase(currentPhaseIndex - 1);
});

nextBtn.addEventListener('click', () => {
  if (currentPhaseIndex < numPhases - 1) goToPhase(currentPhaseIndex + 1);
});

// 2. GameBoy Canvas Game Logic (Dot collection game)
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const GB_GREEN = '#8bac0f';
const GB_DARK_GREEN = '#0f380f';

// Game state
const gridSize = 8;
const cols = canvas.width / gridSize;
const rows = canvas.height / gridSize;

let player = { x: Math.floor(cols/2), y: Math.floor(rows/2) };
let dots = [];
let score = 0;
let gameOver = false;

// Create initial dots
for (let i = 0; i < 5; i++) {
  spawnDot();
}

function spawnDot() {
  dots.push({
    x: Math.floor(Math.random() * cols),
    y: Math.floor(Math.random() * rows)
  });
}

function drawRect(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
}

function updateGame() {
  // Clear screen
  ctx.fillStyle = GB_GREEN;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (gameOver) {
    ctx.fillStyle = GB_DARK_GREEN;
    ctx.font = "12px 'Press Start 2P', monospace";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2);
    ctx.fillText("SCORE: " + score, canvas.width/2, canvas.height/2 + 20);
    return;
  }

  // Check collision with dots
  for (let i = dots.length - 1; i >= 0; i--) {
    if (player.x === dots[i].x && player.y === dots[i].y) {
      dots.splice(i, 1);
      score += 10;
      spawnDot();
    }
  }

  // Draw dots
  dots.forEach(dot => {
    drawRect(dot.x, dot.y, GB_DARK_GREEN);
  });

  // Draw player
  drawRect(player.x, player.y, GB_DARK_GREEN);

  // Draw Score
  ctx.fillStyle = GB_DARK_GREEN;
  ctx.font = "10px monospace";
  ctx.textAlign = "left";
  ctx.fillText("SCORE: " + score, 4, 12);
}

// Controls
function movePlayer(dx, dy) {
  if (gameOver) return;
  player.x += dx;
  player.y += dy;
  
  // Wrap around bounds
  if (player.x < 0) player.x = cols - 1;
  if (player.x >= cols) player.x = 0;
  if (player.y < 0) player.y = rows - 1;
  if (player.y >= rows) player.y = 0;
  
  updateGame();
}

// Mouse/Touch controls for on-screen buttons
const btnUp = document.getElementById('btn-up');
const btnDown = document.getElementById('btn-down');
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');
const btnA = document.getElementById('btn-a');
const btnStart = document.getElementById('btn-start');

btnUp.addEventListener('mousedown', () => movePlayer(0, -1));
btnDown.addEventListener('mousedown', () => movePlayer(0, 1));
btnLeft.addEventListener('mousedown', () => movePlayer(-1, 0));
btnRight.addEventListener('mousedown', () => movePlayer(1, 0));

btnUp.addEventListener('touchstart', (e) => { e.preventDefault(); movePlayer(0, -1); });
btnDown.addEventListener('touchstart', (e) => { e.preventDefault(); movePlayer(0, 1); });
btnLeft.addEventListener('touchstart', (e) => { e.preventDefault(); movePlayer(-1, 0); });
btnRight.addEventListener('touchstart', (e) => { e.preventDefault(); movePlayer(1, 0); });

btnA.addEventListener('mousedown', () => {
    if(gameOver) resetGame();
});
btnStart.addEventListener('mousedown', () => {
    if(gameOver) resetGame();
});

// Keyboard controls
window.addEventListener('keydown', (e) => {
  // Only process game input if we are on the game panel (Phase 6)
  if (currentPhaseIndex !== 5) return;
  
  switch(e.key) {
    case 'ArrowUp': 
      e.preventDefault(); 
      movePlayer(0, -1); 
      break;
    case 'ArrowDown': 
      e.preventDefault(); 
      movePlayer(0, 1); 
      break;
    case 'ArrowLeft': 
      e.preventDefault(); 
      movePlayer(-1, 0); 
      break;
    case 'ArrowRight': 
      e.preventDefault(); 
      movePlayer(1, 0); 
      break;
    case 'z': 
    case 'x': 
    case 'Enter':
      if (gameOver) resetGame();
      break;
  }
});

function resetGame() {
  player = { x: Math.floor(cols/2), y: Math.floor(rows/2) };
  dots = [];
  score = 0;
  gameOver = false;
  for (let i = 0; i < 5; i++) spawnDot();
  updateGame();
}

// Initial draw
updateGame();
