// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.



window.jQuery = window.$ = jQuery;

$(document).ready(function () {
  $('#load').hide();
  $("#load-header").load("./header/header.html", function(){
    $("#window-title span").text("Simple Reader");
  });

  document.getElementById('dirs').addEventListener('click', (evt) => {
    evt.preventDefault()
    $('#load').show();
    window.postMessage({
      type: 'select-dirs',
    })
  })


  window.addEventListener('message', evt => {
    if (evt.data.type === 'load-ui-gallery') {
      set_up_gallery(evt.data.value)
    }
  })

  $('div.search-container button').click(function(){
    if(gallery_ref.length === 0){
      return;
    }
    const query = $('div.search-container input').val();
    const tag = ($('#tags-select').find(':selected').val() || "")
    let filtered = gallery_ref.filter(x => x.title && x.title.toLowerCase().includes(query.toLowerCase()) && x.title.toLowerCase().includes(tag.toLowerCase()));
    $('#pagination').pagination({
      dataSource: filtered,
      pageSize: 6,
      showGoInput: true,
      showGoButton: true,
      callback: function(data, pagination) {
          let html = load_gallery(data);
          $('#g').html(html);
          $("div.gallery").click(function() {
            let image = $(this).find("img");
            let title = $(image).attr("title");
            let targets = gallery_ref.find(x => x.title === title);
            open_viewer_window({title: targets.title,images: targets.files});
          })
          $('#load').hide();
      }
    })
  })


  $("div.search-container input").on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        $('div.search-container button').trigger( "click" );
    }
  });

  init_tagsDropDown();

});
let gallery_ref = [];
function set_up_gallery(gallery){
  if(gallery.length === 0){
    $('#load').hide();
    return "";
  }
  gallery_ref = gallery;
  $('#pagination').pagination({
    dataSource: gallery,
    pageSize: 6,
    showGoInput: true,
    showGoButton: true,
    callback: function(data, pagination) {
        let html = load_gallery(data);
        $('#g').html(html);
        $("div.gallery").click(function() {
          let image = $(this).find("img");
          let title = $(image).attr("title");
          let targets = gallery.find(x => x.title === title);
          open_viewer_window({title: targets.title,images: targets.files});
        })
        $('#load').hide();
    }
  })
  generate_new_dropDownItems(gallery);
  document.onkeydown = checkArrowKeys;
}

function generate_new_dropDownItems(gallery){
  $('#tags-select').val(null).empty().trigger('change');
  const emptyOption = new Option("", "", false, false);
  $('#tags-select').append(emptyOption).trigger('change');
  for (const obj of gallery) {
    if(obj.tag !== "" && !$('#tags-select').find("option[value='" + obj.tag.toLowerCase() + "']").length){
      const  newOption = new Option(obj.tag, obj.tag.toLowerCase(), false, false);
      $('#tags-select').append(newOption).trigger('change');
    }
  }  
}

function init_tagsDropDown(){
  $('#tags-select').select2({
    placeholder: 'Filter by tag',
    width: "178",
    allowClear: true
  });

  $('#tags-select').on('select2:clear', function (e) {
    $('div.search-container button').trigger( "click" );
  });

  $('#tags-select').on('select2:select', function (e) {
    $('div.search-container button').trigger( "click" );
  });

}


function checkArrowKeys(e) {

  e = e || window.event;

  /*if (e.keyCode == '38') {
      // up arrow
  }
  else if (e.keyCode == '40') {
      // down arrow
  }*/
  if (e.keyCode == '37') {
     // left arrow
     $( "li.paginationjs-prev.J-paginationjs-previous" ).trigger( "click" );
  }
  else if (e.keyCode == '39') {
      // right arrow
      $( "li.paginationjs-next.J-paginationjs-next" ).trigger( "click" );
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




function open_viewer_window(targets){
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

