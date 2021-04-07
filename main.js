// Modules to control application life and create native browser window
const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')
const utils = require('./utils/utils');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  const mainWindowStateKeeper = utils.windowStateKeeper('main')
  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: mainWindowStateKeeper.x,
    y: mainWindowStateKeeper.y,
    width: mainWindowStateKeeper.width,
    height: mainWindowStateKeeper.height,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      enableRemoteModule: false,
      contextIsolation: true,
      sandbox: true
    },
    icon: __dirname + '/default.ico',
    title: 'Main'
  })

  mainWindowStateKeeper.track(mainWindow);

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('select-dirs', async (event, arg) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  })
  const files = utils.getSubDirNames(result.filePaths);
  let thumbs = utils.getImageFiles(files)
  mainWindow.webContents.send("directory-list",  thumbs);
});

ipcMain.on('view-window-open', async(event,arg)=>{
  const mainWindowStateKeeper = utils.windowStateKeeper('view')
  const childWindow =  new BrowserWindow({
    x: mainWindowStateKeeper.x,
    y: mainWindowStateKeeper.y,
    width: mainWindowStateKeeper.width,
    height: mainWindowStateKeeper.height,
    webPreferences: {
      preload: path.join(__dirname, 'view-window/preload.js'),
      nodeIntegration: false,
      enableRemoteModule: false,
      contextIsolation: true,
      sandbox: true
    },
    icon: __dirname + '/default.ico',
    title: 'View',
    show: false});
    mainWindowStateKeeper.track(childWindow);
    childWindow.loadFile(path.join(__dirname,'view-window/view.html'));
    childWindow.once('ready-to-show', () => {
      childWindow.show()
    })
    let styles = utils.readStyle();
    if(styles){
      arg.styles= styles;
    }
    childWindow.once("show", function() {
      childWindow.webContents.send("view-window-data-main", arg);
    });
});

ipcMain.on('view-g-div-resize', async(event,arg)=>{
  utils.saveStyle(arg)
});
