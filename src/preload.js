// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateCounter: (callback) => ipcRenderer.on('update-counter', (_event, value) => callback(value)),
  onFinish: (callback) => ipcRenderer.on('finish', (_event, value) => callback(value)),
  chooseFile: (value) => ipcRenderer.send('chooseFile', value)
})