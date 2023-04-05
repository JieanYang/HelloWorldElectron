// CommonJS module import -> require
const { app, BrowserWindow, dialog, Menu, ipcMain } = require('electron');
const path = require('path');

const handlePing = (event, args) => {
  console.log('ipcRenderer -> ipcMain, step 3');
  return 'pong';
};

const handleSetTitle = (event, title) => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  win.setTitle(title);
};

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog();
  if (canceled) {
    return;
  }

  return filePaths[0];
}

// 将index.html加载进一个新的BrowserWindow实例
const createWindow = () => {
  const windowInstance = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  ipcMain.handle('ping', handlePing);

  ipcMain.on('set-title', handleSetTitle);

  ipcMain.handle('dialog:openFile', handleFileOpen);

  windowInstance.loadFile('index.html');

  return windowInstance;
};

app.whenReady().then(() => {
  const mainWindow = createWindow();

  // ================== The menu component bans the development tool for web - start ==================
  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => mainWindow.webContents.send('update-counter', 1),
          label: 'Increment',
        },
        {
          click: () => mainWindow.webContents.send('update-counter', -1),
          label: 'Decrement',
        },
      ],
    },
  ]);
  Menu.setApplicationMenu(menu);
  // ================== The menu component bans the development tool for web - end ==================

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
