// event listner of search button
document.querySelector("#btn-search").addEventListener("click", updateQuote);

// event listener of the input text using jQuery
inputTxt.keydown((event) => {
  let inputCompanyName = inputTxt.val();
  let key = event.keyCode || event.charCode;

  // to handle backspace and delete keys
  if (key === 8 || key === 46) {
    if (!inputCompanyName) {
      clearList(companyList);
      return;
    }
  }
  // to handle enter key or arrow down
  if (key === 13 || key === 40) {
    document.querySelector(".company").click();
    return;
  }

  inputCompanyName += event.key;

  // get JSON data from open-API with company names
  $.getJSON(urlGetCompanyLogoName + inputCompanyName, (data) => {
    clearList(companyList);

    for (let i = 0; i < data.length; i++) {
      const company = document.createElement("div");
      const companyLogoImg = document.createElement("img");
      const companyName = document.createElement("span");
      const companyDomain = document.createElement("span");

      company.className = "company";
      company.setAttribute("data-set", data[i].name);
      companyLogoImg.setAttribute("src", data[i].logo);
      companyLogoImg.className = "company-logo";
      companyName.textContent = data[i].name;
      companyDomain.textContent = ` (${data[i].domain})`;
      company.append(companyLogoImg, companyName, companyDomain);
      companyList.appendChild(company);

      // to get which row(company) is selected
      company.addEventListener("click", (event) => {
        const selectedCompany = event.currentTarget.getAttribute("data-set");
        const logoUrl = event.currentTarget.firstChild.src;
        getTickerName(selectedCompany, logoUrl);
        clearList(companyList);
        inputTxt.val("");
        updateQuote();
      });
    }
  }).fail((jqxhr, textStatus, error) => {
    console.error(textStatus + ", " + error);
  });
});

// get a stock ticker from a company name
function getTickerName(name, logoUrl) {
  if (!name) {
    alert("Company name error~!");
    return;
  }

  $.getJSON(urlGetStockTickerFromName + name + stockApiKey, (data) => {
    // console.table(data);
    for (let i = 0; i < data.bestMatches.length && i < 5; i++) {
      const company = document.createElement("div");
      const ticker = document.createElement("span");
      const companyName = document.createElement("span");

      ticker.textContent = data.bestMatches[i]["1. symbol"];
      company.setAttribute("data-set", ticker.textContent);
      company.className = "pl-3";
      companyName.textContent = ` (${data.bestMatches[i]["2. name"]}, ${data.bestMatches[i]["9. matchScore"]})`;

      company.append(ticker, companyName);
      companyList.appendChild(company);

      // to get which row(ticker) is selected
      company.addEventListener("click", (event) => {
        tickerName = event.currentTarget.getAttribute("data-set");
        // console.log("Ticker: ", tickerName);
        clearList(companyList);
        getStockQuoteInfo(tickerName, name, logoUrl);
        drawStockChart(tickerName, name);
      });
    }
  }).fail((jqxhr, textStatus, error) => {
    console.error(textStatus + ", " + error);
  });
}
