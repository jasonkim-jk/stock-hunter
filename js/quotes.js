// update random quote
function updateQuote() {
  $.getJSON(urlGetQuote, (data) => {
    quote.textContent = data.content;
    author.textContent = "— " + data.author;
    addAnimationEffect(quote, 3);
    addAnimationEffect(author, 3);
  }).fail((jqxhr, textStatus, error) => {
    console.error(textStatus + ", " + error);
  });
}

function addAnimationEffect(element, delaySec) {
  let newDom = "";

  for (let i = 0; i < element.innerText.length; i++) {
    newDom += '<span class="char">' + (element.innerText[i] == " " ? "&nbsp;" : element.innerText[i]) + "</span>";
  }
  element.innerHTML = newDom;

  for (let i = 0; i < element.children.length; i++) {
    element.children[i].style["animation-delay"] = delaySec * i + "ms";
  }
}
