const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameMessage = document.getElementById('gameMessage');
const startButton = document.getElementById('startButton');

// Get touch control buttons
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');
const jumpButton = document.getElementById('jumpButton');

// Game constants
const TILE_SIZE = 40; // Size of each tile/platform segment
const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 40;
const PLAYER_SPEED = 180; // Pixels per second
const JUMP_VELOCITY = 500; // Initial upward velocity for jump
const GRAVITY = 900; // Pixels per second squared

// Game variables
let player = {
    x: TILE_SIZE * 2, // Starting position in world coordinates
    y: canvas.height - TILE_SIZE - PLAYER_HEIGHT, // Starting position in world coordinates
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    dx: 0, // Horizontal velocity
    dy: 0, // Vertical velocity
    isOnGround: true, // Is the player currently on a platform?
    isJumping: false // Is the player currently performing a jump?
};

// Camera position (simulates scrolling)
let cameraX = 0;

// Level platforms (x, y, width, height)
// Note: x and y are relative to the game world, not the canvas
const platforms = [
    // Ground level
    { x: 0, y: canvas.height - TILE_SIZE, width: TILE_SIZE * 20, height: TILE_SIZE },
    // Floating platforms
    { x: TILE_SIZE * 5, y: canvas.height - TILE_SIZE * 3, width: TILE_SIZE * 3, height: TILE_SIZE },
    { x: TILE_SIZE * 10, y: canvas.height - TILE_SIZE * 5, width: TILE_SIZE * 2, height: TILE_SIZE },
    { x: TILE_SIZE * 15, y: canvas.height - TILE_SIZE * 3, width: TILE_SIZE * 4, height: TILE_SIZE },
    { x: TILE_SIZE * 22, y: canvas.height - TILE_SIZE * 2, width: TILE_SIZE * 5, height: TILE_SIZE },
    { x: TILE_SIZE * 28, y: canvas.height - TILE_SIZE * 4, width: TILE_SIZE * 3, height: TILE_SIZE },
    { x: TILE_SIZE * 33, y: canvas.height - TILE_SIZE * 6, width: TILE_SIZE * 2, height: TILE_SIZE },
    { x: TILE_SIZE * 37, y: canvas.height - TILE_SIZE * 3, width: TILE_SIZE * 5, height: TILE_SIZE },
    // A "pit" at the end of the level to show falling
    { x: TILE_SIZE * 45, y: canvas.height - TILE_SIZE, width: TILE_SIZE * 10, height: TILE_SIZE },
];

let gameRunning = false;
let lastFrameTime = 0; // For calculating delta time

// --- Drawing Functions ---

// Draws a rectangle (used for player and platforms)
function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

// Draws all game elements
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw platforms (adjusted by cameraX)
    ctx.fillStyle = '#6b46c1'; // Platform color (purple)
    platforms.forEach(platform => {
        // Only draw platforms that are visible on screen
        if (platform.x + platform.width > cameraX && platform.x < cameraX + canvas.width) {
            drawRect(platform.x - cameraX, platform.y, platform.width, platform.height, '#6b46c1');
        }
    });

    // Draw player (player's x is fixed on screen, camera moves around it)
    const playerScreenX = player.x - cameraX;
    drawRect(playerScreenX, player.y, player.width, player.height, '#f6ad55'); // Player color (orange)

    // Draw hat (relative to player's position)
    const hatWidth = player.width * 1.2;
    const hatHeight = player.height * 0.3;
    const hatX = playerScreenX - (hatWidth - player.width) / 2;
    const hatY = player.y - hatHeight;
    drawRect(hatX, hatY, hatWidth, hatHeight, '#a0aec0'); // Hat color (medium blue-gray)

    // Draw hat brim (a smaller rectangle on top of the hat base)
    const brimWidth = player.width * 0.8;
    const brimHeight = player.height * 0.1;
    const brimX = playerScreenX - (brimWidth - player.width) / 2;
    const brimY = player.y - hatHeight - brimHeight;
    drawRect(brimX, brimY, brimWidth, brimHeight, '#718096'); // Brim color (darker gray)
}

// --- Game Update Functions ---

// Checks for collision between two rectangles
function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// Updates player position and handles physics/collisions
function updatePlayer(deltaTime) {
    // Apply gravity
    player.dy += GRAVITY * deltaTime;

    // Calculate potential new position
    let newPlayerX = player.x + player.dx * deltaTime;
    let newPlayerY = player.y + player.dy * deltaTime;

    player.isOnGround = false; // Assume not on ground until collision is confirmed

    // Collision detection with platforms
    platforms.forEach(platform => {
        // Create potential player rectangles for X and Y movement separately
        const playerRectX = { x: newPlayerX, y: player.y, width: player.width, height: player.height };
        const playerRectY = { x: player.x, y: newPlayerY, width: player.width, height: player.height };

        // Check horizontal collision first
        if (checkCollision(playerRectX, platform)) {
            // Horizontal collision
            if (player.dx > 0) { // Moving right
                newPlayerX = platform.x - player.width;
            } else if (player.dx < 0) { // Moving left
                newPlayerX = platform.x + platform.width;
            }
            player.dx = 0; // Stop horizontal movement on collision
        }

        // Check vertical collision
        if (checkCollision(playerRectY, platform)) {
            // Vertical collision
            if (player.dy > 0) { // Falling down (hitting top of platform)
                newPlayerY = platform.y - player.height; // Place player on top of platform
                player.dy = 0; // Stop vertical movement
                player.isOnGround = true; // Player is on ground
                player.isJumping = false; // Reset jump state
            } else if (player.dy < 0) { // Moving up (hitting bottom of platform)
                newPlayerY = platform.y + platform.height; // Place player below platform
                player.dy = 0; // Stop upward movement
            }
        }
    });

    // Update player position
    player.x = newPlayerX;
    player.y = newPlayerY;

    // Keep player within vertical canvas boundaries (e.g., game over if falls too far)
    if (player.y + player.height > canvas.height + 100) { // 100 pixels below screen
        updateGameMessage('¡Game Over! Te caíste.');
        gameRunning = false;
        startButton.textContent = 'Jugar de Nuevo';
    }
    // Prevent player from going above the screen
    if (player.y < 0) {
        player.y = 0;
        if (player.dy < 0) player.dy = 0; // Stop upward movement if hitting top
    }
}

