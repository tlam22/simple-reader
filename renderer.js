// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.



window.jQuery = window.$ = jQuery;

$(document).ready(function () {
  $('#load').hide();
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

});

function set_up_gallery(gallery){
  if(gallery.length === 0){
    $('#load').hide();
    return "";
  }
  $('#pagination').pagination({
    dataSource: gallery,
    pageSize: 6,
    showGoInput: true,
    showGoButton: true,
    callback: function(data, pagination) {
        // template method of yourself
        var html = load_gallery(data);
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

