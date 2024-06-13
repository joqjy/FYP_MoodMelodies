const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld(
    'myFS', {
        readFile: (filePath) => ipcRenderer.invoke('readFile', filePath),
        writeFile: (fileName, file) => ipcRenderer.send('writeFile', fileName, file)
    }
);