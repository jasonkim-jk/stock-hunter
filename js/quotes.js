const urlGetQuote = "https://api.quotable.io/random";
const quote = document.querySelector(".blockquote p");
const author = document.querySelector(".blockquote footer");

function updateQuote() {
  $.getJSON(urlGetQuote, (data) => {
    quote.textContent = data.content;
    author.textContent = "— " + data.author;
    removeAnimatedChildElement(quote, author);
    addAnimationEffect(quote, 1);
    addAnimationEffect(author, 1);
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

function removeAnimatedChildElement(title, author) {
  const quoteText = quote.textContent;
  const quoteAuthor = author.textContent;

  title.addEventListener("animationend", () => {
    clearList(title);
    clearList(quoteAuthor);
    title.textContent = quoteText;
    author.textContent = quoteAuthor;
  });
}
