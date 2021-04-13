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
    output += `<img src='file://${image}' loading="lazy">`
    output += `</div>`
  }
  $('#g').html(output);
  document.title = title;
  if (data.styles) {
    $('#g').attr('style', data.styles.style)
  }
  $("#load-header").load("../header/header.html", function () {
    $("#window-title span").text(title);
    handleWindowControls();
  });
  check_size();
  cache_data(data);
}

function cache_data(data) {
  $(window).bind('beforeunload', function () {
    window.sessionStorage.setItem('image-data', JSON.stringify(data));
  })
}

function use_cached_data() {
  let data = window.sessionStorage.getItem('image-data');
  if (data) {
    load_images(JSON.parse(data));
  }
}

function check_size() {
  let foo = document.getElementById('g');
  let g = $('#g');
  let observer = new MutationObserver(function (mutations) {
    window.postMessage({
      type: 'view-g-div-resize',
      value: { style: g.attr('style') }
    })
  });
  observer.observe(foo, {
    attributes: true,
    attributeFilter: ['style']
  });
}


function handleWindowControls() {
  const event_type = 'handle-window-controls-view'
  document.getElementById('min-button').addEventListener("click", event => {
    window.postMessage({
      type: event_type,
      value: 'min'
    })
  });

  document.getElementById('max-button').addEventListener("click", event => {
    window.postMessage({
      type: event_type,
      value: 'max'
    })
    document.body.classList.add('maximized');
  });

  document.getElementById('restore-button').addEventListener("click", event => {
    window.postMessage({
      type: event_type,
      value: 'restore'
    })
    document.body.classList.remove('maximized');
  });

  document.getElementById('close-button').addEventListener("click", event => {
    window.postMessage({
      type: event_type,
      value: 'close'
    })
  });
}