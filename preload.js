const { ipcRenderer } = require('electron')

process.once('loaded', () => {
  window.addEventListener('message', evt => {
    if (evt.data.type === 'select-dirs') {
      ipcRenderer.send('select-dirs')
    }
    else if(evt.data.type === 'load-view-child-window'){
      ipcRenderer.send('view-window-open', evt.data.value);
    }
  })

  ipcRenderer.on('directory-list', (event, arg)=>{
    window.postMessage({
      type: 'load-ui-gallery',
      value: arg
    })
  })
})

