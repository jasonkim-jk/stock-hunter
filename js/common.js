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
// to get stock information (close/open/high/low price, change, change rate, etc)
const urlGetStockQuote = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=";
// to get stock information (stock price data of daily time series)
const urlGetStockSeriesData = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=";
// to get stock information (full stock price data of daily time series for 20years)
const urlGetStockSeriesDataFull =
  "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=full&symbol=";
// API key
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
const classChartContainer = "col chart-container";
const idChartContainer = "chart-container";
const idChartContainerModal = "chart-container-modal";
const idChartGraph = "chart-stock";

////////////////////////
// news container
// to get news data related with the selected ticker (https://https://currentsapi.services/)
const newsApiKey = "&apiKey=dL7uU3UkxInFbsr2IQmvu3gs-vZQP_2ipkqjo2_je8cq1xX1";
const urlAllArticlesSearch = "https://api.currentsapi.services/v1/search?language=en&country=us&keywords=";
const urlLatestNews = "https://api.currentsapi.services/v1/latest-news?language=us&country=us";

const classNewsContainer = "card flex-sm-row box-shadow h-150";
const classNewsImg = "card-img-left col-3 flex-auto d-none d-sm-block news-image";
const classNewsContent = "card-body d-sm-flex flex-column align-items-start p-1 pl-2";
const classNewsCategory = "d-inline-block mb-0 text-success";
const classNewsTitle = "mb-0 text-dark";
const classNewsText = "mb-auto card-text";
const classNewsTime = "mb-0 text-muted";

const chartNewsContainer = document.querySelector(".chart-news-container");
const newsContainer = document.querySelector(".news-container");
const chartNewsContainerModal = document.querySelector(".chart-news-container-modal");
const newsContainerModal = document.querySelector(".news-container-modal");
const noImage = "../img/noimage.png";

////////////////////////
// clear previous results
function clearList(element) {
  while (element.firstChild) {
    element.removeChild(element.lastChild);
  }
}

// to get arrow class name
function addArrowClass(gap) {
  return gap >= 0 ? classIArrowUp : classIArrowDown;
}

// to get color class name
function addColorClass(gap) {
  return gap >= 0 ? classStockGreen : classStockRed;
}

// to add 3 digit comma
function addComma(numString) {
  let num = parseFloat(numString);
  return Math.abs(num.toFixed(2).toLocaleString());
}

// to check the current browser size
function checkMobileSize() {
  return $(window).width() < 500 ? true : false;
}

// to check the modal is poped up or not
function checkModal() {
  return $("#stockModal").hasClass("show") ? true : false;
}

// to check window size is changing
$(window).resize(() => {
  let screenSize = $(window).width();
  // medium(md) ~ large(lg), margin +17 of real screen size
  if (screenSize >= 751 && screenSize < 975) {
    $(".stock-logo").hide(800); // remove stock logo image
    $(".media-body").addClass("pl-2");
    $(".news-image").removeClass("d-sm-block");
    $(".news-image").addClass("d-lg-block");
  } else {
    $(".stock-logo").show(800);
    $(".media-body").removeClass("pl-2");
    $(".news-image").addClass("d-sm-block");
    $(".news-image").removeClass("d-lg-block");
  }
});
