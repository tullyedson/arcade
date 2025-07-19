class PongGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game objects
        this.ball = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            radius: 8,
            dx: 4,
            dy: 4
        };
        
        this.playerPaddle = {
            x: 20,
            y: this.canvas.height / 2 - 50,
            width: 10,
            height: 100,
            speed: 5
        };
        
        this.computerPaddle = {
            x: this.canvas.width - 30,
            y: this.canvas.height / 2 - 50,
            width: 10,
            height: 100,
            speed: 4
        };
        
        // Game state
        this.playerScore = 0;
        this.computerScore = 0;
        this.gameRunning = false;
        this.gamePaused = false;
        
        this.init();
    }
    
    init() {
        this.updateScore();
        this.setupEventListeners();
        this.showStartScreen();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape') {
                this.returnToArcade();
                return;
            }
            
            if (!this.gameRunning) return;
            
            switch(e.code) {
                case 'KeyW':
                    this.playerPaddle.y -= this.playerPaddle.speed;
                    break;
                case 'KeyS':
                    this.playerPaddle.y += this.playerPaddle.speed;
                    break;
                case 'Space':
                    e.preventDefault();
                    this.togglePause();
                    break;
            }
        });
        
        document.getElementById('startButton').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('backButton').addEventListener('click', () => {
            this.returnToArcade();
        });
    }
    
    showStartScreen() {
        const overlay = document.getElementById('gameOverlay');
        const title = document.getElementById('overlayTitle');
        const message = document.getElementById('overlayMessage');
        const button = document.getElementById('startButton');
        
        title.textContent = 'Press SPACE to Start';
        message.textContent = 'Use W/S keys to move your paddle';
        button.textContent = 'START GAME';
        button.style.display = 'block';
        overlay.classList.remove('hidden');
    }
    
    showPauseScreen() {
        const overlay = document.getElementById('gameOverlay');
        const title = document.getElementById('overlayTitle');
        const message = document.getElementById('overlayMessage');
        const button = document.getElementById('startButton');
        
        title.textContent = 'PAUSED';
        message.textContent = 'Press SPACE to resume';
        button.textContent = 'RESUME';
        button.style.display = 'none';
        overlay.classList.remove('hidden');
    }
    
    hideOverlay() {
        document.getElementById('gameOverlay').classList.add('hidden');
    }
    
    startGame() {
        this.resetBall();
        this.gameRunning = true;
        this.gamePaused = false;
        
        this.hideOverlay();
        this.gameLoop();
    }
    
    togglePause() {
        if (this.gamePaused) {
            this.gamePaused = false;
            this.hideOverlay();
            this.gameLoop();
        } else {
            this.gamePaused = true;
            this.showPauseScreen();
        }
    }
    
    resetBall() {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height / 2;
        this.ball.dx = (Math.random() > 0.5 ? 1 : -1) * 4;
        this.ball.dy = (Math.random() > 0.5 ? 1 : -1) * 4;
    }
    
    updateScore() {
        document.getElementById('playerScore').textContent = this.playerScore;
        document.getElementById('computerScore').textContent = this.computerScore;
    }
    
    gameLoop() {
        if (!this.gameRunning || this.gamePaused) return;
        
        this.update();
        this.draw();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        // Update ball position
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
        
        // Ball collision with top and bottom
        if (this.ball.y <= this.ball.radius || this.ball.y >= this.canvas.height - this.ball.radius) {
            this.ball.dy = -this.ball.dy;
        }
        
        // Ball collision with paddles
        if (this.ball.x <= this.playerPaddle.x + this.playerPaddle.width &&
            this.ball.y >= this.playerPaddle.y &&
            this.ball.y <= this.playerPaddle.y + this.playerPaddle.height &&
            this.ball.dx < 0) {
            this.ball.dx = -this.ball.dx;
            this.ball.dx *= 1.1; // Increase speed slightly
        }
        
        if (this.ball.x >= this.computerPaddle.x - this.ball.radius &&
            this.ball.y >= this.computerPaddle.y &&
            this.ball.y <= this.computerPaddle.y + this.computerPaddle.height &&
            this.ball.dx > 0) {
            this.ball.dx = -this.ball.dx;
            this.ball.dx *= 1.1; // Increase speed slightly
        }
        
        // Ball out of bounds
        if (this.ball.x <= 0) {
            this.computerScore++;
            this.updateScore();
            this.resetBall();
        } else if (this.ball.x >= this.canvas.width) {
            this.playerScore++;
            this.updateScore();
            this.resetBall();
        }
        
        // Keep paddles in bounds
        this.playerPaddle.y = Math.max(0, Math.min(this.canvas.height - this.playerPaddle.height, this.playerPaddle.y));
        this.computerPaddle.y = Math.max(0, Math.min(this.canvas.height - this.computerPaddle.height, this.computerPaddle.y));
        
        // AI for computer paddle
        if (this.ball.y < this.computerPaddle.y + this.computerPaddle.height / 2) {
            this.computerPaddle.y -= this.computerPaddle.speed;
        } else {
            this.computerPaddle.y += this.computerPaddle.speed;
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw center line
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.setLineDash([10, 10]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // Draw ball
        this.ctx.fillStyle = '#00ff00';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw player paddle
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(this.playerPaddle.x, this.playerPaddle.y, this.playerPaddle.width, this.playerPaddle.height);
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.playerPaddle.x, this.playerPaddle.y, this.playerPaddle.width, this.playerPaddle.height);
        
        // Draw computer paddle
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(this.computerPaddle.x, this.computerPaddle.y, this.computerPaddle.width, this.computerPaddle.height);
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.computerPaddle.x, this.computerPaddle.y, this.computerPaddle.width, this.computerPaddle.height);
    }
    
    returnToArcade() {
        window.location.href = '../index.html';
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new PongGame();
}); 