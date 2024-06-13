const {app, BrowserWindow, ipcMain} = require('electron');
const url = require('url');
const path = require('path');
const fs = require('node:fs');


function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'Electron React App',
        width: 1000,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // mainWindow.loadFile('https://google.com');

    // electron app will load whatever is running on localhost, 
    // which is why we need to do npm start to load the browser first 
    mainWindow.loadURL('http://localhost:3000/Login');

    mainWindow.webContents.openDevTools();
    return mainWindow
}

app.whenReady().then(() => {
    ipcMain.handle("readFile", (event, filePath)=>{
        return fs.readFileSync(filePath);
    });
    ipcMain.on("writeFile", (event, fileName, file) => {
        fs.writeFile(fileName, file, (err)=>{
        });
        console.log("Saved succesfully");
    });
    createMainWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
})