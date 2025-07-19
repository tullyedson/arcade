class PacmanGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.tileSize = 20;
        this.cols = 20;
        this.rows = 20;
        
        // Game state
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameRunning = false;
        this.gamePaused = false;
        
        // Maze layout (0=empty, 1=wall, 2=dot, 3=power pellet)
        this.maze = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,2,1,1,1,2,1,1,2,1,1,1,2,1,1,2,1],
            [1,3,1,1,2,1,1,1,2,1,1,2,1,1,1,2,1,1,3,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,2,1,2,1,1,1,1,1,1,2,1,2,1,1,2,1],
            [1,2,2,2,2,1,2,2,2,1,1,2,2,2,1,2,2,2,2,1],
            [1,1,1,1,2,1,1,1,0,1,1,0,1,1,1,2,1,1,1,1],
            [0,0,0,1,2,1,0,0,0,0,0,0,0,0,1,2,1,0,0,0],
            [1,1,1,1,2,1,0,1,1,0,0,1,1,0,1,2,1,1,1,1],
            [0,0,0,0,2,0,0,1,0,0,0,0,1,0,0,2,0,0,0,0],
            [1,1,1,1,2,1,0,1,1,1,1,1,1,0,1,2,1,1,1,1],
            [0,0,0,1,2,1,0,0,0,0,0,0,0,0,1,2,1,0,0,0],
            [1,1,1,1,2,1,0,1,1,1,1,1,1,0,1,2,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,2,1,1,1,2,1,1,2,1,1,1,2,1,1,2,1],
            [1,2,2,1,2,2,2,2,2,0,0,2,2,2,2,2,1,2,2,1],
            [1,1,2,1,2,1,2,1,1,1,1,1,1,2,1,2,1,2,1,1],
            [1,3,2,2,2,1,2,2,2,1,1,2,2,2,1,2,2,2,3,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];
        
        // Pac-Man
        this.pacman = {
            x: 10,
            y: 15,
            direction: 0, // 0=right, 1=down, 2=left, 3=up
            nextDirection: 0,
            mouthAngle: 0,
            mouthOpen: true
        };
        
        // Ghosts
        this.ghosts = [
            { x: 9, y: 9, direction: 0, color: '#ff0000', mode: 'chase' },
            { x: 10, y: 9, direction: 0, color: '#ffb8ff', mode: 'chase' },
            { x: 11, y: 9, direction: 0, color: '#00ffff', mode: 'chase' },
            { x: 12, y: 9, direction: 0, color: '#ffb852', mode: 'chase' }
        ];
        
        this.powerMode = false;
        this.powerModeTime = 0;
        this.dotCount = 0;
        this.totalDots = 0;
        
        this.countDots();
        this.init();
    }
    
    init() {
        this.updateScore();
        this.setupEventListeners();
        this.showStartScreen();
    }
    
    countDots() {
        this.totalDots = 0;
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.maze[y][x] === 2 || this.maze[y][x] === 3) {
                    this.totalDots++;
                }
            }
        }
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
                    this.pacman.nextDirection = 3;
                    break;
                case 'ArrowDown':
                    this.pacman.nextDirection = 1;
                    break;
                case 'ArrowLeft':
                    this.pacman.nextDirection = 2;
                    break;
                case 'ArrowRight':
                    this.pacman.nextDirection = 0;
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
        message.textContent = 'Use arrow keys to move Pac-Man';
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
    
    hideOverlay() {
        document.getElementById('gameOverlay').classList.add('hidden');
    }
    
    startGame() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.powerMode = false;
        this.powerModeTime = 0;
        this.dotCount = 0;
        
        // Reset maze
        this.resetMaze();
        
        // Reset Pac-Man
        this.pacman.x = 10;
        this.pacman.y = 15;
        this.pacman.direction = 0;
        this.pacman.nextDirection = 0;
        
        // Reset ghosts
        this.ghosts = [
            { x: 9, y: 9, direction: 0, color: '#ff0000', mode: 'chase' },
            { x: 10, y: 9, direction: 0, color: '#ffb8ff', mode: 'chase' },
            { x: 11, y: 9, direction: 0, color: '#00ffff', mode: 'chase' },
            { x: 12, y: 9, direction: 0, color: '#ffb852', mode: 'chase' }
        ];
        
        this.updateScore();
        this.gameRunning = true;
        this.gamePaused = false;
        
        this.hideOverlay();
        this.gameLoop();
    }
    
    resetMaze() {
        // Reset dots and power pellets
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.maze[y][x] === 0) {
                    this.maze[y][x] = 2; // Restore dots
                }
            }
        }
        // Restore power pellets
        this.maze[3][1] = 3;
        this.maze[3][18] = 3;
        this.maze[18][1] = 3;
        this.maze[18][18] = 3;
    }
    
    togglePause() {
        this.gamePaused = !this.gamePaused;
        if (!this.gamePaused) {
            this.gameLoop();
        }
    }
    
    updateScore() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('level').textContent = this.level;
    }
    
    gameLoop() {
        if (!this.gameRunning || this.gamePaused) return;
        
        this.update();
        this.draw();
        
        setTimeout(() => this.gameLoop(), 150);
    }
    
    update() {
        this.updatePacman();
        this.updateGhosts();
        this.checkCollisions();
        this.updatePowerMode();
        
        // Check if level is complete
        if (this.dotCount >= this.totalDots) {
            this.nextLevel();
        }
    }
    
    updatePacman() {
        // Try to change direction
        if (this.canMove(this.pacman.x, this.pacman.y, this.pacman.nextDirection)) {
            this.pacman.direction = this.pacman.nextDirection;
        }
        
        // Move in current direction
        if (this.canMove(this.pacman.x, this.pacman.y, this.pacman.direction)) {
            const newX = this.pacman.x + this.getDirectionX(this.pacman.direction);
            const newY = this.pacman.y + this.getDirectionY(this.pacman.direction);
            
            // Wrap around tunnel
            if (newX < 0) {
                this.pacman.x = this.cols - 1;
            } else if (newX >= this.cols) {
                this.pacman.x = 0;
            } else {
                this.pacman.x = newX;
                this.pacman.y = newY;
            }
            
            // Collect dots
            if (this.maze[this.pacman.y][this.pacman.x] === 2) {
                this.maze[this.pacman.y][this.pacman.x] = 0;
                this.score += 10;
                this.dotCount++;
                this.updateScore();
            } else if (this.maze[this.pacman.y][this.pacman.x] === 3) {
                this.maze[this.pacman.y][this.pacman.x] = 0;
                this.score += 50;
                this.dotCount++;
                this.powerMode = true;
                this.powerModeTime = 200;
                this.updateScore();
            }
        }
        
        // Animate mouth
        this.pacman.mouthAngle += 0.3;
        if (this.pacman.mouthAngle >= Math.PI) {
            this.pacman.mouthAngle = 0;
            this.pacman.mouthOpen = !this.pacman.mouthOpen;
        }
    }
    
    updateGhosts() {
        this.ghosts.forEach(ghost => {
            // Simple AI: move towards Pac-Man
            const dx = this.pacman.x - ghost.x;
            const dy = this.pacman.y - ghost.y;
            
            let targetDirection = ghost.direction;
            
            if (Math.abs(dx) > Math.abs(dy)) {
                targetDirection = dx > 0 ? 0 : 2; // Right or Left
            } else {
                targetDirection = dy > 0 ? 1 : 3; // Down or Up
            }
            
            // Try to move in target direction, otherwise random
            if (this.canMove(ghost.x, ghost.y, targetDirection)) {
                ghost.direction = targetDirection;
            } else if (Math.random() < 0.3) {
                // Random direction change
                const directions = [0, 1, 2, 3];
                const validDirections = directions.filter(dir => 
                    this.canMove(ghost.x, ghost.y, dir)
                );
                if (validDirections.length > 0) {
                    ghost.direction = validDirections[Math.floor(Math.random() * validDirections.length)];
                }
            }
            
            // Move ghost
            if (this.canMove(ghost.x, ghost.y, ghost.direction)) {
                const newX = ghost.x + this.getDirectionX(ghost.direction);
                const newY = ghost.y + this.getDirectionY(ghost.direction);
                
                // Wrap around tunnel
                if (newX < 0) {
                    ghost.x = this.cols - 1;
                } else if (newX >= this.cols) {
                    ghost.x = 0;
                } else {
                    ghost.x = newX;
                    ghost.y = newY;
                }
            }
        });
    }
    
    checkCollisions() {
        this.ghosts.forEach(ghost => {
            if (Math.abs(ghost.x - this.pacman.x) < 0.5 && Math.abs(ghost.y - this.pacman.y) < 0.5) {
                if (this.powerMode) {
                    // Ghost eaten
                    ghost.x = 10;
                    ghost.y = 9;
                    this.score += 200;
                    this.updateScore();
                } else {
                    // Pac-Man eaten
                    this.lives--;
                    this.updateScore();
                    
                    if (this.lives <= 0) {
                        this.gameOver();
                        return;
                    }
                    
                    // Reset positions
                    this.pacman.x = 10;
                    this.pacman.y = 15;
                    this.ghosts.forEach((g, i) => {
                        g.x = 9 + i;
                        g.y = 9;
                    });
                }
            }
        });
    }
    
    updatePowerMode() {
        if (this.powerMode) {
            this.powerModeTime--;
            if (this.powerModeTime <= 0) {
                this.powerMode = false;
            }
        }
    }
    
    nextLevel() {
        this.level++;
        this.dotCount = 0;
        this.resetMaze();
        this.countDots();
        this.updateScore();
    }
    
    canMove(x, y, direction) {
        const newX = x + this.getDirectionX(direction);
        const newY = y + this.getDirectionY(direction);
        
        // Check bounds
        if (newX < 0 || newX >= this.cols || newY < 0 || newY >= this.rows) {
            return false;
        }
        
        // Check wall
        return this.maze[newY][newX] !== 1;
    }
    
    getDirectionX(direction) {
        return direction === 0 ? 1 : direction === 2 ? -1 : 0;
    }
    
    getDirectionY(direction) {
        return direction === 1 ? 1 : direction === 3 ? -1 : 0;
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw maze
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const tile = this.maze[y][x];
                if (tile === 1) {
                    // Wall
                    this.ctx.fillStyle = '#0000ff';
                    this.ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
                } else if (tile === 2) {
                    // Dot
                    this.ctx.fillStyle = '#ffff00';
                    this.ctx.beginPath();
                    this.ctx.arc(x * this.tileSize + this.tileSize/2, y * this.tileSize + this.tileSize/2, 2, 0, Math.PI * 2);
                    this.ctx.fill();
                } else if (tile === 3) {
                    // Power pellet
                    this.ctx.fillStyle = '#ffff00';
                    this.ctx.beginPath();
                    this.ctx.arc(x * this.tileSize + this.tileSize/2, y * this.tileSize + this.tileSize/2, 6, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        }
        
        // Draw Pac-Man
        this.drawPacman();
        
        // Draw ghosts
        this.ghosts.forEach(ghost => this.drawGhost(ghost));
    }
    
    drawPacman() {
        this.ctx.save();
        this.ctx.translate(this.pacman.x * this.tileSize + this.tileSize/2, this.pacman.y * this.tileSize + this.tileSize/2);
        this.ctx.rotate(this.pacman.direction * Math.PI/2);
        
        this.ctx.fillStyle = '#ffff00';
        this.ctx.beginPath();
        
        if (this.pacman.mouthOpen) {
            this.ctx.arc(0, 0, this.tileSize/2, this.pacman.mouthAngle, Math.PI * 2 - this.pacman.mouthAngle);
        } else {
            this.ctx.arc(0, 0, this.tileSize/2, 0, Math.PI * 2);
        }
        
        this.ctx.lineTo(0, 0);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    drawGhost(ghost) {
        const x = ghost.x * this.tileSize + this.tileSize/2;
        const y = ghost.y * this.tileSize + this.tileSize/2;
        const radius = this.tileSize/2;
        
        this.ctx.fillStyle = this.powerMode ? '#0000ff' : ghost.color;
        this.ctx.beginPath();
        this.ctx.arc(x, y - radius/2, radius, Math.PI, 0);
        this.ctx.rect(x - radius, y - radius/2, radius * 2, radius);
        this.ctx.arc(x, y + radius/2, radius, 0, Math.PI);
        this.ctx.fill();
        
        // Eyes
        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.arc(x - radius/3, y - radius/3, radius/4, 0, Math.PI * 2);
        this.ctx.arc(x + radius/3, y - radius/3, radius/4, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(x - radius/3, y - radius/3, radius/8, 0, Math.PI * 2);
        this.ctx.arc(x + radius/3, y - radius/3, radius/8, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    gameOver() {
        this.gameRunning = false;
        this.showGameOverScreen();
    }
    
    returnToArcade() {
        window.location.href = '../index.html';
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new PacmanGame();
}); 