const { ipcRenderer } = require('electron')
const { BrowserWindow } = require('@electron/remote');
const winControl = require('../utils/handler');
process.once('loaded', () => {

    ipcRenderer.on('view-window-data-main',(event,arg) =>{
        window.postMessage({
          type: 'view-window-data',
          value: arg
        })
    })

    window.addEventListener('message', evt => {
      if (evt.data.type === 'view-g-div-resize') {
        ipcRenderer.send('view-g-div-resize', evt.data.value);
      }
      else if (evt.data.type === 'handle-window-controls-view') {
        const currWindow = BrowserWindow.getFocusedWindow();
        winControl.handle_window_controls(currWindow,evt);
      }
    })

})