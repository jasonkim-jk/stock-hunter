//Make the DIV element draggagle:
dragElement(document.querySelector("#div-youtube"));

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.querySelector(elmnt.id + "-header")) {
    /* if present, the header is where you move the DIV from:*/
    document.querySelector(elmnt.id + "-header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// to adjust the youtube container's position to the right-bottom
document.querySelector("#youtube-origin").addEventListener("click", (e) => {
  youtubeContainer.removeAttribute("style");
  youtubeContainer.style.bottom = 0;
  youtubeContainer.style.right = 0;
  youtubeContainer.style.width = "300px";
  youtubeContainer.style.height = "190px";
  document.querySelector(".youtube-content iframe").style.height = "150px";
});

// to adjust the youtube container's size
document.querySelector("#youtube-size").addEventListener("click", (e) => {
  console.log("eee: ", e.target);
  if (youtubeContainer.offsetWidth === 300) {
    youtubeContainer.style.width = "500px";
    youtubeContainer.style.height = "290px";
    document.querySelector(".youtube-content iframe").style.height = "250px";
  } else {
    youtubeContainer.style.width = "300px";
    youtubeContainer.style.height = "190px";
    document.querySelector(".youtube-content iframe").style.height = "150px";
  }
});

// to determine showing or not
function hideYoutubeContainer(value) {
  if (value === true) {
    youtubeContainer.style.display = "none";
  } else {
    youtubeContainer.style.display = "block";
  }
}

hideYoutubeContainer(isMobile());
