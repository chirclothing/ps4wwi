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
    bgmPath: "audio/Atari System Startup Sounds (1985-1987)(M4A_128K).m4a",
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
    bgmPath: "audio/Intro NES   Startup Screen HD(M4A_128K).m4a",
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
    bgmPath: "audio/Super Nintendo Startup Screen(M4A_128K).m4a",
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
    bgmPath: "audio/PlayStation Intro 1080p [Remastered](M4A_128K).m4a",
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
    bgmPath: "audio/Nintendo 64 Startup(M4A_128K).m4a",
    features: [
      "First central analog stick",
      "Three-pronged design",
      "Z-trigger",
      "Expansion slot"
    ]
  },
  {
    title: "6. PlayStation DualShock – The Psycho Mantis Era",
    released: "1997",
    history: "Introduced revolutionary dual analog sticks and haptic force feedback, changing 3D game design forever. Its true creative potential was immortalized in Hideo Kojima's Metal Gear Solid during the legendary boss fight against Psycho Mantis.",
    bgmPath: "audio/Playstation 2 Startup Noise(M4A_128K).m4a",
    features: [
      "Psychic Haptics: Used DualShock vibration motors to simulate Psycho Mantis's telepathic powers.",
      "Memory Card Reading: Analyzed saved games on the player's memory card and verbally commented on them during gameplay.",
      "Port Switching Mechanic: Required players to physically switch the controller from Port 1 to Port 2 to defeat the boss.",
      "Fourth-Wall Breaking: Pioneered one of the most famous fourth-wall-breaking moments in video game history.",
      "Innovative Hardware Potential: Showcased how physical controller hardware could be used creatively beyond standard input buttons."
    ]
  },

  {
    title: "7. Xbox One Controller",
    released: "2013",
    history: "Microsoft redesigned the Xbox controller with better comfort, improved precision, and immersive trigger vibrations.",
    bgmPath: "audio/Xbox One and One S Startup Sound and Screen(M4A_128K).m4a",
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
    bgmPath: "audio/Playstation 4 (PS4) StartUp - Sound Effect for editing(M4A_128K).m4a",
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
    bgmPath: "",
    features: []
  }
];

const numPhases = 9;
let currentPhaseIndex = 0;

// Audio System & SFX Manager
const audioManager = {
  ctx: null,
  isMuted: false,
  bgmAudio: null,
  currentBgmPath: null,
  bgmCache: {},

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  getBgm(path) {
    if (!path) return null;
    if (!this.bgmCache[path]) {
      const audio = new Audio(path);
      audio.loop = true;
      this.bgmCache[path] = audio;
    }
    return this.bgmCache[path];
  },

  playBgmForPhase(phaseIndex) {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio.currentTime = 0;
    }
    Object.values(this.bgmCache).forEach(a => {
      a.pause();
      a.currentTime = 0;
    });

    const data = phaseData[phaseIndex];
    if (!data || !data.bgmPath) {
      this.bgmAudio = null;
      this.currentBgmPath = null;
      return;
    }

    this.bgmAudio = this.getBgm(data.bgmPath);
    this.currentBgmPath = data.bgmPath;

    if (!this.isMuted && this.bgmAudio) {
      this.bgmAudio.currentTime = 0;
      this.bgmAudio.play().catch(err => console.log("BGM autoplay prevented:", err));
    }
  },

  toggleMute() {
    this.isMuted = !this.isMuted;
    const btn = document.getElementById('audio-toggle-btn');
    if (btn) {
      btn.textContent = this.isMuted ? '🔇' : '🔊';
      btn.classList.toggle('muted', this.isMuted);
    }
    if (this.isMuted) {
      if (this.bgmAudio) {
        this.bgmAudio.pause();
      }
    } else {
      if (this.bgmAudio) {
        this.bgmAudio.play().catch(err => console.log("BGM play error:", err));
      } else {
        this.playBgmForPhase(currentPhaseIndex);
      }
    }
    return this.isMuted;
  },

  playPhaseSound(phaseIndex) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    switch(phaseIndex) {
      case 0: // Atari 2600 (Pong beep)
        osc.type = 'square';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(165, now + 0.1);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
        break;
      case 1: // NES (Coin/Jump chime)
        osc.type = 'square';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      case 2: // SNES (16-bit chord arpeggio)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.06); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.12); // G5
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
        break;
      case 3: // PS1 (Atmospheric chime)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
        break;
      case 4: // N64 (Playful marimba pop)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.08); // A5
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
        break;
      case 5: // PS1 DualShock (Psycho Mantis eerie psychic sweep)
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(700, now + 0.25);
        osc.frequency.linearRampToValueAtTime(400, now + 0.5);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
        osc.start(now);
        osc.stop(now + 0.55);
        break;
      case 6: // Xbox One (Clean tech beep)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.setValueAtTime(900, now + 0.07);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
        break;
      case 7: // PS4 DualShock 4 (Sleek harmonic chime)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, now); // E5
        osc.frequency.setValueAtTime(987.77, now + 0.1); // B5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
      case 8: // GameBoy Retro Play ("Ba-Ding!" startup sound)
        osc.type = 'square';
        osc.frequency.setValueAtTime(783.99, now); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.12); // C6
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
        break;
    }
  },

  playSfx(type) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    if (type === 'move') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(400, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'rotate') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'line') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      osc.frequency.setValueAtTime(783.99, now + 0.16);
      osc.frequency.setValueAtTime(1046.50, now + 0.24);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'gameover') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(150, now + 0.4);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    }
  }
};

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

  // Top Drawer Accordion Toggle (Default: OPEN)
  const topDrawer = document.getElementById('top-drawer');
  const topToggleBtn = document.getElementById('top-drawer-toggle');
  const topToggleArrow = document.getElementById('top-toggle-arrow');
  if (topToggleBtn && topDrawer) {
    topToggleBtn.addEventListener('click', () => {
      const isCollapsed = topDrawer.classList.toggle('collapsed');
      topDrawer.classList.toggle('open', !isCollapsed);
      if (topToggleArrow) topToggleArrow.textContent = isCollapsed ? '▼' : '▲';
    });
  }

  // Bottom Drawer Accordion Toggle (Default: CLOSED)
  const bottomDrawer = document.getElementById('bottom-drawer');
  const bottomToggleBtn = document.getElementById('bottom-drawer-toggle');
  const bottomToggleArrow = document.getElementById('bottom-toggle-arrow');
  if (bottomToggleBtn && bottomDrawer) {
    bottomToggleBtn.addEventListener('click', () => {
      const isCollapsed = bottomDrawer.classList.toggle('collapsed');
      if (bottomToggleArrow) bottomToggleArrow.textContent = isCollapsed ? '▲' : '▼';
    });
  }

  // Audio Toggle Button
  const audioBtn = document.getElementById('audio-toggle-btn');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      audioManager.toggleMute();
    });
  }

  // Initialize nav state
  updateNav();

  // Handle BGM autoplay restriction by starting on first interaction if paused
  const startInitialBgm = () => {
    if (!audioManager.isMuted && audioManager.bgmAudio && audioManager.bgmAudio.paused) {
      audioManager.bgmAudio.play().catch(() => {});
    }
    window.removeEventListener('click', startInitialBgm);
    window.removeEventListener('touchstart', startInitialBgm);
  };
  window.addEventListener('click', startInitialBgm);
  window.addEventListener('touchstart', startInitialBgm);

  // Start initial BGM
  audioManager.playBgmForPhase(currentPhaseIndex);
});

