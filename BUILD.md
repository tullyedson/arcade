# 🚀 Build Instructions for Retro Arcade Apps

This guide will help you build native apps for Windows, iOS, and Android from the web-based retro arcade.

## 📋 Prerequisites

### **For All Platforms**
- Node.js (v16 or higher)
- npm or yarn package manager

### **For Windows Desktop App**
- Windows 10/11
- No additional requirements

### **For iOS App**
- macOS (required for iOS development)
- Xcode (latest version)
- iOS Developer Account (for App Store distribution)

### **For Android App**
- Android Studio
- Android SDK
- Java Development Kit (JDK)

## 🖥️ Windows Desktop App (Electron)

### **1. Install Dependencies**
```bash
npm install
```

### **2. Run Development Version**
```bash
npm start
```

### **3. Build Windows Installer**
```bash
npm run build:win
```

The built app will be in the `dist` folder as:
- `Retro Arcade Setup.exe` - Windows installer
- `win-unpacked/` - Portable version

### **4. Customize Build**
Edit `package.json` to modify:
- App name and description
- Icon files
- Build configuration

## 📱 iOS App (Capacitor)

### **1. Install Capacitor**
```bash
npm install
npx cap add ios
```

### **2. Sync Web Code**
```bash
npx cap sync
```

### **3. Open in Xcode**
```bash
npx cap open ios
```

### **4. Build in Xcode**
1. Select your target device/simulator
2. Click the Play button or press Cmd+R
3. For App Store: Product → Archive

### **5. Customize iOS Settings**
Edit `ios/App/App/Info.plist` for:
- App permissions
- Device orientation
- Status bar settings

## 🤖 Android App (Capacitor)

### **1. Install Capacitor**
```bash
npm install
npx cap add android
```

### **2. Sync Web Code**
```bash
npx cap sync
```

### **3. Open in Android Studio**
```bash
npx cap open android
```

### **4. Build APK**
1. Build → Build Bundle(s) / APK(s) → Build APK(s)
2. Find APK in `android/app/build/outputs/apk/debug/`

### **5. Customize Android Settings**
Edit `android/app/src/main/AndroidManifest.xml` for:
- App permissions
- Screen orientation
- Theme settings

## 🌐 Progressive Web App (PWA)

### **1. Deploy to Web Server**
Upload all files to any web server (GitHub Pages, Netlify, etc.)

### **2. Install on Devices**
- **Desktop**: Click "Install" in browser address bar
- **Mobile**: "Add to Home Screen" from browser menu

### **3. Test PWA Features**
- Offline functionality
- App-like experience
- Home screen installation

## 🎨 App Icons

### **Required Icon Sizes**
Create these icons in the `assets/` folder:

**Windows:**
- `icon.ico` (256x256)

**iOS:**
- `icon-192x192.png`
- `icon-512x512.png`

**Android:**
- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

### **Icon Design Tips**
- Use the retro green theme (#00ff00)
- Include classic arcade elements
- Ensure good contrast
- Test at small sizes

## 🔧 Configuration Files

### **Electron (Windows)**
- `electron/main.js` - Main process
- `package.json` - Build settings

### **Capacitor (Mobile)**
- `capacitor.config.js` - App configuration
- `manifest.json` - PWA manifest

### **PWA**
- `sw.js` - Service worker
- `manifest.json` - Web app manifest

## 📦 Distribution

### **Windows**
- Upload installer to Microsoft Store
- Distribute via website
- Use portable version

### **iOS**
- Submit to App Store via Xcode
- TestFlight for beta testing
- Enterprise distribution

### **Android**
- Upload APK to Google Play Store
- Direct APK distribution
- Internal testing

### **PWA**
- Deploy to web hosting
- Submit to app stores (PWA support)
- Share via URL

## 🐛 Troubleshooting

### **Common Issues**

**Electron Build Fails:**
```bash
npm install --save-dev electron-builder
npm run build:win
```

**Capacitor Sync Issues:**
```bash
npx cap sync --force
```

**iOS Build Errors:**
- Check Xcode version compatibility
- Verify iOS deployment target
- Clean build folder in Xcode

**Android Build Errors:**
- Update Android SDK
- Check Java version compatibility
- Clean project in Android Studio

### **Performance Optimization**
- Minimize bundle size
- Optimize images and assets
- Use efficient game loops
- Implement proper caching

## 📱 Mobile-Specific Considerations

### **Touch Controls**
- Add touch event handlers
- Implement virtual joysticks
- Optimize button sizes for touch

### **Screen Orientation**
- Support portrait and landscape
- Handle orientation changes
- Optimize layouts for different screens

### **Performance**
- Optimize for mobile processors
- Reduce memory usage
- Implement battery-friendly game loops

## 🎮 Game-Specific Adaptations

### **Space Invaders**
- Touch controls for movement
- Tap to shoot

### **Snake**
- Swipe gestures for direction
- Touch to pause

### **Pong**
- Touch and drag paddle
- Auto-ball movement

### **Tetris**
- Touch controls for rotation
- Swipe for movement

### **Asteroids**
- Virtual joystick for movement
- Touch to shoot

### **Pac-Man**
- Virtual joystick for movement
- Touch to pause

## 📞 Support

For build issues:
1. Check console/logs for errors
2. Verify all prerequisites are installed
3. Try clean builds
4. Check platform-specific documentation

---

**Happy building! 🎮✨** 