import './style.css'

// Diagnostics for camera access in secure contexts
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
  console.error("CRITICAL: Camera API (getUserMedia) is NOT available. This usually happens on HTTP or restricted environments (like some in-app browsers). Ensure you are using HTTPS.");
  setTimeout(() => alert("Camera access is disabled by your browser. Please ensure you are on a secure (HTTPS) connection!"), 1000);
} else {
  console.log("SUCCESS: Camera API is available in this context.");
}

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
    title: "7. Xbox One Controller",
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
    title: "8. PlayStation 4 DualShock 4",
    released: "2013",
    history: "The DualShock 4 transformed the controller into an interactive device by adding touch controls, social sharing, and immersive features.",
    features: [
      "Multi-touch touchpad",
      "Share button",
      "Light bar",
      "Built-in speaker"
    ]
  },
  {
    title: "9. Retro Play",
    released: "",
    history: "",
    features: []
  }
];

const numPhases = 9;
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
  
  // Modals Event Listeners
  const instructionModal = document.getElementById('instruction-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const giftModal = document.getElementById('gift-modal');
  const giftBtn = document.getElementById('gift-btn');
  const closeGiftBtn = document.getElementById('close-gift-btn');

  if (closeModalBtn && instructionModal) {
    closeModalBtn.addEventListener('click', () => {
      instructionModal.style.opacity = '0';
      setTimeout(() => {
        instructionModal.style.display = 'none';
      }, 300);
    });
  }

  if (giftBtn && giftModal) {
    giftBtn.addEventListener('click', () => {
      giftModal.style.display = 'flex';
      giftModal.style.opacity = '1';
    });
  }

  if (closeGiftBtn && giftModal) {
    closeGiftBtn.addEventListener('click', () => {
      giftModal.style.opacity = '0';
      setTimeout(() => {
        giftModal.style.display = 'none';
      }, 300);
    });
  }

  // Initialize nav state
  updateNav();
});

