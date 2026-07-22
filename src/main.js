import './style.css'

// 1. App State & Navigation Logic
const prevBtn = document.getElementById('nav-prev');
const nextBtn = document.getElementById('nav-next');
const indicatorsContainer = document.getElementById('nav-indicators');
const infoPanel = document.getElementById('info-panel');
const gameboyPanel = document.getElementById('gameboy-panel');
const phaseTitle = document.getElementById('phase-title');
const phaseReleased = document.getElementById('phase-released');
const phaseHistory = document.getElementById('phase-history');
const phaseFeatures = document.getElementById('phase-features');

const phaseData = [
  {
    title: "1. Atari 2600 Controller",
    released: "1977",
    history: "The Atari 2600 controller was one of the first home gaming controllers, introducing millions of people to video games with its simple joystick design.",
    features: [
      "Single joystick",
      "One action button",
      "Eight-direction movement",
      "Durable and simple design"
    ]
  },
  {
    title: "2. NES Controller",
    released: "1983",
    history: "Nintendo replaced the joystick with the D-pad, making movement more precise and setting a new standard for gaming controllers.",
    features: [
      "First widely used D-pad",
      "A & B buttons",
      "Start and Select buttons",
      "Compact rectangular design"
    ]
  },
  {
    title: "3. SNES Controller",
    released: "1990",
    history: "The SNES controller expanded the NES design with more buttons, allowing developers to create richer and more advanced games.",
    features: [
      "Four face buttons (A, B, X, Y)",
      "L & R shoulder buttons",
      "Ergonomic shape",
      "Better control for complex gameplay"
    ]
  },
  {
    title: "4. PlayStation Controller",
    released: "1994",
    history: "Sony entered the gaming industry with a controller that introduced its iconic button symbols and a comfortable dual-grip design.",
    features: [
      "Triangle, Circle, Cross & Square buttons",
      "Comfortable hand grips",
      "Four shoulder buttons",
      "Symmetrical layout"
    ]
  },
  {
    title: "5. Nintendo 64 Controller",
    released: "1996",
    history: "Built for the 3D gaming era, the Nintendo 64 controller introduced the analog stick for smoother and more accurate movement.",
    features: [
      "First central analog stick",
      "Three-pronged design",
      "Z-trigger",
      "Expansion slot"
    ]
  },
  {
    title: "6. PlayStation DualShock",
    released: "1997",
    history: "Sony revolutionized gaming by adding dual analog sticks and vibration, creating the foundation of modern PlayStation controllers.",
    features: [
      "Dual analog sticks",
      "Vibration feedback",
      "Analog mode button",
      "Improved comfort"
    ]
  },
  {
    title: "7. Xbox Controller",
    released: "2001",
    history: "Microsoft's first controller focused on comfort and introduced analog triggers, marking Xbox's entry into the console market.",
    features: [
      "Ergonomic design",
      "Offset analog sticks",
      "Analog triggers",
      "Six action buttons"
    ]
  },
  {
    title: "8. Xbox 360 Controller",
    released: "2005",
    history: "The Xbox 360 controller refined the original design with wireless connectivity and became one of the most popular controllers ever made.",
    features: [
      "Wireless connectivity",
      "Comfortable grip",
      "Precision analog sticks",
      "Improved triggers"
    ]
  },
  {
    title: "9. PlayStation 3 DualShock 3",
    released: "2006",
    history: "The DualShock 3 introduced wireless gameplay, motion sensing, and vibration while keeping the familiar PlayStation layout.",
    features: [
      "Wireless Bluetooth",
      "Motion sensing",
      "Vibration feedback",
      "Rechargeable battery"
    ]
  },
  {
    title: "10. Xbox One Controller",
    released: "2013",
    history: "Microsoft redesigned the Xbox controller with better comfort, improved precision, and immersive trigger vibrations.",
    features: [
      "Impulse trigger vibration",
      "Improved D-pad",
      "Better grip",
      "More accurate analog sticks"
    ]
  },
  {
    title: "11. PlayStation 4 DualShock 4",
    released: "2013",
    history: "The DualShock 4 transformed the controller into an interactive device by adding touch controls, social sharing, and immersive features.",
    features: [
      "Multi-touch touchpad",
      "Share button",
      "Light bar",
      "Built-in speaker",
      "3.5 mm headphone jack",
      "Improved analog sticks and triggers",
      "Motion sensors"
    ]
  },
  {
    title: "12. Retro Play",
    released: "",
    history: "",
    features: []
  }
];

