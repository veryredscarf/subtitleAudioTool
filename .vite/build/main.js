"use strict";
const avoid_parse_require$1 = require;
const _M_$1 = avoid_parse_require$1("fs");
_M_$1.appendFile;
_M_$1.appendFileSync;
_M_$1.access;
_M_$1.accessSync;
_M_$1.chown;
_M_$1.chownSync;
_M_$1.chmod;
_M_$1.chmodSync;
_M_$1.close;
_M_$1.closeSync;
_M_$1.copyFile;
_M_$1.copyFileSync;
_M_$1.cp;
_M_$1.cpSync;
_M_$1.createReadStream;
_M_$1.createWriteStream;
_M_$1.exists;
_M_$1.existsSync;
_M_$1.fchown;
_M_$1.fchownSync;
_M_$1.fchmod;
_M_$1.fchmodSync;
_M_$1.fdatasync;
_M_$1.fdatasyncSync;
_M_$1.fstat;
_M_$1.fstatSync;
_M_$1.fsync;
_M_$1.fsyncSync;
_M_$1.ftruncate;
_M_$1.ftruncateSync;
_M_$1.futimes;
_M_$1.futimesSync;
_M_$1.lchown;
_M_$1.lchownSync;
_M_$1.lchmod;
_M_$1.lchmodSync;
_M_$1.link;
_M_$1.linkSync;
_M_$1.lstat;
_M_$1.lstatSync;
_M_$1.lutimes;
_M_$1.lutimesSync;
_M_$1.mkdir;
_M_$1.mkdirSync;
_M_$1.mkdtemp;
_M_$1.mkdtempSync;
_M_$1.open;
_M_$1.openSync;
_M_$1.opendir;
_M_$1.opendirSync;
_M_$1.readdir;
_M_$1.readdirSync;
_M_$1.read;
_M_$1.readSync;
_M_$1.readv;
_M_$1.readvSync;
_M_$1.readFile;
_M_$1.readFileSync;
_M_$1.readlink;
_M_$1.readlinkSync;
_M_$1.realpath;
_M_$1.realpathSync;
_M_$1.rename;
_M_$1.renameSync;
_M_$1.rm;
_M_$1.rmSync;
_M_$1.rmdir;
_M_$1.rmdirSync;
_M_$1.stat;
_M_$1.statSync;
_M_$1.symlink;
_M_$1.symlinkSync;
_M_$1.truncate;
_M_$1.truncateSync;
_M_$1.unwatchFile;
_M_$1.unlink;
_M_$1.unlinkSync;
_M_$1.utimes;
_M_$1.utimesSync;
_M_$1.watch;
_M_$1.watchFile;
_M_$1.writeFile;
_M_$1.writeFileSync;
_M_$1.write;
_M_$1.writeSync;
_M_$1.writev;
_M_$1.writevSync;
_M_$1.Dir;
_M_$1.Dirent;
_M_$1.Stats;
_M_$1.ReadStream;
_M_$1.WriteStream;
_M_$1.FileReadStream;
_M_$1.FileWriteStream;
_M_$1._toUnixTimestamp;
_M_$1.F_OK;
_M_$1.R_OK;
_M_$1.W_OK;
_M_$1.X_OK;
_M_$1.constants;
_M_$1.promises;
const keyword_default$1 = _M_$1.default || _M_$1;
const avoid_parse_require = require;
const _M_ = avoid_parse_require("path");
_M_.resolve;
_M_.normalize;
_M_.isAbsolute;
_M_.join;
_M_.relative;
_M_.toNamespacedPath;
_M_.dirname;
_M_.basename;
_M_.extname;
_M_.format;
_M_.parse;
_M_.sep;
_M_.delimiter;
_M_.win32;
_M_.posix;
_M_._makeLong;
const keyword_default = _M_.default || _M_;
let dircList = [];
let readPromise = (folderPath) => {
  console.log(folderPath, "folderPathfolderPath");
  return new Promise((resolve, reject) => {
    if (!folderPath) {
      return false;
    }
    keyword_default$1.readdirSync(folderPath).map((fileName) => {
      let filePath = keyword_default.join(folderPath, fileName);
      if (!keyword_default$1.lstatSync(filePath).isFile()) {
        dircList.push(fileName);
      }
    });
    resolve(dircList);
  });
};
const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
let normalPath = "C:/Users/27919/AppData/Local/JianyingPro/User Data/Projects/com.lveditor.draft";
let res = [];
if (require("electron-squirrel-startup")) {
  app.quit();
}
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });
  {
    mainWindow.loadURL("http://localhost:8099");
  }
  mainWindow.webContents.openDevTools();
  const menu = Menu.buildFromTemplate([
    {
      label: "点我查询数据",
      submenu: [
        {
          click: () => mainWindow.webContents.send("update-counter", res),
          label: "Increment"
        }
        // {
        //   click: () => mainWindow.webContents.send('update-counter', -1),
        //   label: 'Decrement'
        // }
      ]
    }
  ]);
  Menu.setApplicationMenu(menu);
  async function handleFileOpen(event, title) {
    const webContents = event.sender;
    BrowserWindow.fromWebContents(webContents);
    let fullAddress = normalPath + "/" + title;
    fs.readdirSync(fullAddress);
    let currentFile = fullAddress + "/draft_content.json";
    const currentFileItems = JSON.parse(fs.readFileSync(currentFile, "utf8"));
    let startData = JSON.parse(JSON.stringify(currentFileItems));
    let audioFirstStart = 0;
    let normalSpace = 2e3;
    const { materials, tracks } = currentFileItems;
    const { texts, audios } = materials;
    let textInfoList = tracks.filter((item) => item.type == "text");
    let audioInfoList = tracks.filter((item) => item.type == "audio");
    let textInfoObj = textInfoList[0];
    let { segments } = textInfoObj;
    segments.map((textItem, textItemIndex) => {
      console.log(2222);
      const { material_id } = textItem;
      let audioIndex = audios.findIndex((item) => item.text_id === material_id);
      if (audioIndex != -1) {
        console.log(11111);
        let currentAudioObjId = audios[audioIndex].id;
        audioInfoList.map((item, index) => {
          let segmentsAudioIndex = item.segments.findIndex((item2) => item2.material_id == currentAudioObjId);
          if (segmentsAudioIndex != -1) {
            console.log(index, index);
            segments[textItemIndex].target_timerange.start = audioFirstStart;
            segments[textItemIndex].target_timerange.duration = item.segments[segmentsAudioIndex].target_timerange.duration;
            item.segments[segmentsAudioIndex].target_timerange.start = audioFirstStart;
            audioFirstStart = normalSpace + Number(item.segments[segmentsAudioIndex].target_timerange.duration) + audioFirstStart;
            console.log(audioFirstStart, "audioFirstStartaudioFirstStart");
          }
        });
      }
    });
    let finallData = JSON.parse(JSON.stringify(currentFileItems));
    let data = JSON.stringify(currentFileItems);
    mainWindow.webContents.send("finish", { startData, finallData });
    fs.writeFileSync(currentFile, data, "utf-8");
  }
  readPromise(normalPath).then((value) => {
    res = value;
  });
  ipcMain.on("chooseFile", handleFileOpen);
};
app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
