const { ipcRenderer } = require('electron')
const { BrowserWindow } = require('@electron/remote');
const winControl = require('../utils/handler');


process.once('loaded', () => {
  window.addEventListener('message', evt => {
    if (evt.data.type === 'select-dirs') {
      ipcRenderer.send('select-dirs')
    }
    else if (evt.data.type === 'load-view-child-window') {
      ipcRenderer.send('view-window-open', evt.data.value);
    }
    else if (evt.data.type === 'handle-window-controls-main') {
      const currWindow = BrowserWindow.getFocusedWindow();
      winControl.handle_window_controls(currWindow,evt);
    }
    else if (evt.data.type === 'sort-latest-checkbox') {
      ipcRenderer.send('sort-latest-checkbox-setting',evt.data.value)
    }
  })

  ipcRenderer.on('directory-list', (event, arg) => {
    window.postMessage({
      type: 'load-ui-gallery',
      value: arg
    })
  })

  ipcRenderer.on('userSettings-main', (event, arg) => {
    window.postMessage({
      type: 'userSettings',
      value: arg
    })
  })

})

