class AsteroidsGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game state
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameRunning = false;
        this.gamePaused = false;
        
        // Player ship
        this.ship = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            vx: 0,
            vy: 0,
            angle: 0,
            thrust: false,
            radius: 15
        };
        
        // Game objects
        this.asteroids = [];
        this.bullets = [];
        this.explosions = [];
        
        // Controls
        this.keys = {};
        
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
            
            this.keys[e.code] = true;
            
            if (e.code === 'Space' && this.gameRunning) {
                e.preventDefault();
                this.shoot();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
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
        message.textContent = 'Use arrow keys to move and SPACE to shoot';
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
        this.asteroids = [];
        this.bullets = [];
        this.explosions = [];
        
        this.ship.x = this.canvas.width / 2;
        this.ship.y = this.canvas.height / 2;
        this.ship.vx = 0;
        this.ship.vy = 0;
        this.ship.angle = 0;
        
        this.spawnAsteroids();
        this.updateScore();
        this.gameRunning = true;
        this.gamePaused = false;
        
        this.hideOverlay();
        this.gameLoop();
    }
    
    spawnAsteroids() {
        const count = 3 + this.level;
        for (let i = 0; i < count; i++) {
            this.asteroids.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: 3,
                radius: 30
            });
        }
    }
    
    shoot() {
        const bullet = {
            x: this.ship.x + Math.cos(this.ship.angle) * this.ship.radius,
            y: this.ship.y + Math.sin(this.ship.angle) * this.ship.radius,
            vx: Math.cos(this.ship.angle) * 8,
            vy: Math.sin(this.ship.angle) * 8,
            life: 60
        };
        this.bullets.push(bullet);
    }
    
    updateScore() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('level').textContent = this.level;
    }
    
    gameLoop() {
        if (!this.gameRunning) return;
        
        this.update();
        this.draw();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        // Update ship
        if (this.keys['ArrowUp']) {
            this.ship.thrust = true;
            this.ship.vx += Math.cos(this.ship.angle) * 0.1;
            this.ship.vy += Math.sin(this.ship.angle) * 0.1;
        } else {
            this.ship.thrust = false;
        }
        
        if (this.keys['ArrowLeft']) {
            this.ship.angle -= 0.1;
        }
        if (this.keys['ArrowRight']) {
            this.ship.angle += 0.1;
        }
        
        // Apply friction
        this.ship.vx *= 0.99;
        this.ship.vy *= 0.99;
        
        // Update ship position
        this.ship.x += this.ship.vx;
        this.ship.y += this.ship.vy;
        
        // Wrap ship around screen
        this.ship.x = (this.ship.x + this.canvas.width) % this.canvas.width;
        this.ship.y = (this.ship.y + this.canvas.height) % this.canvas.height;
        
        // Update bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            bullet.life--;
            
            // Wrap bullets around screen
            bullet.x = (bullet.x + this.canvas.width) % this.canvas.width;
            bullet.y = (bullet.y + this.canvas.height) % this.canvas.height;
            
            if (bullet.life <= 0) {
                this.bullets.splice(i, 1);
            }
        }
        
        // Update asteroids
        for (let i = this.asteroids.length - 1; i >= 0; i--) {
            const asteroid = this.asteroids[i];
            asteroid.x += asteroid.vx;
            asteroid.y += asteroid.vy;
            
            // Wrap asteroids around screen
            asteroid.x = (asteroid.x + this.canvas.width) % this.canvas.width;
            asteroid.y = (asteroid.y + this.canvas.height) % this.canvas.height;
        }
        
        // Update explosions
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            const explosion = this.explosions[i];
            explosion.life--;
            if (explosion.life <= 0) {
                this.explosions.splice(i, 1);
            }
        }
        
        // Check collisions
        this.checkCollisions();
        
        // Check if all asteroids are destroyed
        if (this.asteroids.length === 0) {
            this.level++;
            this.spawnAsteroids();
        }
    }
    
    checkCollisions() {
        // Bullet-Asteroid collisions
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            for (let j = this.asteroids.length - 1; j >= 0; j--) {
                const asteroid = this.asteroids[j];
                const dx = bullet.x - asteroid.x;
                const dy = bullet.y - asteroid.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < asteroid.radius) {
                    // Create explosion
                    this.explosions.push({
                        x: asteroid.x,
                        y: asteroid.y,
                        life: 20
                    });
                    
                    // Split asteroid
                    if (asteroid.size > 1) {
                        for (let k = 0; k < 2; k++) {
                            this.asteroids.push({
                                x: asteroid.x,
                                y: asteroid.y,
                                vx: asteroid.vx + (Math.random() - 0.5) * 2,
                                vy: asteroid.vy + (Math.random() - 0.5) * 2,
                                size: asteroid.size - 1,
                                radius: asteroid.radius * 0.7
                            });
                        }
                    }
                    
                    // Update score
                    this.score += (4 - asteroid.size) * 10;
                    this.updateScore();
                    
                    // Remove bullet and asteroid
                    this.bullets.splice(i, 1);
                    this.asteroids.splice(j, 1);
                    break;
                }
            }
        }
        
        // Ship-Asteroid collisions
        for (let i = this.asteroids.length - 1; i >= 0; i--) {
            const asteroid = this.asteroids[i];
            const dx = this.ship.x - asteroid.x;
            const dy = this.ship.y - asteroid.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.ship.radius + asteroid.radius) {
                this.lives--;
                this.updateScore();
                
                if (this.lives <= 0) {
                    this.gameOver();
                    return;
                }
                
                // Reset ship position
                this.ship.x = this.canvas.width / 2;
                this.ship.y = this.canvas.height / 2;
                this.ship.vx = 0;
                this.ship.vy = 0;
                
                // Create explosion
                this.explosions.push({
                    x: this.ship.x,
                    y: this.ship.y,
                    life: 30
                });
                
                break;
            }
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars (background)
        this.ctx.fillStyle = '#fff';
        for (let i = 0; i < 50; i++) {
            const x = (i * 37) % this.canvas.width;
            const y = (i * 73) % this.canvas.height;
            this.ctx.fillRect(x, y, 1, 1);
        }
        
        // Draw ship
        this.ctx.save();
        this.ctx.translate(this.ship.x, this.ship.y);
        this.ctx.rotate(this.ship.angle);
        
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(15, 0);
        this.ctx.lineTo(-10, -8);
        this.ctx.lineTo(-5, 0);
        this.ctx.lineTo(-10, 8);
        this.ctx.closePath();
        this.ctx.stroke();
        
        // Draw thrust
        if (this.ship.thrust) {
            this.ctx.strokeStyle = '#ff0000';
            this.ctx.beginPath();
            this.ctx.moveTo(-5, 0);
            this.ctx.lineTo(-15, -3);
            this.ctx.lineTo(-15, 3);
            this.ctx.closePath();
            this.ctx.stroke();
        }
        
        this.ctx.restore();
        
        // Draw asteroids
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.lineWidth = 2;
        this.asteroids.forEach(asteroid => {
            this.ctx.beginPath();
            this.ctx.arc(asteroid.x, asteroid.y, asteroid.radius, 0, Math.PI * 2);
            this.ctx.stroke();
        });
        
        // Draw bullets
        this.ctx.fillStyle = '#00ff00';
        this.bullets.forEach(bullet => {
            this.ctx.fillRect(bullet.x - 1, bullet.y - 1, 2, 2);
        });
        
        // Draw explosions
        this.explosions.forEach(explosion => {
            const alpha = explosion.life / 20;
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(explosion.x, explosion.y, (20 - explosion.life) * 2, 0, Math.PI * 2);
            this.ctx.stroke();
        });
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
    new AsteroidsGame();
}); 