// Updates the camera position to follow the player
function updateCamera() {
    // Keep player roughly centered horizontally on the screen
    const playerScreenX = player.x - cameraX;
    const centerScreenX = canvas.width / 2;

    // Adjust cameraX so player is centered, but prevent camera from going too far left (start of level)
    cameraX = player.x - centerScreenX;

    // Clamp cameraX to prevent showing areas outside the level bounds
    // Assuming the level starts at x=0 and extends to the last platform's end
    const lastPlatform = platforms[platforms.length - 1];
    const totalLevelWidth = lastPlatform.x + lastPlatform.width;
    const maxCameraX = totalLevelWidth - canvas.width;

    if (cameraX < 0) cameraX = 0;
    if (maxCameraX > 0 && cameraX > maxCameraX) cameraX = maxCameraX;
    // If the level is smaller than the canvas, center the camera
    if (totalLevelWidth < canvas.width) cameraX = (totalLevelWidth - canvas.width) / 2;
}

// Update game message
function updateGameMessage(message) {
    gameMessage.textContent = message;
}

// --- Main Game Loop ---

function gameLoop(currentTime) {
    // If game is not running, just request next frame and return
    if (!gameRunning) {
        lastFrameTime = currentTime; // Reset to avoid large jumps when resuming
        requestAnimationFrame(gameLoop);
        return;
    }

    const deltaTime = (currentTime - lastFrameTime) / 1000; // Convert to seconds
    lastFrameTime = currentTime;

    // Handle player horizontal movement based on keys/touch
    player.dx = 0; // Reset horizontal velocity
    if (keysPressed['ArrowLeft'] || keysPressed['a'] || keysPressed['A'] || touchMovement.left) {
        player.dx = -PLAYER_SPEED;
    }
    if (keysPressed['ArrowRight'] || keysPressed['d'] || keysPressed['D'] || touchMovement.right) {
        player.dx = PLAYER_SPEED;
    }

    updatePlayer(deltaTime);
    updateCamera(); // Update camera after player position
    draw();

    requestAnimationFrame(gameLoop); // Request next frame
}

// --- Controls ---

let keysPressed = {}; // To handle multiple keys pressed simultaneously
let touchMovement = { left: false, right: false, jump: false }; // To handle touch states

document.addEventListener('keydown', (e) => {
    keysPressed[e.key] = true;

    // Start game with spacebar
    if (e.key === ' ' && !gameRunning) {
        startGame();
    }
    // Jump with Space or ArrowUp
    if ((e.key === ' ' || e.key === 'ArrowUp') && player.isOnGround && gameRunning) {
        player.dy = -JUMP_VELOCITY; // Apply upward velocity
        player.isOnGround = false; // No longer on ground
        player.isJumping = true; // Mark as jumping
    }
});

document.addEventListener('keyup', (e) => {
    delete keysPressed[e.key];
});

// --- Touch Controls (for mobile devices) ---
// Using a single function to manage touch movement state
function setTouchMovement(direction, isActive) {
    if (!gameRunning) {
        if (isActive) startGame(); // Start game on first touch
        return; // Don't process movement if game not running
    }

    if (direction === 'jump') {
        if (isActive && player.isOnGround) {
            player.dy = -JUMP_VELOCITY;
            player.isOnGround = false;
            player.isJumping = true;
        }
        return; // Jump is a one-shot action, not continuous
    }

    // For horizontal movement
    touchMovement[direction] = isActive; // Set the touch state for the direction
}

// Helper to add touch listeners
function addTouchListeners(button, direction) {
    button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        button.dataset.active = 'true'; // Mark button as active
        setTouchMovement(direction, true);
    });
    button.addEventListener('touchend', () => {
        button.dataset.active = 'false'; // Mark button as inactive
        setTouchMovement(direction, false);
    });
    button.addEventListener('touchcancel', () => { // Handle cases where touch is interrupted
        button.dataset.active = 'false';
        setTouchMovement(direction, false);
    });
}

addTouchListeners(leftButton, 'left');
addTouchListeners(rightButton, 'right');
addTouchListeners(jumpButton, 'jump');


// --- Start/Reset Functions ---

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        // Reset player position and state
        player.x = TILE_SIZE * 2;
        player.y = canvas.height - TILE_SIZE - PLAYER_HEIGHT;
        player.dx = 0;
        player.dy = 0;
        player.isOnGround = true;
        player.isJumping = false; // Player starts on the ground, not jumping
        cameraX = 0; // Reset camera position

        updateGameMessage('¡Salta y avanza!');
        startButton.textContent = 'Reiniciar Juego';
        requestAnimationFrame(gameLoop); // Start game loop
    } else {
        // If game is already running, reset
        gameRunning = false;
        // Reset player position and state
        player.x = TILE_SIZE * 2;
        player.y = canvas.height - TILE_SIZE - PLAYER_HEIGHT;
        player.dx = 0;
        player.dy = 0;
        player.isOnGround = true;
        player.isJumping = false; // Player starts on the ground, not jumping
        cameraX = 0; // Reset camera position

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
    const aspectRatio = 800 / 400; // Original canvas aspect ratio (width/height)

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
