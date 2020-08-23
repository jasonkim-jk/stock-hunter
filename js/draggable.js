dragElement(document.querySelector("#div-youtube"));

function dragElement(element) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  if (document.querySelector(element.id + "-header")) {
    document.querySelector(element.id + "-header").onmousedown = dragMouseDown;
  } else {
    element.onmousedown = dragMouseDown;
  }

  function dragMouseDown(event) {
    event = event || window.event;
    event.preventDefault();
    pos3 = event.clientX;
    pos4 = event.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(event) {
    event = event || window.event;
    event.preventDefault();
    pos1 = pos3 - event.clientX;
    pos2 = pos4 - event.clientY;
    pos3 = event.clientX;
    pos4 = event.clientY;
    element.style.top = element.offsetTop - pos2 + "px";
    element.style.left = element.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

const youtubeContainer = document.querySelector("#div-youtube");
document.querySelector("#youtube-origin").addEventListener("click", () => {
  youtubeContainer.removeAttribute("style");
  youtubeContainer.style.bottom = 0;
  youtubeContainer.style.right = 0;
  youtubeContainer.style.width = "300px";
  youtubeContainer.style.height = "190px";
  document.querySelector(".youtube-content iframe").style.height = "150px";
});

document.querySelector("#youtube-size").addEventListener("click", () => {
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

function hideYoutubeContainer(value) {
  if (value) {
    youtubeContainer.style.display = "none";
  } else {
    youtubeContainer.style.display = "block";
  }
}

hideYoutubeContainer(isMobile());
