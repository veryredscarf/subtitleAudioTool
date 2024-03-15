const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
import  readPromise  from '../src/utils/readFile'
// let normalPath = 'C:/Users/Administrator/AppData/Local/jianYingPro/Projects'
let normalPath = 'C:/Users/27919/AppData/Local/JianyingPro/User Data/Projects/com.lveditor.draft'
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
    // console.log(title, 'title');
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    // win.setTitle(title)
    let fullAddress = normalPath + '/' + title
    // console.log(fullAddress, 'fullAddressfullAddress');
    const items = fs.readdirSync(fullAddress)
    // console.log(items, 'itemsitems');
    // 读取工程文件
    let currentFile = fullAddress + '/draft_content.json'
    const currentFileItems = JSON.parse(fs.readFileSync(currentFile, 'utf8'))
    // console.log(currentFileItems, 'currentFileItems');
    // 首先默认将第一个音频的起始位置设置为0
    let audioFirstStart = 0
    // 设置每个视频的间距
    let normalSpace = 20000 // 默认是10帧
    const { materials, tracks } = currentFileItems
    // console.log(tracks);
    const { texts, audios } = materials
    // // 获取素材文本对象list
    let textInfoList = tracks.filter(item => item.type == 'text')  // 包含所有文本的时间，开始时间，但是只有一个对象
    let textInfoObj = textInfoList[0]

    const { segments } = textInfoObj
    // console.log(segments, 'segmentssegments');
    // // 此处获取到字幕对象的起始位置以及时长
    // segments.map(item => {

    // })
    // audios.map((item, index) => {
    //   const { id, text_id, duration } = item  // 获取音频对象的id,对应的文字转语音的id，音频时长
    //   // let textIndex =  segments.findIndex (item => item.material_id == text_id) // 找到对应音频所对应的文本对象
    //   segments[index].target_timerange.start = audioFirstStart
    // })

    let audioInfoList = tracks.filter(item => item.type == 'audio')  // 包含所有的音频对象的信息  有多个
    // console.log(textInfoList, 'textInfoList');



    // 由于我的需求是根据音频的长度来动态调整文本的长度
    // console.log(audioInfoList, 'audioInfoListaudioInfoList');
    audioInfoList.map((item, index) => {
      console.log(item, 'itemmmmmmmmmm');
      const { material_id, target_timerange } = item.segments[0] // 获取音频对象的id,以及对应音频的长度和起始位置
      const { duration} = target_timerange // 获取音频的长度
      segments[index].target_timerange.start = audioFirstStart
      segments[index].target_timerange.duration = duration
      item.segments[0].target_timerange.start = audioFirstStart
      audioFirstStart = normalSpace + duration
    })
    console.log(segments, 'segmentssegments');
    // console.log(currentFileItems.tracks[3].segments[0], 'currentFileItems.tracks[2].segments[0]');
    let data = JSON.stringify(currentFileItems);
    fs.writeFileSync(currentFile, data, "utf-8");
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
