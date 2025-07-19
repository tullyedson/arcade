class ArcadeMenu {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Add click listeners to game cards
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (card.classList.contains('coming-soon')) {
                    this.showComingSoonMessage();
                    return;
                }
                
                const gameName = card.getAttribute('data-game');
                if (gameName) {
                    this.launchGame(gameName);
                }
            });
        });
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape') {
                this.handleEscapeKey();
            }
        });
    }
    
    launchGame(gameName) {
        // Add loading effect
        this.showLoadingScreen();
        
        // Launch the game in a new window/tab
        setTimeout(() => {
            window.location.href = `${gameName}/index.html`;
        }, 500);
    }
    
    showLoadingScreen() {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading-screen';
        loadingDiv.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <h2>Loading Game...</h2>
                <p>Preparing your arcade experience</p>
            </div>
        `;
        
        // Add loading styles
        const style = document.createElement('style');
        style.textContent = `
            #loading-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                color: #00ff00;
                font-family: 'Courier New', monospace;
            }
            
            .loading-content {
                text-align: center;
            }
            
            .loading-spinner {
                width: 50px;
                height: 50px;
                border: 3px solid #00ff00;
                border-top: 3px solid transparent;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .loading-content h2 {
                font-size: 2em;
                margin-bottom: 10px;
                text-shadow: 0 0 10px #00ff00;
            }
            
            .loading-content p {
                font-size: 1.2em;
                opacity: 0.8;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(loadingDiv);
    }
    
    showComingSoonMessage() {
        // Create a temporary message
        const message = document.createElement('div');
        message.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.95);
                border: 2px solid #00ff00;
                border-radius: 10px;
                padding: 30px;
                text-align: center;
                z-index: 1000;
                color: #00ff00;
                font-family: 'Courier New', monospace;
                box-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
            ">
                <h2 style="margin-bottom: 15px; text-shadow: 0 0 10px #00ff00;">🚧 Coming Soon! 🚧</h2>
                <p style="margin-bottom: 20px; font-size: 1.1em;">This game is under development.</p>
                <button onclick="this.parentElement.remove()" style="
                    background: transparent;
                    border: 1px solid #00ff00;
                    color: #00ff00;
                    padding: 10px 20px;
                    cursor: pointer;
                    font-family: 'Courier New', monospace;
                    transition: all 0.3s ease;
                " onmouseover="this.style.background='#00ff00'; this.style.color='#000'" 
                   onmouseout="this.style.background='transparent'; this.style.color='#00ff00'">
                    OK
                </button>
            </div>
        `;
        
        document.body.appendChild(message);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (message.parentElement) {
                message.remove();
            }
        }, 3000);
    }
    
    handleEscapeKey() {
        // Handle escape key if needed
        console.log('Escape key pressed');
    }
}

// Initialize the arcade menu when the page loads
window.addEventListener('load', () => {
    new ArcadeMenu();
}); 