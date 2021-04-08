window.jQuery = window.$ = jQuery;

$(document).ready(function () {
  use_cached_data();
  window.addEventListener('message', evt => {
    if (evt.data.type === 'view-window-data') {
      load_images(evt.data.value)
    }
  })
});

function load_images(data) {
  let output = "";
  let title = data.title;
  let images = data.images
  for (const image of images) {
    output += `<div>`
    output += `<img src='file://${image}'>`
    output += `</div>`
  }
  $('#g').html(output);
  document.title = title;
  if(data.styles){
    $('#g').attr('style',data.styles.style)
  }
  check_size();
  cache_data(data);
}

function cache_data(data){ 
  $(window).bind('beforeunload', function(){
    window.sessionStorage.setItem('image-data', JSON.stringify(data));
  })
}

function use_cached_data(){
  let data = window.sessionStorage.getItem('image-data');
  if(data){
    load_images(JSON.parse(data));
  }
}

function check_size() {
  let foo = document.getElementById('g');
  let g = $('#g');
  let observer = new MutationObserver(function (mutations) {
    window.postMessage({
      type: 'view-g-div-resize',
      value: {style: g.attr('style')}
    })
  });
  observer.observe(foo, {
    attributes: true,
    attributeFilter: ['style']
  });
}