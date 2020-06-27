////////////////////////
// Feature set
const enableUpdateTimer = false;
const useLocalStorage = true;
const useTimeSeriesChart = true;

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
// API key
const stockApiKey = "&apikey=EGJSU5WH1WOOPPAF";
// to get company's logo and domain information from the input text (https://clearbit.com/docs?ruby#autocomplete-api)
const urlGetCompanyLogoName = "https://autocomplete.clearbit.com/v1/companies/suggest?query=";
// to get stock tickers from company names
const urlGetStockTickerFromName = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=";
// to get stock information (close/open/high/low price, change, change rate, etc)
const urlGetStockQuote = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=";
// to get stock information (stock price data of time series)
const urlGetStockSeriesData1m =
  "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&interval=1min&outputsize=full&symbol=";
const urlGetStockSeriesData5m =
  "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&interval=5min&outputsize=full&symbol=";
const urlGetStockSeriesData15m =
  "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&interval=15min&outputsize=full&symbol=";
const urlGetStockSeriesData30m =
  "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&interval=30min&outputsize=full&symbol=";
const urlGetStockSeriesData60m =
  "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&interval=60min&outputsize=full&symbol=";
const urlGetStockSeriesData1D = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=";
const urlGetStockSeriesData1DFull =
  "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=full&symbol=";
const urlGetStockSeriesData1w = "https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=";
const urlGetStockSeriesData1mon = "https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=";

// class of each element for css styling and bootstrap
const classDivMedia = "media border rounded align-items-center stock-row hvr-grow";
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
  { ticker: "TSLA", companyName: "Tesla", logoUrl: "https://logo.clearbit.com/tesla.com" },
  // { ticker: "GOOGL", companyName: "Alphabet", logoUrl: "https://logo.clearbit.com/abc.xyz" },
];

////////////////////////
// chart container
const classChartContainer = "col chart-container";
const idChartContainer = "chart-container";
const idChartContainerModal = "chart-container-modal";
const idChartGraph = "chart-stock";

const classStockButtonContainer = "stock-button-container pl-1";
const classStockTimeSeries = "stock-time btn btn-info btn-sm m-1";
const classStockInterval1m = "interval-1m";
const classStockInterval5m = "interval-5m";
const classStockInterval15m = "interval-15m";
const classStockInterval30m = "interval-30m";
const classStockInterval60m = "interval-60m";
const classStockInterval1D = "interval-1d";
const classStockInterval1DF = "interval-1d-full";
const classStockInterval1W = "interval-1w";
const classStockInterval1Mon = "interval-1mon";

////////////////////////
// news container
// to get news data related with the selected ticker (https://https://currentsapi.services/)
const newsApiKey = "&apiKey=dL7uU3UkxInFbsr2IQmvu3gs-vZQP_2ipkqjo2_je8cq1xX1";
const urlAllArticlesSearch = "https://api.currentsapi.services/v1/search?language=en&country=us&keywords=";
const urlLatestNews = "https://api.currentsapi.services/v1/latest-news?language=us&country=us";

const classNewsContainer = "card flex-sm-row box-shadow h-150 hvr-underline-reveal";
const classNewsImg = "card-img-left col-3 flex-auto d-sm-block news-image";
const classNewsContent = "card-body d-sm-flex flex-column align-items-start p-1 pl-2";
const classNewsCategory = "d-inline-block mb-0 text-success";
const classNewsTitle = "mb-0 text-dark";
const classNewsText = "mb-auto card-text";
const classNewsTime = "mb-0 text-muted";

const chartNewsContainer = document.querySelector(".chart-news-container");
const newsContainer = document.querySelector(".news-container");
const chartNewsContainerModal = document.querySelector(".chart-news-container-modal");
const newsContainerModal = document.querySelector(".news-container-modal");
const noImage = "img/noimage.png";
const noLogoImage = "img/logo_notfound.png";

////////////////////////
// clear previous results
function clearList(element) {
  while (element.firstChild) {
    element.removeChild(element.lastChild);
  }
}

