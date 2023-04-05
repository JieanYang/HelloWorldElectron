// CommonJS module import -> require
const { app, BrowserWindow } = require('electron');
const path = require('path');

// 将index.html加载进一个新的BrowserWindow实例
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('index.html');
};

app.whenReady().then(() => {
  createWindow();

  // macOS 应用通常即使在没有打开任何窗口的情况下也继续运行，并且在没有窗口可用的情况下激活应用时会打开新的窗口
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // 在Windows和Linux上，关闭所有窗口通常会完全退出一个应用程序
  // macOS 应用通常即使在没有打开任何窗口的情况下也继续运行，并且在没有窗口可用的情况下激活应用时会打开新的窗口
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
