const { ipcRenderer } = require('electron')

process.once('loaded', () => {

    ipcRenderer.on('view-window-data-main',(event,arg) =>{
        window.postMessage({
          type: 'view-window-data',
          value: arg
        })
    })

})