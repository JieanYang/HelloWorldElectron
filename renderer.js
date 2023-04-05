console.log('run renderer.js');

const information = document.getElementById('info');
information.innerText = `本应用正在使用 Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), 和 Electron (v${versions.electron()})`;

const func = async () => {
  console.log('ipcRenderer -> ipcMain, step 1');
  const response = await window.versions.ping();
  console.log('ipcRenderer -> ipcMain, step 3 in main process(main.js)');
  console.log('ipcRenderer -> ipcMain, step 4');
  console.log(response); // 打印 'pong'
};

func();

const setButton = document.getElementById('btn');
const titleInput = document.getElementById('title');
setButton.addEventListener('click', () => {
  const title = titleInput.value;
  window.electronAPI.setTitle(title);
});

const btn = document.getElementById('btn-open-file');
const filePathElement = document.getElementById('filePath');

btn.addEventListener('click', async () => {
  const filePath = await window.electronAPI.openFile();
  filePathElement.innerText = filePath;
});

const counter = document.getElementById('counter');

window.electronAPI.onUpdateCounter((_event, value) => {
  const oldValue = Number(counter.innerText);
  const newValue = oldValue + value;
  counter.innerText = newValue;
});
