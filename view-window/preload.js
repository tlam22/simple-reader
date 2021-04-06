const { ipcRenderer } = require('electron')

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
    })

})