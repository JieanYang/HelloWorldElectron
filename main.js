// CommonJS module import -> require
const { app, BrowserWindow } = require('electron');

// 将index.html加载进一个新的BrowserWindow实例
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  win.loadFile('index.html');
};

app.whenReady().then(() => {
  createWindow();
});