// in case of 403 error while loading image, the default image will is displayed
window.addEventListener(
  "error",
  windowErrorCb,
  {
    capture: true,
  },
  true
);

function windowErrorCb(event) {
  let target = event.target;
  let isImg = target.tagName.toLowerCase() === "img";
  if (isImg) {
    imgErrorCb();
    return;
  }

  function imgErrorCb() {
    let isImgErrorHandled = target.hasAttribute("data-src-error");
    if (!isImgErrorHandled) {
      target.setAttribute("data-src-error", "handled");
      target.src = noLogoImage;
    }
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
  return Math.abs(num).toLocaleString("en-US");
}

// to check the current browser size
function checkMobileSize() {
  return $(window).width() < 500;
}

// to check the modal is poped up or not
function checkModal() {
  return $("#stockModal").hasClass("show");
}

function checkScreenXS() {
  let screenSize = $(window).width();
  return screenSize <= 559;
}

function checkScreenSM() {
  let screenSize = $(window).width();
  return screenSize >= 559 && screenSize < 751;
}

function checkScreenMD() {
  let screenSize = $(window).width();
  return screenSize >= 751 && screenSize < 975;
}

function checkScreenMoreThanMD() {
  let screenSize = $(window).width();
  return screenSize >= 751;
}

function checkScreenRotated() {
  let angle = screen.orientation.angle;
  return angle === 90 || angle === 270;
}

function checkModalCondition() {
  return checkMobileSize() || (checkScreenRotated() && checkScreenSM());
}

// Regular trading hours for the U.S. stock market is 9:30 a.m. to 4 p.m
function stockMarketHour() {
  if (!enableUpdateTimer) return;

  const current = new Date();
  const currTime = current.getHours();

  if (currTime >= 6 && currTime <= 11) {
    // console.log("Stock market is running");
    return true;
  } else {
    // console.log("Stock market is closed: ", currTime);
    return false;
  }
}

// to check window size is changing
$(window).resize(() => {
  // medium(md) ~ large(lg), margin +17 of real screen size
  if (checkScreenMD()) {
    $(".stock-logo").hide(600); // remove stock logo image
    $(".news-image").hide(600); // remove stock logo image
    $(".media-body").addClass("pl-2");
    $(".news-image").removeClass("d-sm-block");
    $(".news-image").addClass("d-lg-block");
  } else if (checkScreenXS()) {
    $(".news-image").hide(600); // remove stock logo image
  } else {
    $(".stock-logo").show(600);
    $(".news-image").show(600); // remove stock logo image
    $(".media-body").removeClass("pl-2");
    $(".news-image").addClass("d-sm-block");
    $(".news-image").removeClass("d-lg-block");
  }
});

// to check screen orientation to reload modal
$(window).on("orientationchange", () => {
  if ($("#stockModal").hasClass("show")) {
    // $("#stockModal").modal("handleUpdate");
  }
});

// to save current stock cards list
function saveStockList() {
  if (!useLocalStorage) return;

  const element = stockContainer;
  let list = [];

  for (let i = 0; i < element.children.length; i++) {
    let stock = { ticker: "", companyName: "", logoUrl: "" };
    stock.ticker = element.children[i].dataset.ticker;
    stock.companyName = element.children[i].dataset.name;
    stock.logoUrl = element.children[i].dataset.url;
    list.push(stock);
  }

  localStorage.setItem("stocks", JSON.stringify(list));
}

// to get saved stock cards list
function loadStockList() {
  if (useLocalStorage && window.localStorage) {
    console.log("Saved stock cards information loaded~!");
    return JSON.parse(localStorage.getItem("stocks"));
  } else {
    console.log("localStorage loading failed");
    return null;
  }
}

// to remove autocomplete when clicked the X button
$("#input-company").on("click", function () {
  $("#input-company").on("search", function () {
    if (!this.value) {
      clearList(companyList);
    }
  });
  setTimeout(function () {
    $("#input-company").off("search");
  }, 1);
});
