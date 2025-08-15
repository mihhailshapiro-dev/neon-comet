const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
let keys = {};
let touchX = null;

// Игрок
let player = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    vy: 0,
    width: 40,
    height: 40,
    tail: []
};

// Платформы
let platforms = [];
let score = 0;

// Изображения
const cometImg = new Image();
cometImg.src = 'assets/comet.png';

// Музыка
const bgMusic = document.getElementById('bgMusic');
document.getElementById('muteBtn').addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play();
        muteBtn.textContent = '🔊';
    } else {
        bgMusic.pause();
        muteBtn.textContent = '🔇';
    }
});

// Управление с клавиатуры (ПК)
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

// Управление на телефоне — невидимые зоны
if (isMobile) {
    canvas.addEventListener('touchstart', (e) => {
        touchX = e.touches[0].clientX;
        if (touchX < window.innerWidth / 2) {
            keys['ArrowLeft'] = true;
        } else {
            keys['ArrowRight'] = true;
        }
    });

    canvas.addEventListener('touchend', () => {
        keys['ArrowLeft'] = false;
        keys['ArrowRight'] = false;
    });
}

// Создание платформ
function createPlatforms() {
    platforms = [];
    for (let i = 0; i < 10; i++) {
        platforms.push({
            x: Math.random() * (canvas.width - 100),
            y: canvas.height - i * 100,
            width: 100,
            height: 20
        });
    }
}
createPlatforms();

// Хвост
function drawTail() {
    for (let i = 0; i < player.tail.length; i++) {
        let t = player.tail[i];
        let alpha = 1 - i / player.tail.length;
        let grad = ctx.createLinearGradient(t.x, t.y, t.x + player.width, t.y + player.height);
        grad.addColorStop(0, `rgba(255, 20, 147, ${alpha})`);
        grad.addColorStop(0.5, `rgba(138, 43, 226, ${alpha})`);
        grad.addColorStop(1, `rgba(0, 191, 255, ${alpha})`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(t.x, t.y, player.width / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Рендер счёта
function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 20, 40);
}

// Игровой цикл
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Хвост
    player.tail.unshift({x: player.x + player.width/2, y: player.y + player.height/2});
    if (player.tail.length > 20) player.tail.pop();
    drawTail();

    // Игрок
    ctx.drawImage(cometImg, player.x, player.y, player.width, player.height);

    // Физика
    player.vy += 0.5;
    player.y += player.vy;

    if (keys['ArrowLeft']) player.x -= 5;
    if (keys['ArrowRight']) player.x += 5;

    // Платформы
    ctx.fillStyle = 'yellow';
    platforms.forEach(p => {
        ctx.fillRect(p.x, p.y, p.width, p.height);
        if (player.vy > 0 &&
            player.x + player.width > p.x &&
            player.x < p.x + p.width &&
            player.y + player.height > p.y &&
            player.y + player.height < p.y + p.height) {
            player.vy = -10;
            score += 100; // +100 за прыжок
        }
    });

    // Счёт
    drawScore();

    requestAnimationFrame(gameLoop);
}
gameLoop();

