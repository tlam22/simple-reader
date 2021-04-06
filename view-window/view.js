window.jQuery = window.$ = jQuery;

$(document).ready(function() {
    console.log( "jQuery is loaded" );
});

window.addEventListener('message', evt => {
    if (evt.data.type === 'view-window-data') {
      console.log(evt.data.value)
    }
  })