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
    let startData = JSON.parse(JSON.stringify(currentFileItems)) // 最开始数据
    // console.log(currentFileItems, 'currentFileItems');
    // 首先默认将第一个音频的起始位置设置为0
    let audioFirstStart = 0
    // 设置每个视频的间距
    let normalSpace = 2000 // 默认是10帧
    const { materials, tracks } = currentFileItems
    let newSegments = [] // 新轨道信息
    // console.log(tracks);
    const { texts, audios } = materials
    // // 获取素材文本对象list
    let textInfoList = tracks.filter(item => item.type == 'text')  // 包含所有文本的时间，开始时间，但是只有一个对象
    let audioInfoList = tracks.filter(item => item.type == 'audio')  // 包含所有的音频对象的信息  有多个
    let textInfoObj = textInfoList[0]

    let { segments } = textInfoObj
    // 由于轨道上的字幕的顺序是正确的，所以我们需要根据字幕的顺序来匹配对应的字幕转音频文件的对象的信息，再通过音频对象的信息来调整自身字幕的长度
    segments.map((textItem, textItemIndex) => {
      console.log(2222);
      const {  material_id } = textItem // 找到对应的文本对象id，再通过这条id对应所有的音频对象中找到对应的text_id，于是找出对应的音频对象，再通过音频对象id，再遍历所有的音频轨道，找到某条轨道上的音频material_id与之对应即可
      let audioIndex = audios.findIndex(item => item.text_id === material_id)
      if (audioIndex != -1) {
        console.log(11111);
        let currentAudioObjId = audios[audioIndex].id
        let audiosegmentIndex = '' // 找到具体的音频轨道
        let audiosegmentAudioIndex = '' // 找到具体音频轨道上的音频对象下标
        // 通过音频id找到对应轨道上的音频对象
        audioInfoList.map((item, index) => {
          // const { material_id, target_timerange } = item.segments[0] // 获取音频对象的id,以及对应音频的长度和起始位置
          // const { duration} = target_timerange // 获取音频的长度
          let segmentsAudioIndex =  item.segments.findIndex(item => item.material_id == currentAudioObjId)
          if (segmentsAudioIndex != -1) {
            audiosegmentIndex = index
            audiosegmentAudioIndex = segmentsAudioIndex
            // console.log(textItem.target_timerange, 'textItem');
            // console.log(item, 'itemitemitem');
            // 根据这个值找到对应的音频对象
            // const { target_timerange } = item.segments[segmentsAudioIndex]
            // console.log(target_timerange, 'target_timerangetarget_timerange');
            console.log(index, index);


            segments[textItemIndex].target_timerange.start = audioFirstStart
            segments[textItemIndex].target_timerange.duration = item.segments[segmentsAudioIndex].target_timerange.duration
            item.segments[segmentsAudioIndex].target_timerange.start = audioFirstStart
            audioFirstStart = normalSpace + Number(item.segments[segmentsAudioIndex].target_timerange.duration) + audioFirstStart
            console.log(audioFirstStart, 'audioFirstStartaudioFirstStart');
          }
        })

      }
    })
    




    // console.log(segments, 'segmentssegments');
    // // 此处获取到字幕对象的起始位置以及时长
    // segments.map(item => {

    // })
    // audios.map((item, index) => {
    //   const { id, text_id, duration } = item  // 获取音频对象的id,对应的文字转语音的id，音频时长
    //   // let textIndex =  segments.findIndex (item => item.material_id == text_id) // 找到对应音频所对应的文本对象
    //   segments[index].target_timerange.start = audioFirstStart
    // })

    // currentFileItems.segments = 
    // currentFileItems.

    // 
    // let tracksIndex = tracks.findIndex(item => item.type == 'audio')
    // console.log(newSegments, 'newSegmentsnewSegments');
    // tracks[tracksIndex].segments = newSegments

    let finallData = JSON.parse(JSON.stringify(currentFileItems))
    let data = JSON.stringify(currentFileItems);
    mainWindow.webContents.send('finish', {startData, finallData})
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
