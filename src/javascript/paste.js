const BASE_PATH = document.getElementById('js_base_path').innerHTML;
const BASE_PATH_ID = document.getElementById('js_base_path_id').innerHTML;
const EXT = document.getElementById('js_ext').innerHTML;

document.addEventListener('keydown', onKey);

function onKey(e) {
  if (e.key == 'n') {
    window.location.href = BASE_PATH;
  }
  else if (e.key == 'r') {
    window.location.href = `${BASE_PATH_ID}?fmt=raw`;
  }
  else if (e.key == 'y') {
    navigator.clipboard.writeText(window.location.href);
  }
  else if (e.key == 'd') {
    window.location.href = `${BASE_PATH_ID}?dl=${EXT}`;
  }
  else if (e.key == 'q') {
    window.location.href = `${BASE_PATH_ID}?fmt=qr`;
  }
  else if (e.key == 'p') {
    window.location.href = `${BASE_PATH_ID}`;
  }
  else if (e.key == '?') {
    var overlay = document.getElementById("overlay");

    overlay.style.display = overlay.style.display != "block" ? "block" : "none";
    overlay.onclick = function() {
      if (overlay.style.display == "block") {
        overlay.style.display = "none";
      }
    };
  }

  if (e.keyCode == 27) {
    var overlay = document.getElementById("overlay");

    if (overlay.style.display == "block") {
      overlay.style.display = "none";
    }
  }
}

function fixupLinks() {
  while (true) {
    const o = document.querySelector("span.link");
    if (!o) {
      break;
    }
    let l = o.nextSibling;
    let link = o.innerHTML;
    while(l != null && l.tagName == "SPAN" && l.classList.contains("link")) {
      let prevL = l;
      l = l.nextSibling;
      link += prevL.innerText;
      prevL.remove();
    }
    o.setAttribute("href", link);
    o.innerText = link;
     o.className = "";
    o.outerHTML = o.outerHTML.replace(/^<span(.*)span>$/, "<a$1a>");
  }
}

document.addEventListener("DOMContentLoaded", fixupLinks);
