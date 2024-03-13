const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
import  readPromise  from '../src/utils/readFile'
let normalPath = 'C:/Users/Administrator/AppData/Local/jianYingPro/Projects'
let res = []
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  // readPromise('C:/Users/27919/AppData/Local/JianyingPro/User Data/Projects/com.lveditor.draft')
  const menu = Menu.buildFromTemplate([
    {
      label: '点我查询数据',
      submenu: [
        {
          click: () => mainWindow.webContents.send('update-counter', res),
          label: 'Increment'
        },
        // {
        //   click: () => mainWindow.webContents.send('update-counter', -1),
        //   label: 'Decrement'
        // }
      ]
    }
  ])
  Menu.setApplicationMenu(menu)
  async function handleFileOpen (event, title) {
    console.log(title, 'title');
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    // win.setTitle(title)
    let fullAddress = normalPath + '/' +title
    console.log(fullAddress, 'fullAddressfullAddress');
    const items = fs.readdirSync(fullAddress)
    console.log(items, 'itemsitems');
    // 读取工程文件
    let currentFile = fullAddress + '/draft_meta_info.json'
    const currentFileItems = JSON.parse(fs.readFileSync(currentFile, 'utf8'))
    console.log(currentFileItems, 'currentFileItems');
  }

 readPromise(normalPath).then(value => {
    // mainWindow.webContents.send('update-counter', value)
    res = value
  })

  ipcMain.on('chooseFile', handleFileOpen)

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
