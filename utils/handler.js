function handle_window_controls(currWindow, evt) {
    if (evt.data.value === 'min') {
        currWindow.minimize();
    }
    else if (evt.data.value === 'max') {
        currWindow.maximize();
    }
    else if (evt.data.value === 'restore') {
        currWindow.unmaximize();
    }
    else if (evt.data.value === 'close') {
        currWindow.close();
    }
}

module.exports.handle_window_controls = handle_window_controls;

