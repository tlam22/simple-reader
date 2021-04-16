const fs = require('fs');
const isImage = require('is-image');
const path = require('path')
function getSubDirNames(directory) {
  let directories = []
  for (let filepath of directory) {
    const rootFolder = filepath;
    fs.readdirSync(rootFolder).forEach(file => {
      let fullPath = `${rootFolder}\\${file}`;
      if (fs.lstatSync(fullPath).isDirectory()) {
        directories.push(fullPath);
      }
    });
  }
  return directories;
}

function getImageFiles(directory) {
  let files = []
  for (let filepath of directory) {
    const imageFolder = filepath;
    const title = filepath.split("\\").splice(-1)[0];
    const match = title.match(/\[(.*?)\]/);
    const tag = match ? match[1] : "";
    const { birthtime } = fs.statSync(imageFolder);
    let obj = { title: title, files: [], tag: tag, createdDate: birthtime }
    let f = fs.readdirSync(imageFolder);
    for (let file of f) {
      let fullPath = `${imageFolder}\\${file}`;
      if (isImage(fullPath)) {
        obj.files.push(fullPath.replace(/#/g, "%23").replace(/'/g, "&#39;"));
      }
    }
    obj.files.sort(function (a, b) {
      return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    });
    files.push(obj);
  }
  return files;

}

const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data))
  } catch (err) {
    console.error(err)
  }
}

const readData = (path) => {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  }
  catch (err) {
    console.error(err)
  }
}

function windowStateKeeper(windowName, app) {
  let window, windowState;
  let dir = path.join(app.getPath('userData'), `settings`);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  let settings = path.join(app.getPath('userData'), `settings/windowState.${windowName}.json`);
  function setBounds() {
    if (fs.existsSync(settings)) {
      windowState = readData(settings);
      return;
    }
    windowState = {
      x: undefined,
      y: undefined,
      width: 800,
      height: 600,
    };
  }
  function saveState() {
    if (!windowState.isMaximized) {
      windowState = window.getBounds();
    }
    windowState.isMaximized = window.isMaximized();
    storeData(windowState, settings);
  }
  function track(win) {
    window = win;
    ['resize', 'move', 'close'].forEach(event => {
      win.on(event, saveState);
    });
  }
  setBounds();
  return ({
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
    isMaximized: windowState.isMaximized,
    track,
  });
}

function saveStyle(data,app) {
  let dir = path.join(app.getPath('userData'), `settings`)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  let settings = path.join(app.getPath('userData'), `settings/windowState.styles.json`);
  storeData(data, settings);
}

function readStyle(app) {
  let settings = path.join(app.getPath('userData'), `settings/windowState.styles.json`);
  if (!fs.existsSync(settings)) return null;
  return readData(settings);
}


function saveUserSettings(data,app) {
  let dir = path.join(app.getPath('userData'), `settings`)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  let settings = path.join(app.getPath('userData'), `settings/userSettings.json`);
  storeData(data, settings);
}

function readUserSettings(app) {
  let settings = path.join(app.getPath('userData'), `settings/userSettings.json`);
  if (!fs.existsSync(settings)) return null;
  return readData(settings);
}

module.exports.getSubDirNames = getSubDirNames;
module.exports.getImageFiles = getImageFiles;
module.exports.windowStateKeeper = windowStateKeeper;
module.exports.saveStyle = saveStyle;
module.exports.readStyle = readStyle;
module.exports.readUserSettings = readUserSettings;
module.exports.saveUserSettings = saveUserSettings;
