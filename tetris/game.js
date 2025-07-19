class TetrisGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('nextCanvas');
        this.nextCtx = this.nextCanvas.getContext('2d');
        this.holdCanvas = document.getElementById('holdCanvas');
        this.holdCtx = this.holdCanvas.getContext('2d');
        
        this.blockSize = 30;
        this.cols = 10;
        this.rows = 20;
        this.board = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        
        // Tetromino shapes
        this.shapes = {
            I: [[1, 1, 1, 1]],
            O: [[1, 1], [1, 1]],
            T: [[0, 1, 0], [1, 1, 1]],
            S: [[0, 1, 1], [1, 1, 0]],
            Z: [[1, 1, 0], [0, 1, 1]],
            J: [[1, 0, 0], [1, 1, 1]],
            L: [[0, 0, 1], [1, 1, 1]]
        };
        
        this.colors = {
            I: '#00ffff',
            O: '#ffff00',
            T: '#800080',
            S: '#00ff00',
            Z: '#ff0000',
            J: '#0000ff',
            L: '#ffa500'
        };
        
        this.currentPiece = null;
        this.nextPiece = null;
        this.heldPiece = null;
        this.canHold = true;
        
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.dropTime = 0;
        this.dropInterval = 1000;
        
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
                case 'ArrowLeft':
                    this.movePiece(-1, 0);
                    break;
                case 'ArrowRight':
                    this.movePiece(1, 0);
                    break;
                case 'ArrowDown':
                    this.movePiece(0, 1);
                    break;
                case 'ArrowUp':
                    this.rotatePiece();
                    break;
                case 'Space':
                    e.preventDefault();
                    this.hardDrop();
                    break;
                case 'KeyC':
                    this.holdPiece();
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
        message.textContent = 'Use arrow keys to move and rotate pieces';
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
        this.board = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.dropInterval = 1000;
        this.heldPiece = null;
        this.canHold = true;
        
        this.updateScore();
        this.generateNewPiece();
        this.gameRunning = true;
        this.gamePaused = false;
        
        this.hideOverlay();
        this.gameLoop();
    }
    
    generateNewPiece() {
        const pieces = Object.keys(this.shapes);
        if (!this.nextPiece) {
            this.nextPiece = pieces[Math.floor(Math.random() * pieces.length)];
        }
        
        this.currentPiece = {
            shape: this.shapes[this.nextPiece],
            color: this.colors[this.nextPiece],
            x: Math.floor(this.cols / 2) - Math.floor(this.shapes[this.nextPiece][0].length / 2),
            y: 0
        };
        
        this.nextPiece = pieces[Math.floor(Math.random() * pieces.length)];
        this.canHold = true;
        
        this.drawNextPiece();
        this.drawHoldPiece();
        
        if (this.checkCollision()) {
            this.gameOver();
        }
    }
    
    movePiece(dx, dy) {
        this.currentPiece.x += dx;
        this.currentPiece.y += dy;
        
        if (this.checkCollision()) {
            this.currentPiece.x -= dx;
            this.currentPiece.y -= dy;
            
            if (dy > 0) {
                this.placePiece();
                this.clearLines();
                this.generateNewPiece();
            }
            return false;
        }
        return true;
    }
    
    rotatePiece() {
        const rotated = this.rotateMatrix(this.currentPiece.shape);
        const originalShape = this.currentPiece.shape;
        this.currentPiece.shape = rotated;
        
        if (this.checkCollision()) {
            this.currentPiece.shape = originalShape;
        }
    }
    
    rotateMatrix(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        const rotated = Array(cols).fill().map(() => Array(rows).fill(0));
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                rotated[j][rows - 1 - i] = matrix[i][j];
            }
        }
        return rotated;
    }
    
    hardDrop() {
        while (this.movePiece(0, 1)) {
            this.score += 2;
        }
        this.updateScore();
    }
    
    holdPiece() {
        if (!this.canHold) return;
        
        if (this.heldPiece) {
            const temp = this.heldPiece;
            this.heldPiece = this.currentPiece.shape;
            this.currentPiece.shape = this.shapes[temp];
            this.currentPiece.color = this.colors[temp];
            this.currentPiece.x = Math.floor(this.cols / 2) - Math.floor(this.shapes[temp][0].length / 2);
            this.currentPiece.y = 0;
        } else {
            this.heldPiece = Object.keys(this.shapes).find(key => this.shapes[key] === this.currentPiece.shape);
            this.generateNewPiece();
        }
        
        this.canHold = false;
        this.drawHoldPiece();
    }
    
    checkCollision() {
        for (let y = 0; y < this.currentPiece.shape.length; y++) {
            for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                if (this.currentPiece.shape[y][x]) {
                    const boardX = this.currentPiece.x + x;
                    const boardY = this.currentPiece.y + y;
                    
                    if (boardX < 0 || boardX >= this.cols || 
                        boardY >= this.rows || 
                        (boardY >= 0 && this.board[boardY][boardX])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    placePiece() {
        for (let y = 0; y < this.currentPiece.shape.length; y++) {
            for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                if (this.currentPiece.shape[y][x]) {
                    const boardX = this.currentPiece.x + x;
                    const boardY = this.currentPiece.y + y;
                    if (boardY >= 0) {
                        this.board[boardY][boardX] = this.currentPiece.color;
                    }
                }
            }
        }
    }
    
    clearLines() {
        let linesCleared = 0;
        
        for (let y = this.rows - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                this.board.splice(y, 1);
                this.board.unshift(Array(this.cols).fill(0));
                linesCleared++;
                y++; // Check the same line again
            }
        }
        
        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.score += linesCleared * 100 * this.level;
            this.level = Math.floor(this.lines / 10) + 1;
            this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
            this.updateScore();
        }
    }
    
    updateScore() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lines').textContent = this.lines;
        document.getElementById('level').textContent = this.level;
    }
    
    gameLoop() {
        if (!this.gameRunning) return;
        
        this.update();
        this.draw();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        this.dropTime += 16; // Assuming 60 FPS
        
        if (this.dropTime >= this.dropInterval) {
            this.movePiece(0, 1);
            this.dropTime = 0;
        }
    }
    
    draw() {
        // Clear main canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw board
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.board[y][x]) {
                    this.drawBlock(this.ctx, x, y, this.board[y][x]);
                }
            }
        }
        
        // Draw current piece
        if (this.currentPiece) {
            for (let y = 0; y < this.currentPiece.shape.length; y++) {
                for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                    if (this.currentPiece.shape[y][x]) {
                        this.drawBlock(this.ctx, this.currentPiece.x + x, this.currentPiece.y + y, this.currentPiece.color);
                    }
                }
            }
        }
        
        // Draw grid
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        for (let x = 0; x <= this.cols; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.blockSize, 0);
            this.ctx.lineTo(x * this.blockSize, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y <= this.rows; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.blockSize);
            this.ctx.lineTo(this.canvas.width, y * this.blockSize);
            this.ctx.stroke();
        }
    }
    
    drawBlock(ctx, x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
    }
    
    drawNextPiece() {
        this.nextCtx.fillStyle = '#000';
        this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        if (this.nextPiece) {
            const shape = this.shapes[this.nextPiece];
            const color = this.colors[this.nextPiece];
            const offsetX = (this.nextCanvas.width - shape[0].length * 20) / 2;
            const offsetY = (this.nextCanvas.height - shape.length * 20) / 2;
            
            for (let y = 0; y < shape.length; y++) {
                for (let x = 0; x < shape[y].length; x++) {
                    if (shape[y][x]) {
                        this.nextCtx.fillStyle = color;
                        this.nextCtx.fillRect(offsetX + x * 20, offsetY + y * 20, 20, 20);
                        this.nextCtx.strokeStyle = '#000';
                        this.nextCtx.lineWidth = 1;
                        this.nextCtx.strokeRect(offsetX + x * 20, offsetY + y * 20, 20, 20);
                    }
                }
            }
        }
    }
    
    drawHoldPiece() {
        this.holdCtx.fillStyle = '#000';
        this.holdCtx.fillRect(0, 0, this.holdCanvas.width, this.holdCanvas.height);
        
        if (this.heldPiece) {
            const shape = this.shapes[this.heldPiece];
            const color = this.colors[this.heldPiece];
            const offsetX = (this.holdCanvas.width - shape[0].length * 20) / 2;
            const offsetY = (this.holdCanvas.height - shape.length * 20) / 2;
            
            for (let y = 0; y < shape.length; y++) {
                for (let x = 0; x < shape[y].length; x++) {
                    if (shape[y][x]) {
                        this.holdCtx.fillStyle = this.canHold ? color : '#666';
                        this.holdCtx.fillRect(offsetX + x * 20, offsetY + y * 20, 20, 20);
                        this.holdCtx.strokeStyle = '#000';
                        this.holdCtx.lineWidth = 1;
                        this.holdCtx.strokeRect(offsetX + x * 20, offsetY + y * 20, 20, 20);
                    }
                }
            }
        }
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
    new TetrisGame();
}); 