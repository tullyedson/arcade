class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        
        this.snake = [{x: 10, y: 10}];
        this.food = this.generateFood();
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameOver = false;
        
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
                case 'ArrowUp':
                    if (this.dy !== 1) {
                        this.dx = 0;
                        this.dy = -1;
                    }
                    break;
                case 'ArrowDown':
                    if (this.dy !== -1) {
                        this.dx = 0;
                        this.dy = 1;
                    }
                    break;
                case 'ArrowLeft':
                    if (this.dx !== 1) {
                        this.dx = -1;
                        this.dy = 0;
                    }
                    break;
                case 'ArrowRight':
                    if (this.dx !== -1) {
                        this.dx = 1;
                        this.dy = 0;
                    }
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
        message.textContent = 'Use arrow keys to control the snake';
        button.textContent = 'START GAME';
        button.style.display = 'block';
        overlay.classList.remove('hidden');
    }
    
    showGameOverScreen() {
        const overlay = document.getElementById('gameOverlay');
        const title = document.getElementById('overlayTitle');
        const message = document.getElementById('overlayMessage');
        const button = document.getElementById('startButton');
        
        title.textContent = 'GAME OVER';
        message.textContent = `Final Score: ${this.score}`;
        button.textContent = 'PLAY AGAIN';
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
        this.snake = [{x: 10, y: 10}];
        this.food = this.generateFood();
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.gameRunning = true;
        this.gamePaused = false;
        this.gameOver = false;
        
        this.updateScore();
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
    
    generateFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (this.snake.some(segment => segment.x === food.x && segment.y === food.y));
        return food;
    }
    
    updateScore() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('highScore').textContent = this.highScore;
    }
    
    gameLoop() {
        if (!this.gameRunning || this.gamePaused) return;
        
        this.update();
        this.draw();
        
        if (!this.gameOver) {
            setTimeout(() => this.gameLoop(), 150);
        }
    }
    
    update() {
        if (this.dx === 0 && this.dy === 0) return;
        
        const head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        
        // Check wall collision
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            this.endGame();
            return;
        }
        
        // Check self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.endGame();
            return;
        }
        
        this.snake.unshift(head);
        
        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.updateScore();
            this.food = this.generateFood();
        } else {
            this.snake.pop();
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw snake
        this.ctx.fillStyle = '#00ff00';
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // Head
                this.ctx.fillStyle = '#00ff00';
                this.ctx.fillRect(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize, this.gridSize);
                this.ctx.strokeStyle = '#000';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize, this.gridSize);
            } else {
                // Body
                this.ctx.fillStyle = '#00cc00';
                this.ctx.fillRect(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize, this.gridSize);
            }
        });
        
        // Draw food
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(this.food.x * this.gridSize, this.food.y * this.gridSize, this.gridSize, this.gridSize);
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.food.x * this.gridSize, this.food.y * this.gridSize, this.gridSize, this.gridSize);
        
        // Draw grid
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= this.tileCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }
    }
    
    endGame() {
        this.gameRunning = false;
        this.gameOver = true;
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
            this.updateScore();
        }
        
        this.showGameOverScreen();
    }
    
    returnToArcade() {
        window.location.href = '../index.html';
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new SnakeGame();
}); 