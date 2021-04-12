const { ipcRenderer} = require('electron')
const { BrowserWindow } = require('@electron/remote');
let currWindow = BrowserWindow.getFocusedWindow();


process.once('loaded', () => {
  window.addEventListener('message', evt => {
    if (evt.data.type === 'select-dirs') {
      ipcRenderer.send('select-dirs')
    }
    else if (evt.data.type === 'load-view-child-window') {
      ipcRenderer.send('view-window-open', evt.data.value);
    }
  })

  ipcRenderer.on('directory-list', (event, arg) => {
    window.postMessage({
      type: 'load-ui-gallery',
      value: arg
    })
  })
  window.closeCurrentWindow = function(){
    currWindow.close();
  }

  //window.closeCurrentWindow();
  
})

