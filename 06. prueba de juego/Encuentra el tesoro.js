// Get canvas element and its 2D drawing context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameMessage = document.getElementById('gameMessage');
const startButton = document.getElementById('startButton');

// Get touch control buttons
const upButton = document.getElementById('upButton');
const downButton = document.getElementById('downButton');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');

// Game variables
const TILE_SIZE = 40; // Size of each tile in the map
const PLAYER_SIZE = 30; // Player character size
const TREASURE_SIZE = 25; // Treasure size
const PLAYER_SPEED = 150; // Player movement speed in pixels per second

let player = {
    x: TILE_SIZE * 1, // Start position
    y: TILE_SIZE * 1,
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    dx: 0, // Horizontal movement speed
    dy: 0  // Vertical movement speed
};

let treasure = {
    x: TILE_SIZE * 10, // Treasure position
    y: TILE_SIZE * 7,
    width: TREASURE_SIZE,
    height: TREASURE_SIZE,
    collected: false
};

let gameRunning = false;
let lastFrameTime = 0; // For calculating delta time

// Simple map (0 = empty, 1 = wall)
// This is a 15x10 map (canvas width 600 / 40 = 15, canvas height 400 / 40 = 10)
const gameMap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// --- Drawing Functions ---

// Draws the game map
function drawMap() {
    for (let row = 0; row < gameMap.length; row++) {
        for (let col = 0; col < gameMap[row].length; col++) {
            const tileX = col * TILE_SIZE;
            const tileY = row * TILE_SIZE;
            if (gameMap[row][col] === 1) {
                ctx.fillStyle = '#4a5568'; // Wall color
                ctx.fillRect(tileX, tileY, TILE_SIZE, TILE_SIZE);
            } else {
                ctx.fillStyle = '#333'; // Floor color
                ctx.fillRect(tileX, tileY, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}

// Draws the player character
function drawPlayer() {
    ctx.fillStyle = '#4299e1'; // Player color (blue)
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draws the treasure
function drawTreasure() {
    if (!treasure.collected) {
        ctx.fillStyle = '#f6ad55'; // Treasure color (orange)
        ctx.beginPath();
        ctx.arc(treasure.x + TREASURE_SIZE / 2, treasure.y + TREASURE_SIZE / 2, TREASURE_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Draws all game elements
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw elements
    drawMap();
    drawTreasure();
    drawPlayer();
}

// --- Game Update Functions ---

// Checks for collision between two rectangles
function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// Updates player position and handles collisions
function updatePlayer(deltaTime) {
    const newPlayerX = player.x + player.dx * deltaTime;
    const newPlayerY = player.y + player.dy * deltaTime;

    // Collision with map walls
    let collidedX = false;
    let collidedY = false;

    // Check horizontal collision
    const playerRectX = { x: newPlayerX, y: player.y, width: player.width, height: player.height };
 for (let row = 0; row < gameMap.length; row++) {
        for (let col = 0; col < gameMap[row].length; col++) {
            if (gameMap[row][col] === 1) { // If it's a wall
                const wallRect = {
                    x: col * TILE_SIZE,
                    y: row * TILE_SIZE,
                    width: TILE_SIZE,
                    height: TILE_SIZE
                };
                if (checkCollision(playerRectX, wallRect)) {
                    collidedX = true;
                    break;
                }
            }
        }
        if (collidedX) break;
    }

    // Check vertical collision
    const playerRectY = { x: player.x, y: newPlayerY, width: player.width, height: player.height };
    for (let row = 0; row < gameMap.length; row++) {
        for (let col = 0; col < gameMap[row].length; col++) {
            if (gameMap[row][col] === 1) { // If it's a wall
                const wallRect = {
                    x: col * TILE_SIZE,
                    y: row * TILE_SIZE,
                    width: TILE_SIZE,
                    height: TILE_SIZE
                };
                if (checkCollision(playerRectY, wallRect)) {
                    collidedY = true;
                    break;
                }
            }
        }
        if (collidedY) break;
    }

    if (!collidedX) {
        player.x = newPlayerX;
    }
    if (!collidedY) {
        player.y = newPlayerY;
    }

    // Keep player within canvas boundaries
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;

    // Check for treasure collection
    if (!treasure.collected && checkCollision(player, treasure)) {
        treasure.collected = true;
        updateGameMessage('¡Has encontrado el tesoro! ¡Felicidades!');
        gameRunning = false; // End game after collecting treasure
        startButton.textContent = 'Jugar de Nuevo';
    }
}

// Update game message
function updateGameMessage(message) {
    gameMessage.textContent = message;
}

// --- Main Game Loop ---

function gameLoop(currentTime) {
    if (!gameRunning) {
        lastFrameTime = currentTime; // Reset to avoid large jumps when resuming
        requestAnimationFrame(gameLoop);
        return;
    }

    const deltaTime = (currentTime - lastFrameTime) / 1000; // Convert to seconds
    lastFrameTime = currentTime;

    updatePlayer(deltaTime);
    draw();

    requestAnimationFrame(gameLoop); // Request next frame
}

// --- Controls ---

let keysPressed = {}; // To handle multiple keys pressed

document.addEventListener('keydown', (e) => {
    keysPressed[e.key] = true;

    // Start/Pause with spacebar
    if (e.key === ' ' && !gameRunning) {
        startGame();
    }
});

document.addEventListener('keyup', (e) => {
    delete keysPressed[e.key];
});

// Function to update player speed based on pressed keys
function handlePlayerMovement() {
    player.dx = 0;
    player.dy = 0;

    if (keysPressed['ArrowUp'] || keysPressed['w'] || keysPressed['W']) {
        player.dy = -PLAYER_SPEED;
    }
    if (keysPressed['ArrowDown'] || keysPressed['s'] || keysPressed['S']) {
        player.dy = PLAYER_SPEED;
    }
    if (keysPressed['ArrowLeft'] || keysPressed['a'] || keysPressed['A']) {
        player.dx = -PLAYER_SPEED;
    }
    if (keysPressed['ArrowRight'] || keysPressed['d'] || keysPressed['D']) {
        player.dx = PLAYER_SPEED;
    }

    // Normalize diagonal movement speed
    if (player.dx !== 0 && player.dy !== 0) {
        const magnitude = Math.sqrt(player.dx * player.dx + player.dy * player.dy);
        player.dx = (player.dx / magnitude) * PLAYER_SPEED;
        player.dy = (player.dy / magnitude) * PLAYER_SPEED;
    }
}

// Call player movement function every frame
setInterval(handlePlayerMovement, 1000 / 60); // Execute 60 times per second

// --- Touch Controls (for mobile devices) ---
// Using a single function to manage touch movement state
function setTouchMovement(direction, isActive) {
    if (isActive) {
        if (!gameRunning) startGame(); // Start game on first touch
        switch (direction) {
            case 'up': player.dy = -PLAYER_SPEED; break;
            case 'down': player.dy = PLAYER_SPEED; break;
            case 'left': player.dx = -PLAYER_SPEED; break;
            case 'right': player.dx = PLAYER_SPEED; break;
        }
    } else {
        // Only stop if no other directional touch button is active
        let anyOtherDirectionActive = false;
        if (direction === 'up' && downButton.dataset.active === 'true') anyOtherDirectionActive = true;
        if (direction === 'down' && upButton.dataset.active === 'true') anyOtherDirectionActive = true;
        if (direction === 'left' && rightButton.dataset.active === 'true') anyOtherDirectionActive = true;
        if (direction === 'right' && leftButton.dataset.active === 'true') anyOtherDirectionActive = true;

        if (!anyOtherDirectionActive) {
            switch (direction) {
                case 'up':
                case 'down':
                    if (player.dy !== 0) player.dy = 0;
                    break;
                case 'left':
                case 'right':
                    if (player.dx !== 0) player.dx = 0;
                    break;
            }
        }
    }
    // Normalize diagonal movement speed after adjusting dx/dy
    if (player.dx !== 0 && player.dy !== 0) {
        const magnitude = Math.sqrt(player.dx * player.dx + player.dy * player.dy);
        player.dx = (player.dx / magnitude) * PLAYER_SPEED;
        player.dy = (player.dy / magnitude) * PLAYER_SPEED;
    }
}


// Helper to add touch listeners
function addTouchListeners(button, direction) {
    button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        button.dataset.active = 'true';
        setTouchMovement(direction, true);
    });
    button.addEventListener('touchend', () => {
        button.dataset.active = 'false';
        setTouchMovement(direction, false);
    });
    button.addEventListener('touchcancel', () => { // Handle cases where touch is interrupted
        button.dataset.active = 'false';
        setTouchMovement(direction, false);
    });
}

addTouchListeners(upButton, 'up');
addTouchListeners(downButton, 'down');
addTouchListeners(leftButton, 'left');
addTouchListeners(rightButton, 'right');


// --- Start/Reset Functions ---

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        player.x = TILE_SIZE * 1;
        player.y = TILE_SIZE * 1;
        player.dx = 0;
        player.dy = 0;
        treasure.collected = false;
        updateGameMessage('¡Encuentra el tesoro!');
        startButton.textContent = 'Reiniciar Juego';
        requestAnimationFrame(gameLoop); // Start game loop
    } else {
        // If game is already running, reset
        gameRunning = false;
        player.x = TILE_SIZE * 1;
        player.y = TILE_SIZE * 1;
        player.dx = 0;
        player.dy = 0;
        treasure.collected = false;
        updateGameMessage('Juego Reiniciado. Presiona "Iniciar Juego" o "Espacio" para comenzar.');
        startButton.textContent = 'Iniciar Juego';
        draw(); // Draw initial state
    }
}

startButton.addEventListener('click', startGame);

// --- Initialization ---

// Ensure canvas resizes to be responsive
function resizeCanvas() {
    const container = document.querySelector('.game-container');
    const aspectRatio = 600 / 400; // Original canvas aspect ratio (width/height)

    let newWidth = container.clientWidth * 0.9; // 90% of container width
    let newHeight = newWidth / aspectRatio;

    // Ensure it doesn't exceed window height
    if (newHeight > window.innerHeight * 0.7) { // 70% of window height
        newHeight = window.innerHeight * 0.7;
        newWidth = newHeight * aspectRatio;
    }

    canvas.width = newWidth;
    canvas.height = newHeight;

    // Redraw everything after resizing
    draw();
}

window.addEventListener('resize', resizeCanvas);
window.onload = () => {
    resizeCanvas(); // Adjust initial canvas size
    draw(); // Draw initial game state
};