function updateNav() {
  const indicators = document.querySelectorAll('.indicator');
  const gameboyTitle = document.getElementById('gameboy-title');
  const giftBtn = document.getElementById('gift-btn');
  const topDrawer = document.getElementById('top-drawer');
  const bottomDrawer = document.getElementById('bottom-drawer');
  
  // Update buttons
  prevBtn.disabled = currentPhaseIndex === 0;
  nextBtn.disabled = currentPhaseIndex === numPhases - 1;

  // Update indicators
  indicators.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentPhaseIndex);
  });
  
  // Update UI & AR models
  if (currentPhaseIndex < 8) {
    // Show Info Panel Drawers, hide GameBoy elements
    if (topDrawer) topDrawer.style.display = 'flex';
    if (bottomDrawer) bottomDrawer.style.display = 'flex';
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
    // Show GameBoy elements, hide Info Panel Drawers
    if (topDrawer) topDrawer.style.display = 'none';
    if (bottomDrawer) bottomDrawer.style.display = 'none';
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
  if (index !== currentPhaseIndex) {
    audioManager.playPhaseSound(index);
    audioManager.playBgmForPhase(index);
  }
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
let isPaused = false;
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
    audioManager.playSfx('gameover');
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

  if (isPaused) {
    ctx.fillStyle = "rgba(15, 56, 15, 0.75)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = GB_GREEN;
    ctx.font = "12px 'Press Start 2P', monospace";
    ctx.textAlign = "center";
    ctx.fillText("PAUSED", canvas.width/2, canvas.height/2);
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
    audioManager.playSfx('line');
  }
}

function playerDrop() {
  if (gameOver || isPaused) return;
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
  if (gameOver || isPaused) return;
  player.pos.x += offset;
  if (collide(board, player)) {
    player.pos.x -= offset;
  } else {
    audioManager.playSfx('move');
  }
}

function rotate(matrix, dir) {
  const transposed = matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  if (dir > 0) return transposed.map(row => row.reverse());
  return transposed.reverse();
}

function playerRotate(dir) {
  if (gameOver || isPaused) return;
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
  audioManager.playSfx('rotate');
}

function hardDrop() {
  if (gameOver || isPaused) return;
  while (!collide(board, player)) {
    player.pos.y++;
  }
  player.pos.y--;
  merge(board, player);
  sweep();
  createPiece();
  dropCounter = 0;
  audioManager.playSfx('move');
}

function togglePause() {
  if (gameOver) return;
  isPaused = !isPaused;
  if (!isPaused) {
    lastTime = performance.now();
  }
  audioManager.playSfx('move');
  draw();
}

