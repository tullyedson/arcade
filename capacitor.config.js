const config = {
  appId: 'com.tullyedson.retroarcade',
  appName: 'Retro Arcade',
  webDir: '.',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#000000',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#00ff00',
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#000000'
    },
    Keyboard: {
      resize: 'body',
      style: 'dark'
    }
  },
  ios: {
    contentInset: 'always'
  },
  android: {
    allowMixedContent: true
  }
};

module.exports = config; 