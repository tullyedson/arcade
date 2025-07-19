# Space Invaders HTML5 Game

A classic Space Invaders arcade game built with HTML5 Canvas and JavaScript.

## How to Play

1. **Open `index.html`** in your web browser
2. **Click "START GAME"** to begin
3. **Use the controls** to play:
   - **Left Arrow (←)**: Move left
   - **Right Arrow (→)**: Move right
   - **Spacebar**: Shoot

## Game Features

### Classic Arcade Gameplay
- **Player Ship**: Control your ship at the bottom of the screen
- **Alien Invasion**: 5 rows of aliens that move side-to-side and drop down
- **Barriers**: Protective shields that can be destroyed by both player and aliens
- **UFO Bonus**: Random flying saucer that appears for extra points
- **Progressive Difficulty**: Aliens move faster each level

### Scoring System
- **Top Row Aliens (Red)**: 30 points each
- **Middle Row Aliens (Orange)**: 20 points each  
- **Bottom Row Aliens (Green)**: 10 points each
- **UFO**: 100 or 300 points (random)

### Game Mechanics
- **3 Lives**: Start with 3 lives, lose one when hit by alien bullet
- **Level Progression**: Clear all aliens to advance to next level
- **Increasing Speed**: Aliens move faster each level
- **High Score System**: Top 10 scores saved locally

### Visual Design
- **Retro Arcade Aesthetic**: Green terminal-style graphics
- **Glowing Effects**: Neon green borders and text shadows
- **Responsive Design**: Works on different screen sizes
- **Smooth Animations**: 60fps gameplay with requestAnimationFrame

## Game States

1. **Main Menu**: Shows title, controls, and high scores
2. **Playing**: Active gameplay with score and lives display
3. **Game Over**: Final score and options to restart or return to menu

## Technical Details

- **Pure HTML5/JavaScript**: No external dependencies
- **Canvas Rendering**: Smooth 2D graphics
- **Local Storage**: High scores persist between sessions
- **Keyboard Input**: Responsive controls with key event handling
- **Collision Detection**: Precise hit detection for all game objects

## Files

- `index.html` - Main HTML structure
- `style.css` - Retro arcade styling
- `game.js` - Complete game logic and mechanics
- `README.md` - This file

## Browser Compatibility

Works in all modern browsers that support:
- HTML5 Canvas
- ES6 Classes
- Local Storage
- requestAnimationFrame

Enjoy the game! 🚀👾 