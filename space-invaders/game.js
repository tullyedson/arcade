class SpaceInvaders {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Game state
        this.gameState = 'menu'; // menu, playing, gameOver
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        
        // Player
        this.player = {
            x: this.width / 2,
            y: this.height - 50,
            width: 40,
            height: 20,
            speed: 5,
            dx: 0
        };
        
        // Aliens
        this.aliens = [];
        this.alienRows = 5;
        this.alienCols = 11;
        this.alienWidth = 30;
        this.alienHeight = 20;
        this.alienSpeed = 0.5;
        this.alienDirection = 1;
        this.alienDropDistance = 20;
        
        // Bullets
        this.playerBullets = [];
        this.alienBullets = [];
        this.bulletSpeed = 7;
        this.alienBulletSpeed = 3;
        
        // Barriers
        this.barriers = [];
        this.barrierWidth = 60;
        this.barrierHeight = 20;
        
        // UFO
        this.ufo = {
            x: -50,
            y: 30,
            width: 40,
            height: 15,
            speed: 2,
            active: false,
            points: 100
        };
        
        // Game timing
        this.lastTime = 0;
        this.alienShootTimer = 0;
        this.ufoTimer = 0;
        
        // Input
        this.keys = {};
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadHighScores();
        this.updateHighScoreDisplay();
        this.gameLoop();
    }
    
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            if (e.code === 'Space' && this.gameState === 'playing') {
                e.preventDefault();
                this.shoot();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Button events
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('menuBtn').addEventListener('click', () => {
            this.showMenu();
        });
        
        // Back to arcade buttons
        document.getElementById('backToArcade').addEventListener('click', () => {
            this.backToArcade();
        });
        
        document.getElementById('backToArcadeBtn').addEventListener('click', () => {
            this.backToArcade();
        });
    }
    
    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.alienSpeed = 0.5;
        
        this.createAliens();
        this.createBarriers();
        this.resetPlayer();
        this.clearBullets();
        
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('gameOverScreen').classList.add('hidden');
        
        this.updateUI();
    }
    
    showMenu() {
        this.gameState = 'menu';
        document.getElementById('startScreen').classList.remove('hidden');
        document.getElementById('gameOverScreen').classList.add('hidden');
        this.updateHighScoreDisplay();
    }
    
    backToArcade() {
        // Navigate back to the main arcade menu
        window.location.href = '../index.html';
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOverScreen').classList.remove('hidden');
        
        this.saveHighScore(this.score);
        this.updateHighScoreDisplay();
    }
    
    createAliens() {
        this.aliens = [];
        const startX = 50;
        const startY = 50;
        const spacing = 35;
        
        for (let row = 0; row < this.alienRows; row++) {
            for (let col = 0; col < this.alienCols; col++) {
                const alien = {
                    x: startX + col * spacing,
                    y: startY + row * spacing,
                    width: this.alienWidth,
                    height: this.alienHeight,
                    type: row < 2 ? 'top' : row < 4 ? 'middle' : 'bottom',
                    points: row < 2 ? 30 : row < 4 ? 20 : 10
                };
                this.aliens.push(alien);
            }
        }
    }
    
    createBarriers() {
        this.barriers = [];
        const barrierCount = 4;
        const barrierSpacing = this.width / (barrierCount + 1);
        
        for (let i = 0; i < barrierCount; i++) {
            const barrier = {
                x: barrierSpacing * (i + 1) - this.barrierWidth / 2,
                y: this.height - 150,
                width: this.barrierWidth,
                height: this.barrierHeight,
                health: 3
            };
            this.barriers.push(barrier);
        }
    }
    
    resetPlayer() {
        this.player.x = this.width / 2;
        this.player.y = this.height - 50;
        this.player.dx = 0;
    }
    
    clearBullets() {
        this.playerBullets = [];
        this.alienBullets = [];
    }
    
    shoot() {
        if (this.playerBullets.length < 3) { // Limit player bullets
            this.playerBullets.push({
                x: this.player.x + this.player.width / 2 - 2,
                y: this.player.y,
                width: 4,
                height: 10
            });
        }
    }
    
    alienShoot() {
        if (this.aliens.length === 0) return;
        
        const shootingAliens = this.aliens.filter(alien => 
            !this.aliens.some(other => 
                other !== alien && 
                Math.abs(other.x - alien.x) < 10 && 
                other.y > alien.y
            )
        );
        
        if (shootingAliens.length > 0) {
            const shooter = shootingAliens[Math.floor(Math.random() * shootingAliens.length)];
            this.alienBullets.push({
                x: shooter.x + shooter.width / 2 - 2,
                y: shooter.y + shooter.height,
                width: 4,
                height: 10
            });
        }
    }
    
    spawnUFO() {
        if (!this.ufo.active && Math.random() < 0.001) {
            this.ufo.active = true;
            this.ufo.x = -50;
            this.ufo.y = 30;
            this.ufo.points = Math.random() < 0.3 ? 300 : 100;
        }
    }
    
    updatePlayer() {
        if (this.keys['ArrowLeft']) {
            this.player.dx = -this.player.speed;
        } else if (this.keys['ArrowRight']) {
            this.player.dx = this.player.speed;
        } else {
            this.player.dx = 0;
        }
        
        this.player.x += this.player.dx;
        
        // Keep player in bounds
        if (this.player.x < 0) this.player.x = 0;
        if (this.player.x + this.player.width > this.width) {
            this.player.x = this.width - this.player.width;
        }
    }
    
    updateAliens(deltaTime) {
        if (this.aliens.length === 0) {
            this.nextLevel();
            return;
        }
        
        let shouldDrop = false;
        
        // Check if any alien hits the edge
        for (let alien of this.aliens) {
            if (this.alienDirection > 0 && alien.x + alien.width >= this.width) {
                shouldDrop = true;
                break;
            } else if (this.alienDirection < 0 && alien.x <= 0) {
                shouldDrop = true;
                break;
            }
        }
        
        // Move aliens
        for (let alien of this.aliens) {
            if (shouldDrop) {
                // Drop down one row
                alien.y += this.alienDropDistance;
                if (alien.y + alien.height >= this.player.y) {
                    this.gameOver();
                    return;
                }
            } else {
                // Move horizontally
                alien.x += this.alienSpeed * this.alienDirection * deltaTime;
            }
        }
        
        if (shouldDrop) {
            // Change direction after dropping
            this.alienDirection *= -1;
        }
    }
    
    updateBullets() {
        // Update player bullets
        this.playerBullets = this.playerBullets.filter(bullet => {
            bullet.y -= this.bulletSpeed;
            return bullet.y > 0;
        });
        
        // Update alien bullets
        this.alienBullets = this.alienBullets.filter(bullet => {
            bullet.y += this.alienBulletSpeed;
            return bullet.y < this.height;
        });
    }
    
    updateUFO() {
        if (this.ufo.active) {
            this.ufo.x += this.ufo.speed;
            if (this.ufo.x > this.width + 50) {
                this.ufo.active = false;
            }
        }
    }
    
    checkCollisions() {
        // Player bullets vs Aliens
        for (let i = this.playerBullets.length - 1; i >= 0; i--) {
            const bullet = this.playerBullets[i];
            
            // Check UFO collision
            if (this.ufo.active && this.checkCollision(bullet, this.ufo)) {
                this.score += this.ufo.points;
                this.ufo.active = false;
                this.playerBullets.splice(i, 1);
                this.updateUI();
                continue;
            }
            
            // Check alien collisions
            for (let j = this.aliens.length - 1; j >= 0; j--) {
                const alien = this.aliens[j];
                if (this.checkCollision(bullet, alien)) {
                    this.score += alien.points;
                    this.aliens.splice(j, 1);
                    this.playerBullets.splice(i, 1);
                    this.updateUI();
                    break;
                }
            }
        }
        
        // Alien bullets vs Player
        for (let i = this.alienBullets.length - 1; i >= 0; i--) {
            const bullet = this.alienBullets[i];
            if (this.checkCollision(bullet, this.player)) {
                this.lives--;
                this.alienBullets.splice(i, 1);
                this.updateUI();
                
                if (this.lives <= 0) {
                    this.gameOver();
                } else {
                    this.resetPlayer();
                }
                break;
            }
        }
        
        // Alien bullets vs Barriers
        for (let i = this.alienBullets.length - 1; i >= 0; i--) {
            const bullet = this.alienBullets[i];
            for (let barrier of this.barriers) {
                if (this.checkCollision(bullet, barrier)) {
                    this.alienBullets.splice(i, 1);
                    barrier.health--;
                    if (barrier.health <= 0) {
                        this.barriers = this.barriers.filter(b => b !== barrier);
                    }
                    break;
                }
            }
        }
        
        // Player bullets vs Barriers
        for (let i = this.playerBullets.length - 1; i >= 0; i--) {
            const bullet = this.playerBullets[i];
            for (let barrier of this.barriers) {
                if (this.checkCollision(bullet, barrier)) {
                    this.playerBullets.splice(i, 1);
                    barrier.health--;
                    if (barrier.health <= 0) {
                        this.barriers = this.barriers.filter(b => b !== barrier);
                    }
                    break;
                }
            }
        }
    }
    
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    nextLevel() {
        this.level++;
        this.alienSpeed += 0.2;
        this.createAliens();
        this.createBarriers();
        this.clearBullets();
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        
        // Add score flash effect
        const scoreElement = document.getElementById('score');
        scoreElement.classList.add('score-flash');
        setTimeout(() => scoreElement.classList.remove('score-flash'), 300);
    }
    
    loadHighScores() {
        this.highScores = JSON.parse(localStorage.getItem('spaceInvadersHighScores') || '[]');
    }
    
    saveHighScore(score) {
        this.highScores.push({
            score: score,
            date: new Date().toLocaleDateString()
        });
        
        this.highScores.sort((a, b) => b.score - a.score);
        this.highScores = this.highScores.slice(0, 10); // Keep top 10
        
        localStorage.setItem('spaceInvadersHighScores', JSON.stringify(this.highScores));
    }
    
    updateHighScoreDisplay() {
        const highScoreList = document.getElementById('highScoreList');
        highScoreList.innerHTML = '';
        
        this.highScores.forEach((entry, index) => {
            const item = document.createElement('div');
            item.className = 'high-score-item';
            item.textContent = `${index + 1}. ${entry.score} (${entry.date})`;
            highScoreList.appendChild(item);
        });
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        if (this.gameState === 'playing') {
            // Draw player
            this.ctx.fillStyle = '#00ff00';
            this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
            
            // Draw player bullets
            this.ctx.fillStyle = '#ffff00';
            this.playerBullets.forEach(bullet => {
                this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            });
            
            // Draw aliens
            this.aliens.forEach(alien => {
                this.ctx.fillStyle = alien.type === 'top' ? '#ff0000' : 
                                   alien.type === 'middle' ? '#ff8800' : '#00ff00';
                this.ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
            });
            
            // Draw alien bullets
            this.ctx.fillStyle = '#ff0000';
            this.alienBullets.forEach(bullet => {
                this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            });
            
            // Draw barriers
            this.barriers.forEach(barrier => {
                const alpha = barrier.health / 3;
                this.ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
                this.ctx.fillRect(barrier.x, barrier.y, barrier.width, barrier.height);
            });
            
            // Draw UFO
            if (this.ufo.active) {
                this.ctx.fillStyle = '#ff00ff';
                this.ctx.fillRect(this.ufo.x, this.ufo.y, this.ufo.width, this.ufo.height);
            }
            
            // Draw level indicator
            this.ctx.fillStyle = '#00ff00';
            this.ctx.font = '20px Courier New';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`LEVEL: ${this.level}`, 10, 30);
        }
    }
    
    update(deltaTime) {
        if (this.gameState !== 'playing') return;
        
        this.updatePlayer();
        this.updateAliens(deltaTime);
        this.updateBullets();
        this.updateUFO();
        this.checkCollisions();
        
        // Alien shooting
        this.alienShootTimer += deltaTime;
        if (this.alienShootTimer > 1000) {
            this.alienShoot();
            this.alienShootTimer = 0;
        }
        
        // UFO spawning
        this.spawnUFO();
    }
    
    gameLoop(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.draw();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new SpaceInvaders();
}); 