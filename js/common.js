////////////////////////
// header container
// to get random quotes
const urlGetQuote = "https://api.quotable.io/random";

const quote = document.querySelector(".blockquote p");
const author = document.querySelector(".blockquote footer");
const companyList = document.querySelector(".company-data");
const inputTxt = $("#input-company");


////////////////////////
// stock container
// to get company's logo and domain information from the input text (https://clearbit.com/docs?ruby#autocomplete-api)
const urlGetCompanyLogoName = "https://autocomplete.clearbit.com/v1/companies/suggest?query=";

// to get stock tickers from company names
const urlGetStockTickerFromName = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=";
const urlGetStockQuote = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=";
const stockApiKey = "&apikey=EGJSU5WH1WOOPPAF";

// class of each element for css styling and bootstrap
const classDivMedia = "media border border-light rounded stock-row";
const classImgLogo = "stock-logo rounded";
const classDivBody = "media-body";
const classBtnClose = "close";
const classH2Name = "stock-name";
const classIStockSymbol = "stock-symbol";
const classDivStockText = "text-nowrap";
const classDivStockChange = "stock-change-container";
const classSpanStockPrice = "stock-price";
const classSpanStockChange = "stock-change";
const classSpanStockPercent = "stock-percent";
const classStockGreen = "stock-green";
const classStockRed = "stock-red";
const classIArrowDefault = "fas stock-arrow";
const classIArrowUp = "fa-long-arrow-alt-up";
const classIArrowDown = "fa-long-arrow-alt-down";

const stockContainer = document.querySelector(".stock-container");
const defaultStockList = [
  { ticker: "AMZN", companyName: "Amazon", logoUrl: "https://logo.clearbit.com/amazon.com" },
  // { ticker: "TSLA", companyName: "Tesla", logoUrl: "https://logo.clearbit.com/tesla.com" },
  // { ticker: "GOOGL", companyName: "Alphabet", logoUrl: "https://logo.clearbit.com/abc.xyz" },
];

////////////////////////
// chart container


////////////////////////
// news container


// clear previous results
function clearList(element) {
  while (element.firstChild) {
    element.removeChild(element.lastChild);
  }
}