function update(time = 0) {
  if (currentPhaseIndex !== 8) {
     animationId = null;
     return;
  }
  
  const deltaTime = time - lastTime;
  lastTime = time;

  if (!gameOver && !isPaused) {
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
const btnB = document.getElementById('btn-b');
const btnStart = document.getElementById('btn-start');
const btnSelect = document.getElementById('btn-select');

function addControl(btn, action) {
  if (!btn) return;
  
  const trigger = (e) => {
    e.preventDefault(); 
    if (action) action(); 
    draw();
  };
  
  const addPressed = () => btn.classList.add('pressed');
  const removePressed = () => btn.classList.remove('pressed');
  
  // Use touchstart and mousedown for instant mobile responsiveness
  btn.addEventListener('touchstart', (e) => { trigger(e); addPressed(); }, { passive: false });
  btn.addEventListener('touchend', removePressed);
  btn.addEventListener('touchcancel', removePressed);
  
  btn.addEventListener('mousedown', (e) => { trigger(e); addPressed(); });
  btn.addEventListener('mouseup', removePressed);
  btn.addEventListener('mouseleave', removePressed);
}

addControl(btnUp, () => playerRotate(1));
addControl(btnDown, () => playerDrop());
addControl(btnLeft, () => playerMove(-1));
addControl(btnRight, () => playerMove(1));
addControl(btnA, () => playerRotate(1));
addControl(btnB, () => hardDrop());
addControl(btnStart, () => togglePause());
addControl(btnSelect, () => resetGame());

// Keyboard controls
window.addEventListener('keydown', (e) => {
  if (currentPhaseIndex !== 8) return;
  
  switch(e.key) {
    case 'ArrowUp': 
    case 'z':
    case 'x':
      e.preventDefault(); 
      playerRotate(1); 
      draw();
      break;
    case 'ArrowDown': 
      e.preventDefault(); 
      playerDrop(); 
      draw();
      break;
    case 'ArrowLeft': 
      e.preventDefault(); 
      playerMove(-1); 
      draw();
      break;
    case 'ArrowRight': 
      e.preventDefault(); 
      playerMove(1); 
      draw();
      break;
    case ' ':
      e.preventDefault();
      hardDrop();
      draw();
      break;
    case 'p':
    case 'P':
    case 'Enter':
      e.preventDefault();
      if (gameOver) resetGame();
      else togglePause();
      break;
    case 'r':
    case 'R':
    case 'Backspace':
      e.preventDefault();
      resetGame();
      break;
  }
});

function resetGame() {
  board.forEach(row => row.fill(0));
  score = 0;
  gameOver = false;
  isPaused = false;
  dropInterval = 500;
  createPiece();
  lastTime = performance.now();
  if (animationId) cancelAnimationFrame(animationId);
  animationId = requestAnimationFrame(update);
  audioManager.playSfx('line');
}

// Initial initialization
createPiece();
draw();

// AR Model Touch Gestures (Zoom Only - Rotation is locked to IRL controller)
let touchState = {
  mode: 'none', // 'zoom'
  initialDist: 0,
  initialScale: 0.5
};

document.addEventListener('touchstart', (e) => {
  if (e.target.tagName !== 'CANVAS') return;
  
  const currentModel = document.getElementById(`ar-model-${currentPhaseIndex}`);
  if (!currentModel || currentPhaseIndex >= 8) return; // Ignore if Retro Play phase
  
  if (e.touches.length === 2) {
    touchState.mode = 'zoom';
    const dx = e.touches[0].pageX - e.touches[1].pageX;
    const dy = e.touches[0].pageY - e.touches[1].pageY;
    touchState.initialDist = Math.hypot(dx, dy);
    const scale = currentModel.getAttribute('scale') || {x: 0.5, y: 0.5, z: 0.5};
    touchState.initialScale = scale.x || 0.5;
  } else {
    touchState.mode = 'none';
  }
}, { passive: false });

document.addEventListener('touchmove', (e) => {
  if (touchState.mode !== 'zoom' || e.target.tagName !== 'CANVAS' || e.touches.length !== 2) return;
  e.preventDefault(); // Prevent scrolling while zooming
  
  const currentModel = document.getElementById(`ar-model-${currentPhaseIndex}`);
  if (!currentModel) return;

  const dx = e.touches[0].pageX - e.touches[1].pageX;
  const dy = e.touches[0].pageY - e.touches[1].pageY;
  const dist = Math.hypot(dx, dy);
  
  if (touchState.initialDist > 0) {
    const scaleFactor = dist / touchState.initialDist;
    // Limit zoom between 0.1 and 3.0
    const newScale = Math.max(0.1, Math.min(3.0, touchState.initialScale * scaleFactor)); 
    currentModel.setAttribute('scale', `${newScale} ${newScale} ${newScale}`);
  }
}, { passive: false });

document.addEventListener('touchend', (e) => {
  if (e.touches.length < 2) {
    touchState.mode = 'none';
  }
});

