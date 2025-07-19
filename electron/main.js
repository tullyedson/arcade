const { app, BrowserWindow, Menu, globalShortcut } = require('electron');
const path = require('path');

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    titleBarStyle: 'default',
    show: false // Don't show until ready
  });

  // Load the index.html file
  mainWindow.loadFile('index.html');

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Register global shortcuts
  globalShortcut.register('Escape', () => {
    if (mainWindow) {
      mainWindow.webContents.send('global-escape');
    }
  });

  // Handle escape key globally for games
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'Escape') {
      // Let the web app handle escape key
      return;
    }
  });
}

// Create menu template
const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New Game',
        accelerator: 'CmdOrCtrl+N',
        click: () => {
          if (mainWindow) {
            mainWindow.webContents.send('new-game');
          }
        }
      },
      { type: 'separator' },
      {
        label: 'Exit',
        accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
        click: () => {
          app.quit();
        }
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    label: 'Games',
    submenu: [
      {
        label: 'Space Invaders',
        click: () => {
          if (mainWindow) {
            mainWindow.webContents.send('launch-game', 'space-invaders');
          }
        }
      },
      {
        label: 'Snake',
        click: () => {
          if (mainWindow) {
            mainWindow.webContents.send('launch-game', 'snake');
          }
        }
      },
      {
        label: 'Pong',
        click: () => {
          if (mainWindow) {
            mainWindow.webContents.send('launch-game', 'pong');
          }
        }
      },
      {
        label: 'Tetris',
        click: () => {
          if (mainWindow) {
            mainWindow.webContents.send('launch-game', 'tetris');
          }
        }
      },
      {
        label: 'Asteroids',
        click: () => {
          if (mainWindow) {
            mainWindow.webContents.send('launch-game', 'asteroids');
          }
        }
      },
      {
        label: 'Pac-Man',
        click: () => {
          if (mainWindow) {
            mainWindow.webContents.send('launch-game', 'pacman');
          }
        }
      }
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'About Retro Arcade',
        click: () => {
          require('electron').dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'About Retro Arcade',
            message: 'Retro Arcade v1.0.0',
            detail: 'A collection of classic arcade games built with vanilla JavaScript, HTML5 Canvas, and CSS3.\n\nEnjoy the retro gaming experience! 🎮'
          });
        }
      }
    ]
  }
];

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  // Build menu from template
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Unregister shortcuts when app is quitting
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// Handle app events
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
}); 