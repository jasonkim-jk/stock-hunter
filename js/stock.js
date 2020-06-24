// after getting stock info from API server, make a stock card and show them on the card
function getStockQuoteInfo(ticker, companyName, logoUrl, create = true) {
  $.getJSON(urlGetStockQuote + ticker + stockApiKey, (data) => {
    console.dir(data);
    const changePercent = data["Global Quote"]["10. change percent"];
    if (!changePercent) {
      alert("[Error] Stock data error from server");
      return;
    }

    const gapValue = parseFloat(changePercent);

    if (create) {
      const divStock = document.createElement("div");
      divStock.className = classDivMedia;
      divStock.setAttribute("data-name", companyName);
      divStock.setAttribute("data-ticker", ticker);
      // stockContainer.appendChild(divStock);  // add as the last child
      stockContainer.insertBefore(divStock, stockContainer.childNodes[0]); // add as the first child

      // logo image
      const imgLogo = document.createElement("img");
      imgLogo.src = logoUrl == null ? noImage : logoUrl;
      imgLogo.className = classImgLogo;
      imgLogo.id = "logoImg" + companyName;
      imgLogo.alt = "Logo image of " + companyName;

      // Company name
      const divBody = document.createElement("div");
      divBody.className = classDivBody;
      divStock.append(imgLogo, divBody);

      // Close button
      const btnClose = document.createElement("button");
      btnClose.className = classBtnClose;
      btnClose.textContent = "×";

      // Company name
      const h2Name = document.createElement("h2");
      h2Name.className = classH2Name;
      h2Name.textContent = companyName;

      const iSymbol = document.createElement("i");
      iSymbol.className = classIStockSymbol;
      iSymbol.textContent = `(${data["Global Quote"]["01. symbol"]})`;
      h2Name.appendChild(iSymbol);

      const divStockText = document.createElement("div");
      divStockText.className = classDivStockText;
      divBody.append(btnClose, h2Name, divStockText);

      const spanPrice = document.createElement("span");
      spanPrice.className = classSpanStockPrice;
      spanPrice.textContent = "$" + addComma(data["Global Quote"]["05. price"]);

      const iArrow = document.createElement("i");
      iArrow.className = classIArrowDefault;
      iArrow.classList.add(addArrowClass(gapValue), addColorClass(gapValue));

      const spanChange = document.createElement("span");
      spanChange.classList.add(classSpanStockChange, addColorClass(gapValue));
      spanChange.textContent = "$" + addComma(data["Global Quote"]["09. change"]);

      const spanPercent = document.createElement("span");
      spanPercent.classList.add(classSpanStockPercent, addColorClass(gapValue));
      spanPercent.textContent = addComma(data["Global Quote"]["10. change percent"]) + "%";
      divStockText.append(spanPrice, iArrow, spanChange, spanPercent);

      if (checkScreenMD()) {
        $(`#logoImg${companyName}`).hide(800);
      }

      // to delete the selected ticker
      addDeleteButton(btnClose);

      // a stock card is clicked, open a modal when mobile size or update other information
      addEventListenerForCart(divStock, ticker, companyName, logoUrl);

      // update stock info. every 1 minute
      makeUpdateTimer(divStock, ticker, companyName);
    } else {
      // update the previous stock price info
      const stockContainer = document.querySelector(`div[data-ticker=${ticker}]`);
      const priceElement = stockContainer.querySelector(".stock-price");
      const arrowElement = stockContainer.querySelector(".stock-arrow");
      const changeElement = stockContainer.querySelector(".stock-change");
      const percentElement = stockContainer.querySelector(".stock-percent");
      priceElement.textContent = "$" + addComma(data["Global Quote"]["05. price"]);
      arrowElement.classList.remove(classIArrowUp, classIArrowDown, classStockGreen, classStockRed);
      arrowElement.classList.add(addArrowClass(gapValue), addColorClass(gapValue));
      changeElement.textContent = "$" + addComma(data["Global Quote"]["09. change"]);
      changeElement.classList.remove(classStockGreen, classStockRed);
      changeElement.classList.add(addColorClass(gapValue));
      percentElement.textContent = addComma(data["Global Quote"]["10. change percent"]) + "%";
      percentElement.classList.remove(classStockGreen, classStockRed);
      percentElement.classList.add(addColorClass(gapValue));
    }
  }).fail((jqxhr, textStatus, error) => {
    console.error(textStatus + ", " + error);
  });
}

// to delete the selected ticker
function addDeleteButton(element) {
  element.addEventListener("click", (event) => {
    event.target.parentNode.parentNode.remove();

    // delete update timer id
    const timerID = event.target.parentNode.parentNode.getAttribute("data-timer-id");
    clearInterval(timerID);
  });
}

// a stock card is clicked, open a modal when mobile size or update other information
function addEventListenerForCart(element, ticker, company, url) {
  element.addEventListener("click", (event) => {
    if (checkMobileSize()) {
      $("#myModalLabel").text(company);
      $("#myModalLabel").attr("data-ticker", ticker);
      $("#myModalLabel").attr("data-logoUrl", url);
      $("#stockModal").modal();
    } else if (checkScreenMoreThanMD()) {
      getNews(company);
      drawStockChart(ticker, company, idChartContainer, idChartGraph);
    }
  });
}

// to update stock price to the lasted one
function updateStockPriceInfo(ticker, companyName) {
  getStockQuoteInfo(ticker, companyName, false, false);
}

// to update stock price every minute
function makeUpdateTimer(element, ticker, companyName) {
  const timerID = setInterval(() => {
    console.log("update test");
    updateStockPriceInfo(ticker, companyName);
  }, 60000);
  element.setAttribute("data-timer-id", timerID);
}

// to add default stock cards
function getDefaultStock(defaultStock) {
  for (let i = 0; i < defaultStock.length; i++) {
    getStockQuoteInfo(defaultStock[i].ticker, defaultStock[i].companyName, defaultStock[i].logoUrl);
  }
}

getDefaultStock(defaultStockList);
