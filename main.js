// CommonJS module import -> require
const { app, BrowserWindow, dialog, Tray, Menu, nativeImage, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

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

  ipcMain.on('counter-value', (_event, value) => {
    console.log('conter-value:', value);
  });

  windowInstance.loadFile('index.html');

  return windowInstance;
};

app.whenReady().then(() => {
  // ================== Add tray - start ==================
  // const icon = nativeImage.createFromPath(path.join(__dirname, 'assets/favicon-16x16.png'));
  // const tray = new Tray(icon);

  // const contextMenu = Menu.buildFromTemplate([
  //   { label: 'Item1', type: 'radio' },
  //   { label: 'Item2', type: 'radio' },
  //   { label: 'Item3', type: 'radio', checked: true },
  //   { label: 'Item4', type: 'radio' },
  // ]);

  // tray.setContextMenu(contextMenu);
  // tray.setToolTip('This is my application');
  // tray.setTitle('This is my title');
  // ================== Add tray - end ==================

  const mainWindow = createWindow();

  // ================== The menu component bans the development tool for web - start ==================
  // const menu = Menu.buildFromTemplate([
  //   {
  //     label: app.name,
  //     submenu: [
  //       {
  //         click: () => mainWindow.webContents.send('update-counter', 1),
  //         label: 'Increment',
  //       },
  //       {
  //         click: () => mainWindow.webContents.send('update-counter', -1),
  //         label: 'Decrement',
  //       },
  //     ],
  //   },
  // ]);
  // Menu.setApplicationMenu(menu);
  // ================== The menu component bans the development tool for web - end ==================

  mainWindow.loadURL('https://google.com');

  mainWindow.webContents.on('did-finish-load', () => {
    const scriptPath = path.join(__dirname, 'renderer_2.js');
    const scriptContents = fs.readFileSync(scriptPath, 'utf8');
    mainWindow.webContents.executeJavaScript(scriptContents);
  });

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
