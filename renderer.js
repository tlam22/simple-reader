// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.



window.jQuery = window.$ = jQuery;

$(document).ready(function () {
  console.log("jQuery is loaded");

  document.getElementById('dirs').addEventListener('click', (evt) => {
    evt.preventDefault()
    window.postMessage({
      type: 'select-dirs',
    })
  })


  window.addEventListener('message', evt => {
    if (evt.data.type === 'load-ui-gallery') {
      console.log(evt.data.value)
      load_gallery(evt.data.value)
    }
  })

});

function load_gallery(gallery) {
  let output = "";
  for (const title in gallery) {
    if (gallery[title].length) {
      output += `<div class="gallery">`;
      output += `<img src="file://${gallery[title][0]}" alt="${title}" title="${title}">`;
      output += `<div class="desc">${truncate(title, 80)}</div>`;
      output += `</div>`;
    }
  }
  $("#g").html(output);
  $("div.gallery").click(function() {
    let image = $(this).find("img");
    let title = $(image).attr("title");
    let targets = gallery[title];
    open_viewer_window(targets);
  })
}

function open_viewer_window(targets){
  window.postMessage({
    type: 'load-view-child-window',
    value: targets
  })
}
function truncate(str, n, useWordBoundary = true) {
  if (str.length <= n) { return str; }
  const subString = str.substr(0, n - 1); // the original check
  return (useWordBoundary
    ? subString.substr(0, subString.lastIndexOf(" "))
    : subString) + "&hellip;";
};

