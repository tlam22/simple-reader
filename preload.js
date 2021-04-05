const { ipcRenderer } = require('electron')

process.once('loaded', () => {
  window.addEventListener('message', evt => {
    if (evt.data.type === 'select-dirs') {
      ipcRenderer.send('select-dirs')
    }
  })

  ipcRenderer.on('directory-list', (event, arg)=>{
    console.log(arg);

    window.postMessage({
      type: 'load-ui-gallery',
      value: arg
    })
  })
})

