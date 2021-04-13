const { ipcRenderer } = require('electron')
const { BrowserWindow } = require('@electron/remote');
const winControl = require('./utils/handler');
let currWindow = BrowserWindow.getFocusedWindow();


process.once('loaded', () => {
  window.addEventListener('message', evt => {
    if (evt.data.type === 'select-dirs') {
      ipcRenderer.send('select-dirs')
    }
    else if (evt.data.type === 'load-view-child-window') {
      ipcRenderer.send('view-window-open', evt.data.value);
    }
    else if (evt.data.type === 'handle-window-controls') {
      winControl.handle_window_controls(currWindow,evt);
    }
  })

  ipcRenderer.on('directory-list', (event, arg) => {
    window.postMessage({
      type: 'load-ui-gallery',
      value: arg
    })
  })


  //window.closeCurrentWindow();

})

