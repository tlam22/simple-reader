// Modules to control application life and create native browser window
const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')
const utils = require('./utils/utils');
require('@electron/remote/main').initialize();
require('v8-compile-cache');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  const window_loading = new BrowserWindow({
    width: 500,
    height: 500,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: false,
      contextIsolation: true,
      sandbox: false
    },
    icon: __dirname + '/default.ico'
  });
  window_loading.setResizable(false);
  window_loading.loadFile(path.join(__dirname,'view-loader/loader.html'));
  const mainWindowStateKeeper = utils.windowStateKeeper('main', app)
  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: mainWindowStateKeeper.x,
    y: mainWindowStateKeeper.y,
    width: mainWindowStateKeeper.width,
    height: mainWindowStateKeeper.height,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'view-main/preload.js'),
      nodeIntegration: false,
      enableRemoteModule: true,
      contextIsolation: true,
      sandbox: false
    },
    icon: __dirname + '/default.ico',
    title: 'Main',
    show: false
  })
  mainWindowStateKeeper.track(mainWindow);
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'view-main/index.html'));
  const userSettings = utils.readUserSettings(app);
  mainWindow.once('ready-to-show', () => {
    window_loading.close();
    mainWindow.show();
  })
  mainWindow.once("show", function () {
    if(!userSettings) return;
    mainWindow.webContents.send("userSettings-main", userSettings);
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
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
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
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
  mainWindow.webContents.send("directory-list", thumbs);
});

ipcMain.on('view-window-open', async (event, arg) => {
  const mainWindowStateKeeper = utils.windowStateKeeper('view', app)
  const childWindow = new BrowserWindow({
    x: mainWindowStateKeeper.x,
    y: mainWindowStateKeeper.y,
    width: mainWindowStateKeeper.width,
    height: mainWindowStateKeeper.height,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'view-window/preload.js'),
      nodeIntegration: false,
      enableRemoteModule: true,
      contextIsolation: true,
      sandbox: false
    },
    icon: __dirname + '/default.ico',
    title: 'View',
    show: false
  });
  mainWindowStateKeeper.track(childWindow);
  childWindow.loadFile(path.join(__dirname, 'view-window/view.html'));
  childWindow.once('ready-to-show', () => {
    childWindow.show()
  })
  let styles = utils.readStyle(app);
  if (styles) {
    arg.styles = styles;
  }
  childWindow.once("show", function () {
    childWindow.webContents.send("view-window-data-main", arg);
  });
});

ipcMain.on('view-g-div-resize', async (event, arg) => {
  utils.saveStyle(arg, app)
});

ipcMain.on('sort-latest-checkbox-setting', async(event,arg) => {
  utils.saveUserSettings(arg,app);
});
