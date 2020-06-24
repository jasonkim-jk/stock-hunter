// after getting stock info from API server, make a stock card and show them on the card
function getStockQuoteInfo(ticker, companyName, logoUrl) {
  $.getJSON(urlGetStockQuote + ticker + stockApiKey, (data) => {
    // console.table(data);
    const changePercent = data["Global Quote"]["10. change percent"];
    if (!changePercent) {
      alert("Data error from server");
      return;
    }

    const gapValue = parseFloat(changePercent);

    const divStock = document.createElement("div");
    divStock.className = classDivMedia;
    // stockContainer.appendChild(divStock);  // add as the last child
    stockContainer.insertBefore(divStock, stockContainer.childNodes[0]); // add as the first child

    // logo image
    const imgLogo = document.createElement("img");
    imgLogo.src = logoUrl;
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
    btnClose.addEventListener("click", (event) => {
      event.target.parentNode.parentNode.remove();
    });

    divStock.addEventListener("click", (event) => {
      if (checkMobileSize()) {
        $("#myModalLabel").text(companyName);
        $("#myModalLabel").attr("data-ticker", ticker);
        $("#myModalLabel").attr("data-logoUrl", logoUrl);
        $("#stockModal").modal();
      }
    });
  }).fail((jqxhr, textStatus, error) => {
    console.error(textStatus + ", " + error);
  });
}

// to add default stock cards
function getDefaultStock(defaultStock) {
  for (let i = 0; i < defaultStock.length; i++) {
    getStockQuoteInfo(defaultStock[i].ticker, defaultStock[i].companyName, defaultStock[i].logoUrl);
  }
}

getDefaultStock(defaultStockList);
