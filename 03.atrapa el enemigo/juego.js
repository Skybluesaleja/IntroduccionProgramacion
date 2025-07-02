 const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: 50,
    y: 50,
    size: 30,
    color:'blue',
    speed: 10
};

const enemy = {
    x: 300,
    y: 300,
    size: 30,
    color:'red',
    dx: 2,
    dy: 2
};

const enemy2 = {
    x: 150,
    y: 150,
    size: 30,
    color: 'green',
    dx: 3,
    dy: 2
};

const enemy3 = {
    x: 400,
    y: 200,
    size: 30,
    color: 'black',
    dx: 3,
    dy: 2
};

let score = 0;
let lives = 3;
let gameOver = false;

function drawBox(x, y, size, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
}

function clearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw() {
clearCanvas();
drawBox(player.x,player.y, player.size, player.color);
drawBox(enemy.x, enemy.y, enemy.size, enemy.color);
drawBox(enemy2.x, enemy2.y, enemy2.size, enemy2.color);
drawBox(enemy3.x, enemy3.y, enemy3.size, enemy3.color);
}

function updateEnemy(){
    enemy.x += enemy.dx;
    enemy.y += enemy.dy;

if (enemy.x <= 0 || enemy.x + enemy.size >= canvas.width){
    enemy.dx *= -1;
}
if (enemy.y <= 0 || enemy.y + enemy.size >= canvas.height){
    enemy.dy *= -1;
}

}

function updateEnemy2(){
    enemy2.x += enemy2.dx;
    enemy2.y += enemy2.dy;

    if (enemy2.x <= 0 || enemy2.x + enemy2.size >= canvas.width){
        enemy2.dx *= -1;
    }
    if (enemy2.y <= 0 || enemy2.y + enemy2.size >= canvas.height){
        enemy2.dy *= -1;
    }
}

function updateEnemy3(){
    enemy3.x += enemy3.dx;
    enemy3.y += enemy3.dy;

    if (enemy3.x <= 0 || enemy3.x + enemy3.size >= canvas.width){
        enemy3.dx *= -1;
    }
    if (enemy3.y <= 0 || enemy3.y + enemy3.size >= canvas.height){
        enemy3.dy *= -1;
    }
}

function checkCollision() {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < player.size) {
        score++;
        document.getElementById('score').textContent = score;
        enemy.x = Math.random() * (canvas.width - enemy.size);
        enemy.y = Math.random() * (canvas.height - enemy.size);
        enemy.dx *= 1.05;
        enemy.dy *= 1.05;
    }

    const dx2 = player.x - enemy2.x;
    const dy2 = player.y - enemy2.y;
    const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

    if (distance2 < player.size) {
        score++;
        document.getElementById('score').textContent = score;
        enemy2.x = Math.random() * (canvas.width - enemy2.size);
        enemy2.y = Math.random() * (canvas.height - enemy2.size);
        enemy2.dx *= 1.05;
        enemy2.dy *= 1.05;
    }

    const dx3 = player.x - enemy3.x;
    const dy3 = player.y - enemy3.y;
    const distance3 = Math.sqrt(dx3 * dx3 + dy3 * dy3);

    if (distance3 < player.size) {
        loselife();
        player.x = canvas.width / 2;
        player.y = canvas.height / 2;
    }
}


function loselife(){
    lives--;
    document.getElementById('lives').textContent = lives;
    if (lives <= 0){
        document.getElementById('game-over').style.display = 'block';
        gameOver = true;
        setTimeout(resetGame, 3000);
    }
}

function update() {
    if (gameOver) return;

    draw();
    updateEnemy();
    updateEnemy2();
    updateEnemy3();

    checkCollision();

    if (
        player.x < 0 || player.x + player.size > canvas.width || 
        player.y < 0 || player.y + player.size > canvas.height){
        loselife();
        player.x = canvas.width / 2;
        player.y = canvas.height / 2;
    }

    requestAnimationFrame(update);
}

document.addEventListener('keydown', (e) => {
    if (gameOver) return;

    switch (e.key) {
        case 'ArrowUp': player.y -=player.speed; break;
        case 'ArrowDown': player.y +=player.speed; break;
        case 'ArrowLeft': player.x -=player.speed; break;
        case 'ArrowRight': player.x +=player.speed; break;
    }
});

function resetGame() {
    score = 0;
    lives = 3;
    player.x = 50;
    player.y = 50;

    enemy.x = 300;
    enemy.y = 300;
    enemy.dx = 2;
    enemy.dy = 2;

    enemy2.x = 150;
    enemy2.y = 150;
    enemy2.dx = 3;
    enemy2.dy = 2;

    enemy3.x = 400;
    enemy3.y = 200;
    enemy3.dx = 3;
    enemy3.dy = 2;

    gameOver = false;
    document.getElementById('score').textContent = score;
    document.getElementById('lives').textContent = lives;
    document.getElementById('game-over').style.display = 'none';

    update();
}


update();