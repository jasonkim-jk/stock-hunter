// to get random quotes
const urlGetQuote = "https://api.quotable.io/random";

// to get company's logo and domain information from the input text (https://clearbit.com/docs?ruby#autocomplete-api)
const urlGetCompanyLogoName = "https://autocomplete.clearbit.com/v1/companies/suggest?query=";

// to get stock tickers from company names
const urlGetStockTickerFromName = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=";
const stockApiKey = "&apikey=EGJSU5WH1WOOPPAF";

const quote = document.querySelector(".blockquote p");
const author = document.querySelector(".blockquote footer");
const inputTxt = $("#input-company");
const companyList = document.querySelector(".company-data");

// clear previous results
function clearList(element) {
  while (element.firstChild) {
    element.removeChild(element.lastChild);
  }
}
