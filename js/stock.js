const enableUpdateTimer = false;
const useLocalStorage = false;

const urlGetStockQuote = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=";
const stockContainer = document.querySelector(".stock-container");
const defaultStockList = [
  // {
  //   ticker: "SPY",
  //   companyName: "SPDR S&P 500 ETF Trust",
  //   logoUrl: "img/spdr_spy.png",
  // },
  // {
  //   ticker: "QQQ",
  //   companyName: "Invesco QQQ Trust",
  //   logoUrl: "img/invesco_qqq.png",
  // },
  // {
  //   ticker: "DIA",
  //   companyName: "SPDR Dow Jones Industrial Average ETF",
  //   logoUrl: "img/spdr_dia.png",
  // },
];

function addComma(numString) {
  let num = parseFloat(numString);
  return Math.abs(num).toLocaleString("en-US");
}

function addArrowClass(gap) {
  return gap >= 0 ? "fa-long-arrow-alt-up" : "fa-long-arrow-alt-down";
}

function addColorClass(gap) {
  return gap >= 0 ? "stock-green" : "stock-red";
}

function getStockQuoteInfo(ticker, companyName, logoUrl, create = true) {
  $.getJSON(urlGetStockQuote + ticker + stockApiKey, (data) => {
    if (queryDataError(data)) return;

    const changePercent = data["Global Quote"]["10. change percent"];
    const gapValue = parseFloat(changePercent);

    if (create) {
      const divStock = document.createElement("div");
      divStock.className = "media border rounded align-items-center stock-row hvr-grow hvr-underline-reveal";
      divStock.setAttribute("data-name", companyName);
      divStock.setAttribute("data-ticker", ticker);
      divStock.setAttribute("data-url", logoUrl);
      stockContainer.insertBefore(divStock, stockContainer.childNodes[0]);

      const imgLogo = document.createElement("img");
      imgLogo.src = logoUrl == null ? "img/noimage.png" : logoUrl;
      imgLogo.className = "stock-logo rounded mx-2 mx-sm-3";
      imgLogo.id = "logoImg " + companyName;
      imgLogo.alt = companyName;

      const divBody = document.createElement("div");
      divBody.className = "media-body";
      divStock.append(imgLogo, divBody);

      const btnClose = document.createElement("button");
      btnClose.className = "close mr-2";
      btnClose.textContent = "×";

      const stockName = document.createElement("h6");
      stockName.className = "stock-name mb-1";
      stockName.textContent = companyName;

      const iSymbol = document.createElement("i");
      iSymbol.className = "stock-symbol ml-2";
      iSymbol.textContent = `(${data["Global Quote"]["01. symbol"]})`;
      stockName.appendChild(iSymbol);

      const divStockText = document.createElement("div");
      divStockText.className = "text-nowrap";
      divBody.append(btnClose, stockName, divStockText);

      const spanPrice = document.createElement("span");
      spanPrice.className = "stock-price mr-2 font-weight-bold";
      spanPrice.textContent = "$" + addComma(data["Global Quote"]["05. price"]);

      const iArrow = document.createElement("i");
      iArrow.className = "fas stock-arrow m-1";
      iArrow.classList.add(addArrowClass(gapValue), addColorClass(gapValue));

      const spanChange = document.createElement("span");
      spanChange.classList.add("stock-change", "m-1", addColorClass(gapValue));
      spanChange.textContent = "$" + addComma(data["Global Quote"]["09. change"]);

      const spanPercent = document.createElement("span");
      spanPercent.classList.add("stock-percent", "m-1", addColorClass(gapValue));
      spanPercent.textContent = addComma(data["Global Quote"]["10. change percent"]) + "%";
      divStockText.append(spanPrice, iArrow, spanChange, spanPercent);

      if (checkScreenMD()) {
        $(`#logoImg${companyName}`).hide(800);
      }

      addDeleteButton(btnClose);
      addEventListenerForCard(divStock, ticker, companyName, logoUrl);
      makeUpdateTimer(divStock, ticker, companyName);
      saveStockList();
    } else {
      const stockContainer = document.querySelector(`div[data-ticker=${ticker}]`);
      const priceElement = stockContainer.querySelector(".stock-price");
      const arrowElement = stockContainer.querySelector(".stock-arrow");
      const changeElement = stockContainer.querySelector(".stock-change");
      const percentElement = stockContainer.querySelector(".stock-percent");
      priceElement.textContent = "$" + addComma(data["Global Quote"]["05. price"]);
      arrowElement.classList.remove("fa-long-arrow-alt-up", "fa-long-arrow-alt-down", "stock-green", "stock-red");
      arrowElement.classList.add(addArrowClass(gapValue), addColorClass(gapValue));
      changeElement.textContent = "$" + addComma(data["Global Quote"]["09. change"]);
      changeElement.classList.remove("stock-green", "stock-red");
      changeElement.classList.add(addColorClass(gapValue));
      percentElement.textContent = addComma(data["Global Quote"]["10. change percent"]) + "%";
      percentElement.classList.remove("stock-green", "stock-red");
      percentElement.classList.add(addColorClass(gapValue));
    }
  }).fail((jqxhr, textStatus, error) => {
    console.error(textStatus + ", " + error);
  });
}

function addDeleteButton(element) {
  element.addEventListener("click", (event) => {
    saveStockList();
    event.target.parentNode.parentNode.style.zIndex = 0;
    event.target.parentNode.parentNode.classList.add("stock-remove");
    setTimeout(() => {
      event.target.parentNode.parentNode.remove();
    }, 1000);

    const timerID = event.target.parentNode.parentNode.getAttribute("data-timer-id");
    clearInterval(timerID);
  });
}

function addEventListenerForCard(element, ticker, company, url) {
  element.addEventListener("click", (event) => {
    if (event.target.className === "close") return;

    if (checkModalCondition()) {
      event.target.style.zIndex = 0;
      $("#myModalLabel").text(company);
      $("#myModalLabel").attr("data-ticker", ticker);
      $("#myModalLabel").attr("data-logoUrl", url);
      $("#stockModal").modal();
    } else if (checkScreenMoreThanMD()) {
      getNews(company);
      drawStockChart(ticker, company, "chart-container-modal", "chart-stock");
    }
  });
}

function updateStockPriceInfo(ticker, companyName) {
  getStockQuoteInfo(ticker, companyName, false, false);
}

function stockMarketHour() {
  if (!enableUpdateTimer) return;

  const current = new Date();
  const currTime = current.getHours();

  if (currTime >= 6 && currTime <= 11) {
    return true;
  } else {
    return false;
  }
}

function makeUpdateTimer(element, ticker, companyName) {
  const timerID = setInterval(() => {
    if (stockMarketHour()) updateStockPriceInfo(ticker, companyName);
  }, 60000);
  element.setAttribute("data-timer-id", timerID);
}

function getDefaultStock(defaultStock) {
  const savedList = loadStockList();

  if (savedList !== null) {
    defaultStock = savedList;
  }

  for (let i = 0; i < defaultStock.length; i++) {
    getStockQuoteInfo(defaultStock[i].ticker, defaultStock[i].companyName, defaultStock[i].logoUrl);
  }
}

function saveStockList() {
  if (!useLocalStorage) return;

  const element = document.querySelector(".stock-container");
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

function loadStockList() {
  if (useLocalStorage && window.localStorage) {
    return JSON.parse(localStorage.getItem("stocks"));
  } else {
    return null;
  }
}

getDefaultStock(defaultStockList);