function updateNav() {
  const indicators = document.querySelectorAll('.indicator');
  const gameboyTitle = document.getElementById('gameboy-title');
  const giftBtn = document.getElementById('gift-btn');
  
  // Update buttons
  prevBtn.disabled = currentPhaseIndex === 0;
  nextBtn.disabled = currentPhaseIndex === numPhases - 1;

  // Update indicators
  indicators.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentPhaseIndex);
  });
  
  // Update UI & AR models
  if (currentPhaseIndex < 8) {
    // Show Info Panel, hide GameBoy elements
    infoPanel.style.display = 'flex';
    document.getElementById('features-panel').style.display = 'flex';
    gameboyPanel.style.display = 'none';
    if (gameboyTitle) gameboyTitle.style.display = 'none';
    if (giftBtn) giftBtn.style.display = 'none';
    
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
    
    // Update AR Models (only 8 models total for index 0 to 7)
    for (let i = 0; i < 8; i++) {
      const model = document.getElementById(`ar-model-${i}`);
      if (model) {
        model.setAttribute('visible', i === currentPhaseIndex);
      }
    }
  } else {
    // Show GameBoy elements, hide Info Panel
    infoPanel.style.display = 'none';
    document.getElementById('features-panel').style.display = 'none';
    gameboyPanel.style.display = 'flex';
    if (gameboyTitle) gameboyTitle.style.display = 'block';
    if (giftBtn) giftBtn.style.display = 'flex';
    
    // Hide all AR Models
    for (let i = 0; i < 8; i++) {
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
  if (index === 8) {
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
  if (currentPhaseIndex !== 8) {
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
  
  const trigger = (e) => {
    e.preventDefault(); 
    if(!gameOver) action(); 
    draw();
  };
  
  // Use touchstart and mousedown for instant mobile responsiveness
  btn.addEventListener('touchstart', trigger, { passive: false });
  btn.addEventListener('mousedown', trigger);
}

addControl(btnUp, () => playerRotate(1));
addControl(btnDown, () => playerDrop());
addControl(btnLeft, () => playerMove(-1));
addControl(btnRight, () => playerMove(1));

const btnATrigger = (e) => {
    e.preventDefault();
    if(gameOver) resetGame();
};
btnA.addEventListener('touchstart', btnATrigger, { passive: false });
btnA.addEventListener('mousedown', btnATrigger);

const btnStartTrigger = (e) => {
    e.preventDefault();
    if(gameOver) resetGame();
};
btnStart.addEventListener('touchstart', btnStartTrigger, { passive: false });
btnStart.addEventListener('mousedown', btnStartTrigger);

// Keyboard controls
window.addEventListener('keydown', (e) => {
  if (currentPhaseIndex !== 8) return;
  
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

// AR Model Touch Gestures (Rotate & Zoom)
let touchState = {
  mode: 'none', // 'rotate' or 'zoom'
  initialDist: 0,
  initialScale: 0.5,
  lastX: 0,
  lastY: 0,
  currentRot: {x: 0, y: 0, z: 0}
};

document.addEventListener('touchstart', (e) => {
  if (e.target.tagName !== 'CANVAS') return;
  
  const currentModel = document.getElementById(`ar-model-${currentPhaseIndex}`);
  if (!currentModel || currentPhaseIndex >= 8) return; // Ignore if Retro Play phase
  
  if (e.touches.length === 1) {
    touchState.mode = 'rotate';
    touchState.lastX = e.touches[0].pageX;
    touchState.lastY = e.touches[0].pageY;
    const rot = currentModel.getAttribute('rotation') || {x: 0, y: 0, z: 0};
    touchState.currentRot = { x: rot.x || 0, y: rot.y || 0, z: rot.z || 0 };
  } else if (e.touches.length === 2) {
    touchState.mode = 'zoom';
    const dx = e.touches[0].pageX - e.touches[1].pageX;
    const dy = e.touches[0].pageY - e.touches[1].pageY;
    touchState.initialDist = Math.hypot(dx, dy);
    const scale = currentModel.getAttribute('scale') || {x: 0.5, y: 0.5, z: 0.5};
    touchState.initialScale = scale.x || 0.5;
  }
}, { passive: false });

document.addEventListener('touchmove', (e) => {
  if (touchState.mode === 'none' || e.target.tagName !== 'CANVAS') return;
  e.preventDefault(); // Prevent scrolling while interacting with AR
  
  const currentModel = document.getElementById(`ar-model-${currentPhaseIndex}`);
  if (!currentModel) return;

  if (touchState.mode === 'rotate' && e.touches.length === 1) {
    const deltaX = e.touches[0].pageX - touchState.lastX;
    const deltaY = e.touches[0].pageY - touchState.lastY;
    
    // Rotate model. Dragging horizontally rotates around Y axis.
    touchState.currentRot.y += deltaX * 0.5;
    touchState.currentRot.x += deltaY * 0.5;
    
    currentModel.setAttribute('rotation', touchState.currentRot);
    
    touchState.lastX = e.touches[0].pageX;
    touchState.lastY = e.touches[0].pageY;
  } else if (touchState.mode === 'zoom' && e.touches.length === 2) {
    const dx = e.touches[0].pageX - e.touches[1].pageX;
    const dy = e.touches[0].pageY - e.touches[1].pageY;
    const dist = Math.hypot(dx, dy);
    
    if (touchState.initialDist > 0) {
      const scaleFactor = dist / touchState.initialDist;
      // Limit zoom between 0.1 and 3.0
      const newScale = Math.max(0.1, Math.min(3.0, touchState.initialScale * scaleFactor)); 
      currentModel.setAttribute('scale', `${newScale} ${newScale} ${newScale}`);
    }
  }
}, { passive: false });

document.addEventListener('touchend', (e) => {
  if (e.touches.length === 0) {
    touchState.mode = 'none';
  } else if (e.touches.length === 1) {
    touchState.mode = 'rotate';
    touchState.lastX = e.touches[0].pageX;
    touchState.lastY = e.touches[0].pageY;
  }
});