const numPhases = 12;
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
  if (currentPhaseIndex < 11) {
    // Show Info Panel, hide GameBoy
    infoPanel.style.display = 'flex';
    gameboyPanel.style.display = 'none';
    
    // Update text
    const currentData = phaseData[currentPhaseIndex];
    phaseTitle.textContent = currentData.title;
    phaseReleased.textContent = `Released: ${currentData.released}`;
    phaseHistory.textContent = currentData.history;
    
    // Update features list
    phaseFeatures.innerHTML = '';
    currentData.features.forEach(feature => {
      const li = document.createElement('li');
      li.textContent = feature;
      phaseFeatures.appendChild(li);
    });
    
    // Update AR Models (only 11 models total for index 0 to 10)
    for (let i = 0; i < 11; i++) {
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
    for (let i = 0; i < 11; i++) {
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
  
  // Start or stop Tetris game loop
  if (index === 11) {
     if (gameOver) resetGame();
     lastTime = performance.now();
     if (!animationId) animationId = requestAnimationFrame(update);
  } else {
     if (animationId) {
       cancelAnimationFrame(animationId);
       animationId = null;
     }
  }
}

prevBtn.addEventListener('click', () => {
  if (currentPhaseIndex > 0) goToPhase(currentPhaseIndex - 1);
});

nextBtn.addEventListener('click', () => {
  if (currentPhaseIndex < numPhases - 1) goToPhase(currentPhaseIndex + 1);
});

// 2. GameBoy Canvas Game Logic (Tetris)
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const GB_GREEN = '#8bac0f';
const GB_DARK_GREEN = '#0f380f';

// Tetris Game State
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 7;
const BOARD_X = Math.floor((canvas.width - (COLS * BLOCK_SIZE)) / 2);
const BOARD_Y = Math.floor((canvas.height - (ROWS * BLOCK_SIZE)) / 2);

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let score = 0;
let gameOver = false;
let dropCounter = 0;
let dropInterval = 500;
let lastTime = 0;
let animationId = null;

const SHAPES = [
  [[1, 1, 1, 1]], // I
  [[1, 1, 1], [0, 1, 0]], // T
  [[1, 1, 1], [1, 0, 0]], // L
  [[1, 1, 1], [0, 0, 1]], // J
  [[1, 1], [1, 1]], // O
  [[1, 1, 0], [0, 1, 1]], // Z
  [[0, 1, 1], [1, 1, 0]]  // S
];

let player = {
  pos: { x: 0, y: 0 },
  matrix: null
};

function createPiece() {
  const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  player.matrix = shape;
  player.pos.y = 0;
  player.pos.x = Math.floor(COLS / 2) - Math.floor(shape[0].length / 2);
  
  if (collide(board, player)) {
    gameOver = true;
  }
}

function drawBlock(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(BOARD_X + x * BLOCK_SIZE, BOARD_Y + y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
}

function draw() {
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

  // Draw board border
  ctx.strokeStyle = GB_DARK_GREEN;
  ctx.strokeRect(BOARD_X - 1, BOARD_Y - 1, COLS * BLOCK_SIZE + 2, ROWS * BLOCK_SIZE + 2);

  // Draw board blocks
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (board[y][x]) {
        drawBlock(x, y, GB_DARK_GREEN);
      }
    }
  }

  // Draw player piece
  if (player.matrix) {
    for (let y = 0; y < player.matrix.length; y++) {
      for (let x = 0; x < player.matrix[y].length; x++) {
        if (player.matrix[y][x]) {
          drawBlock(player.pos.x + x, player.pos.y + y, GB_DARK_GREEN);
        }
      }
    }
  }

  // Draw Score
  ctx.fillStyle = GB_DARK_GREEN;
  ctx.font = "10px monospace";
  ctx.textAlign = "left";
  ctx.fillText("SCORE: " + score, 4, 12);
}

function collide(board, player) {
  const m = player.matrix;
  const o = player.pos;
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (m[y][x] !== 0 &&
         (board[y + o.y] && board[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

function merge(board, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        board[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

function sweep() {
  let linesCleared = 0;
  outer: for (let y = ROWS - 1; y >= 0; --y) {
    for (let x = 0; x < COLS; ++x) {
      if (board[y][x] === 0) continue outer;
    }
    const row = board.splice(y, 1)[0].fill(0);
    board.unshift(row);
    ++y;
    linesCleared++;
  }
  if (linesCleared > 0) {
    score += linesCleared * 100;
    dropInterval = Math.max(100, 500 - Math.floor(score / 500) * 50);
  }
}

function playerDrop() {
  player.pos.y++;
  if (collide(board, player)) {
    player.pos.y--;
    merge(board, player);
    sweep();
    createPiece();
  }
  dropCounter = 0;
}

function playerMove(offset) {
  player.pos.x += offset;
  if (collide(board, player)) {
    player.pos.x -= offset;
  }
}

function rotate(matrix, dir) {
  const transposed = matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  if (dir > 0) return transposed.map(row => row.reverse());
  return transposed.reverse();
}

function playerRotate(dir) {
  const pos = player.pos.x;
  let offset = 1;
  const original = player.matrix;
  player.matrix = rotate(player.matrix, dir);
  while (collide(board, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length) {
      player.matrix = original;
      player.pos.x = pos;
      return;
    }
  }
}

function update(time = 0) {
  if (currentPhaseIndex !== 11) {
     animationId = null;
     return;
  }
  
  const deltaTime = time - lastTime;
  lastTime = time;

  if (!gameOver) {
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
      playerDrop();
    }
  }

  draw();
  animationId = requestAnimationFrame(update);
}

// Mouse/Touch controls
const btnUp = document.getElementById('btn-up');
const btnDown = document.getElementById('btn-down');
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');
const btnA = document.getElementById('btn-a');
const btnStart = document.getElementById('btn-start');

function addControl(btn, action) {
  if (!btn) return;
  // Use pointerdown to handle both mouse and touch consistently
  btn.addEventListener('pointerdown', (e) => { 
    e.preventDefault(); 
    if(!gameOver) action(); 
    draw(); 
  });
}

addControl(btnUp, () => playerRotate(1));
addControl(btnDown, () => playerDrop());
addControl(btnLeft, () => playerMove(-1));
addControl(btnRight, () => playerMove(1));

btnA.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    if(gameOver) resetGame();
});
btnStart.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    if(gameOver) resetGame();
});

// Keyboard controls
window.addEventListener('keydown', (e) => {
  if (currentPhaseIndex !== 11) return;
  
  switch(e.key) {
    case 'ArrowUp': 
      e.preventDefault(); 
      if(!gameOver) playerRotate(1); 
      draw();
      break;
    case 'ArrowDown': 
      e.preventDefault(); 
      if(!gameOver) playerDrop(); 
      draw();
      break;
    case 'ArrowLeft': 
      e.preventDefault(); 
      if(!gameOver) playerMove(-1); 
      draw();
      break;
    case 'ArrowRight': 
      e.preventDefault(); 
      if(!gameOver) playerMove(1); 
      draw();
      break;
    case 'z': 
    case 'x': 
    case 'Enter':
      if (gameOver) resetGame();
      break;
  }
});

function resetGame() {
  board.forEach(row => row.fill(0));
  score = 0;
  gameOver = false;
  dropInterval = 500;
  createPiece();
  lastTime = performance.now();
  if (animationId) cancelAnimationFrame(animationId);
  animationId = requestAnimationFrame(update);
}

// Initial initialization
createPiece();
draw();

