# 🎮 Retro Arcade Collection

A collection of classic arcade games built with vanilla JavaScript, HTML5 Canvas, and CSS3. Experience the nostalgia of retro gaming with modern web technologies!

## 🎯 Project Overview

This project recreates 6 classic arcade games in a unified retro arcade interface. Each game is self-contained in its own directory and features authentic gameplay mechanics with modern browser-based controls.

## 🕹️ Games Included

### 1. **Space Invaders** 👾
- **Path**: `space-invaders/`
- **Description**: Classic alien invasion arcade game
- **Controls**: ← → Move | SPACE Shoot
- **Features**: Progressive difficulty, score tracking, lives system

### 2. **Snake** 🐍
- **Path**: `snake/`
- **Description**: Classic snake game - eat food and grow longer
- **Controls**: Arrow Keys Move | SPACE Pause
- **Features**: Grid-based movement, food collection, collision detection, high score persistence

### 3. **Pong** 🏓
- **Path**: `pong/`
- **Description**: Classic paddle game - beat the computer
- **Controls**: W/S Move Paddle | SPACE Pause
- **Features**: AI opponent, ball physics, score tracking, paddle collision

### 4. **Tetris** 🧩
- **Path**: `tetris/`
- **Description**: Classic block-stacking puzzle game
- **Controls**: Arrow Keys Move/Rotate | SPACE Hard Drop | C Hold Piece
- **Features**: All 7 tetromino pieces, line clearing, level progression, next piece preview, hold functionality

### 5. **Asteroids** 🚀
- **Path**: `asteroids/`
- **Description**: Classic space shooter - destroy asteroids
- **Controls**: Arrow Keys Move/Rotate | SPACE Shoot
- **Features**: Physics-based movement, asteroid splitting, explosion effects, level progression

### 6. **Pac-Man** 🍎
- **Path**: `pacman/`
- **Description**: Classic maze game - eat dots and avoid ghosts
- **Controls**: Arrow Keys Move | SPACE Pause
- **Features**: Classic maze layout, ghost AI, power pellets, dot collection, multiple levels

## 📁 Repository Structure

```
arcade/
├── 📄 index.html              # Main arcade menu
├── 📄 arcade.js               # Arcade menu logic
├── 📄 style.css               # Main arcade styling
├── 📄 README.md               # This file
├── 📄 BUILD.md                # Build instructions for native apps
├── 📄 package.json            # Node.js dependencies and scripts
├── 📄 capacitor.config.js     # Capacitor configuration
├── 📄 manifest.json           # PWA manifest
├── 📄 sw.js                   # Service worker for PWA
├── 📄 build.bat               # Windows build automation script
├── 📁 electron/               # Windows desktop app
│   └── main.js                # Electron main process
├── 📁 assets/                 # App icons and assets
├── 📁 space-invaders/         # Space Invaders game
│   ├── index.html
│   ├── game.js
│   ├── style.css
│   └── README.md
├── 📁 snake/                  # Snake game
│   ├── index.html
│   ├── game.js
│   └── style.css
├── 📁 pong/                   # Pong game
│   ├── index.html
│   ├── game.js
│   └── style.css
├── 📁 tetris/                 # Tetris game
│   ├── index.html
│   ├── game.js
│   └── style.css
├── 📁 asteroids/              # Asteroids game
│   ├── index.html
│   ├── game.js
│   └── style.css
└── 📁 pacman/                 # Pac-Man game
    ├── index.html
    ├── game.js
    └── style.css
```

## 🛠️ Technologies Used

### **Frontend**
- **HTML5**: Semantic markup and structure
- **CSS3**: Styling with animations and responsive design
- **JavaScript (ES6+)**: Game logic and interactivity
- **HTML5 Canvas**: 2D graphics rendering for all games

### **App Conversion**
- **Electron**: Windows desktop app wrapper
- **Capacitor**: iOS and Android mobile app framework
- **PWA**: Progressive Web App capabilities
- **Service Worker**: Offline functionality and caching

### **Key Features**
- **Vanilla JavaScript**: No frameworks or libraries required
- **Responsive Design**: Works on desktop and mobile devices
- **Local Storage**: High score persistence
- **Keyboard Controls**: Full keyboard support for all games
- **Touch Controls**: Mobile-optimized touch interfaces
- **Retro Styling**: Authentic arcade aesthetic with green terminal theme
- **Cross-Platform**: Native apps for Windows, iOS, and Android

## 🚀 Getting Started

### **Prerequisites**
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### **Local Development**
1. **Clone the repository**:
   ```bash
   git clone https://github.com/tullyedson/arcade.git
   cd arcade
   ```

2. **Open in browser**:
   - Double-click `index.html` or
   - Use a local server: `python -m http.server 8000` then visit `http://localhost:8000`

### **Deployment**
- **GitHub Pages**: Enable GitHub Pages in repository settings
- **Any static hosting**: Upload all files to any web server
- **Local hosting**: Serve files from any web server

### **Native Apps**
- **Windows**: Run `npm run build:win` to create installer
- **iOS**: Use Capacitor with Xcode for App Store distribution
- **Android**: Use Capacitor with Android Studio for Play Store
- **PWA**: Install from browser for app-like experience

## 🎮 How to Play

1. **Main Menu**: Open `index.html` to see the arcade game selection
2. **Select Game**: Click on any game card to launch that game
3. **Controls**: Each game displays its specific controls on screen
4. **Return to Arcade**: Press `ESC` or click "Back to Arcade" button
5. **High Scores**: Scores are automatically saved to local storage

## 🎨 Design Features

### **Retro Aesthetic**
- **Color Scheme**: Classic green terminal (#00ff00) on black background
- **Typography**: Courier New monospace font for authentic feel
- **Animations**: Glowing text effects and smooth transitions
- **UI Elements**: Retro-styled buttons and overlays

### **User Experience**
- **Consistent Interface**: All games follow the same design language
- **Intuitive Controls**: Clear control instructions on each game screen
- **Game States**: Start screens, pause functionality, game over screens
- **Score Tracking**: Real-time score updates and high score persistence

## 🔧 Technical Implementation

### **Game Architecture**
- **Object-Oriented Design**: Each game is a self-contained class
- **Canvas Rendering**: Efficient 2D graphics using HTML5 Canvas
- **Game Loop**: RequestAnimationFrame for smooth 60fps gameplay
- **Event Handling**: Keyboard event listeners for responsive controls

### **Performance Optimizations**
- **Efficient Rendering**: Minimal canvas clearing and redrawing
- **Collision Detection**: Optimized algorithms for smooth gameplay
- **Memory Management**: Proper cleanup of game objects and event listeners

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-game`
3. **Add a new game** or **improve existing games**
4. **Follow the existing code style** and structure
5. **Test thoroughly** across different browsers
6. **Submit a pull request**

### **Adding New Games**
- Create a new directory with the game name
- Include `index.html`, `game.js`, and `style.css`
- Follow the existing game structure and naming conventions
- Add the game to the main arcade menu in `index.html`
- Update this README with game details

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Classic Arcade Games**: Inspired by the original arcade classics
- **HTML5 Canvas**: For providing powerful 2D graphics capabilities
- **Retro Gaming Community**: For keeping the spirit of classic games alive

## 📞 Support

If you encounter any issues or have questions:
- **Open an issue** on GitHub
- **Check the browser console** for error messages
- **Ensure you're using a modern browser** with JavaScript enabled

---

**Enjoy the retro gaming experience! 🎮✨** 