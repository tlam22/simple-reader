// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.



window.jQuery = window.$ = jQuery;

$(document).ready(function () {
  $('#load').hide();
  $("#load-header").load("../header/header.html", function () {
    $("#window-title span").text("Simple Reader");
    handleWindowControls();
  });

  $(window).resize(function () {
    bottom_paginator_css();
  });

  document.getElementById('dirs').addEventListener('click', (evt) => {
    evt.preventDefault()
    $('#load').show();
    $("input").prop('disabled', true);
    window.postMessage({
      type: 'select-dirs',
    })
  })


  window.addEventListener('message', evt => {
    if (evt.data.type === 'load-ui-gallery') {
      set_up_gallery(evt.data.value)
    }
    else if (evt.data.type === 'userSettings') {
      let s = evt.data.value;
      $('#sort-latest').prop('checked', s.sort_latest)
    }
  })

  $('div.search-container button').click(function () {
    if (gallery_ref.length === 0) {
      return;
    }
    const query = $('div.search-container input').val();
    const tag = ($('#tags-select').find(':selected').val() || "")
    let filtered = gallery_ref.filter(x => x.title && x.title.toLowerCase().includes(query.toLowerCase()) && x.title.toLowerCase().includes(tag.toLowerCase()));
    if ($('#sort-latest').prop('checked')) {
      filtered = filtered.sort((a, b) => b.createdDate - a.createdDate);
    }
    $('.pagination').pagination({
      dataSource: filtered,
      pageSize: 1,
      showGoInput: true,
      showGoButton: true,
      className: 'paginationjs-theme-yellow',
      callback: gallery_pagination_generate
    })
  })


  $("div.search-container input").on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      $('div.search-container button').trigger("click");
    }
  });

  init_tagsDropDown();

});
let gallery_ref = [];
function hide_loadings() {
  $('#load').hide();
  $("input").prop('disabled', false);
}
function set_up_gallery(gallery) {
  if (gallery.length === 0) {
    hide_loadings()
    return "";
  }
  gallery_ref = [...gallery];
  if ($('#sort-latest').prop('checked')) {
    gallery = gallery.sort((a, b) => b.createdDate - a.createdDate);
  }
  $('.pagination').pagination({
    dataSource: gallery,
    pageSize: 1,
    showGoInput: true,
    showGoButton: true,
    className: 'paginationjs-theme-yellow',
    callback: gallery_pagination_generate
  })
  generate_new_dropDownItems(gallery_ref);
  document.onkeydown = checkArrowKeys;
}

function gallery_pagination_generate(data, pagination) {
  let html = load_gallery(data);
  $('#g').html(html);
  $("div.gallery").click(function () {
    let image = $(this).find("img");
    let title = $(image).attr("title");
    let targets = gallery.find(x => x.title === title);
    open_viewer_window({ title: targets.title, images: targets.files });
  });
  fix_pagination();
  $('#g').waitForImages(function () {
    bottom_paginator_css();
  });
  hide_loadings();
}

function fix_pagination(){
  $('.pagination.top div.paginationjs').remove();
  $('.pagination.bottom div.paginationjs').first().addClass('bottom');
}

function generate_new_dropDownItems(gallery) {
  $('#tags-select').val(null).empty().trigger('change');
  const emptyOption = new Option("", "", false, false);
  $('#tags-select').append(emptyOption).trigger('change');
  for (const obj of gallery) {
    if (obj.tag !== "" && !$('#tags-select').find("option[value='" + obj.tag.toLowerCase() + "']").length) {
      const newOption = new Option(obj.tag, obj.tag.toLowerCase(), false, false);
      $('#tags-select').append(newOption).trigger('change');
    }
  }
}

function init_tagsDropDown() {
  $('#tags-select').select2({
    placeholder: 'Filter by tag',
    width: "178",
    allowClear: true
  });

  $('#tags-select').on('select2:clear', function (e) {
    $('div.search-container button').trigger("click");
  });

  $('#tags-select').on('select2:select', function (e) {
    $('div.search-container button').trigger("click");
  });

  $('#sort-latest').click(function (e) {
    $('div.search-container button').trigger("click");
    window.postMessage({
      type: 'sort-latest-checkbox',
      value: { sort_latest: $('#sort-latest').prop('checked') }
    })
  })

}


function checkArrowKeys(e) {

  e = e || window.event;

  if (e.keyCode == '38') {
    // up arrow
    $("#g").focus();
  }
  else if (e.keyCode == '40') {
    //  down arrow
    $("#g").focus();
  }
  else if (e.keyCode == '37') {
    // left arrow
    $("li.paginationjs-prev.J-paginationjs-previous").trigger("click");
  }
  else if (e.keyCode == '39') {
    // right arrow
    $("li.paginationjs-next.J-paginationjs-next").trigger("click");
  }

}



function load_gallery(gallery) {
  let output = "";
  for (const obj of gallery) {
    if (obj.files.length) {
      output += `<div class="gallery">`;
      output += `<img src="file://${obj.files[0]}" alt="${obj.title}" title="${obj.title}">`;
      output += `<div class="desc">${truncate(obj.title, 80)}</div>`;
      output += `</div>`;
    }
  }
  return output;
}

function bottom_paginator_css() {
  let g = $('#g').height();
  $('.pagination.bottom div.paginationjs.bottom .paginationjs-pages').css('top', g + 220);
  $('.pagination.bottom div.paginationjs.bottom .paginationjs-go-input').css('top', g + 35 + 220);
  $('.pagination.bottom div.paginationjs.bottom .paginationjs-go-button').css('top', g + 35 + 220);
}

function top_paginator_handler() {
  $('.pagination.top .paginationjs-pages ul li > a')
}


function open_viewer_window(targets) {
  window.postMessage({
    type: 'load-view-child-window',
    value: targets
  })
}
function truncate(str, n, useWordBoundary = true) {
  if (str.length <= n) { return str; }
  const subString = str.substr(0, n - 1);
  return (useWordBoundary
    ? subString.substr(0, subString.lastIndexOf(" "))
    : subString) + "&hellip;";
};


function handleWindowControls() {
  const event_type = 'handle-window-controls-main'
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

