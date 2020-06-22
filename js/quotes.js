const quote = document.querySelector(".blockquote p");
const author = document.querySelector(".blockquote footer");

// update random quote
function updateQuote() {
  $.getJSON(urlGetQuote, (data) => {
    quote.textContent = data.content;
    author.textContent = data.author;
  }).fail((jqxhr, textStatus, error) => {
    console.error(textStatus + ", " + error);
  });
}
