const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const backgroundMusic = document.getElementById('backgroundMusic');

canvas.width = 800;
canvas.height = 600;

const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;
const playerSpeed = 8;
const opponentSpeed = 6;
const opponentSlowSpeed = 3;  // Slower speed for the opponent paddle
let ballSpeed = 5; // Initial speed of the ball
let playerScore = 0;
let opponentScore = 0;
let elapsedTime = 0; // Timer variable

let player = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0
};

let opponent = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: opponentSpeed
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: ballSize,
    height: ballSize,
    dx: ballSpeed * (Math.random() > 0.5 ? 1 : -1),
    dy: ballSpeed * (Math.random() > 0.5 ? 1 : -1)
};

function drawRect(x, y, width, height) {
    context.fillStyle = 'white';
    context.fillRect(x, y, width, height);
}

function drawBall(x, y, size) {
    context.fillStyle = 'red';
    context.beginPath();
    context.arc(x, y, size, 0, Math.PI * 2);
    context.fill();
}

function drawText(text, x, y) {
    context.fillStyle = 'white';
    context.font = '35px Arial';
    context.fillText(text, x, y);
}

function movePaddle(paddle) {
    paddle.y += paddle.dy;
    if (paddle.y < 0) {
        paddle.y = 0;
    } else if (paddle.y + paddle.height > canvas.height) {
        paddle.y = canvas.height - paddle.height;
    }
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y < 0 || ball.y + ball.height > canvas.height) {
        ball.dy *= -1;
    }

    if (ball.x < 0) {
        playerScore++;
        resetBall();
    } else if (ball.x + ball.width > canvas.width) {
        opponentScore++;
        resetBall();
    }

    if (collision(ball, player)) {
        ball.dx *= -1;
        ball.x = player.x - ball.width;
    } else if (collision(ball, opponent)) {
        ball.dx *= -1;
        ball.x = opponent.x + opponent.width;
    }
}

function collision(ball, paddle) {
    return ball.x < paddle.x + paddle.width &&
           ball.x + ball.width > paddle.x &&
           ball.y < paddle.y + paddle.height &&
           ball.y + ball.height > paddle.y;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx *= -1;
    ball.dy = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
}

function opponentAI() {
    let rand = Math.random();

    if (rand < 0.25) {
        // 25% chance to miss
        opponent.dy = 0;
    } else if (rand < 0.50) {
        // 25% chance to move slower
        if (opponent.y + opponent.height / 2 < ball.y) {
            opponent.dy = opponentSlowSpeed;
        } else if (opponent.y + opponent.height / 2 > ball.y) {
            opponent.dy = -opponentSlowSpeed;
        } else {
            opponent.dy = 0;
        }
    } else {
        // 50% chance to move normally
        if (opponent.y + opponent.height / 2 < ball.y) {
            opponent.dy = opponentSpeed;
        } else if (opponent.y + opponent.height / 2 > ball.y) {
            opponent.dy = -opponentSpeed;
        } else {
            opponent.dy = 0;
        }
    }

    movePaddle(opponent);
}

function update() {
    movePaddle(player);
    opponentAI();
    moveBall();
    elapsedTime += 1 / 60; // Increase elapsed time by 1 second (assuming 60 FPS)
    if (elapsedTime >= 20) { // If 20 seconds have passed
        ballSpeed *= 1.5; // Increase ball speed by 1.5 times
        resetBall(); // Reset the ball to apply the new speed
        elapsedTime = 0; // Reset timer
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawRect(player.x, player.y, player.width, player.height);
    drawRect(opponent.x, opponent.y, opponent.width, opponent.height);
    drawBall(ball.x, ball.y, ballSize / 2);
    drawText(playerScore, canvas.width / 2 + 50, 50);
    drawText(opponentScore, canvas.width / 2 - 100, 50);
    drawText(Math.floor(elapsedTime), canvas.width - 100, 50); // Draw timer
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

window.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowUp') {
        player.dy = -playerSpeed;
    } else if (e.key === 'ArrowDown') {
        player.dy = playerSpeed;
    }
});

window.addEventListener('keyup', function(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        player.dy = 0;
    }
});

document.getElementById('startButton').addEventListener('click', function() {
    console.log('Start button clicked!'); // Debug message
    document.getElementById('introScreen').style.display = 'none';
    canvas.style.display = 'block';
    backgroundMusic.play();
    loop();
});