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
      company.setAttribute("data-cname", data[i].name);
      companyLogoImg.setAttribute("src", data[i].logo);
      companyLogoImg.className = "company-logo align-middle";
      companyName.textContent = data[i].name;
      companyName.className = "align-middle font-weight-bold";
      companyDomain.textContent = ` (${data[i].domain})`;
      companyDomain.className = "align-middle";
      company.append(companyLogoImg, companyName, companyDomain);
      companyList.appendChild(company);

      // to get which row(company) is selected
      company.addEventListener("click", (event) => {
        const selectedCompany = event.currentTarget.getAttribute("data-cname");
        const logoUrl = event.currentTarget.firstChild.src;
        getTickerName(selectedCompany, logoUrl);
        clearList(companyList);
        inputTxt.val("");
        if (!checkMobileSize()) getNews(selectedCompany);
      });
    }
  }).fail((jqxhr, textStatus, error) => {
    console.error(textStatus + ", " + error);
  });
});

// get a stock ticker from a company name
function getTickerName(name, logoUrl) {
  if (!name) {
    alert("[Error] Company name data error~!");
    return;
  }

  $.getJSON(urlGetStockTickerFromName + name + stockApiKey, (data) => {
    // console.table(data);
    for (let i = 0; i < data.bestMatches.length && i < 5; i++) {
      const company = document.createElement("div");
      const ticker = document.createElement("span");
      const companyName = document.createElement("span");

      ticker.textContent = data.bestMatches[i]["1. symbol"];
      ticker.className = "align-middle font-weight-bold";
      company.setAttribute("data-ticker", ticker.textContent);
      company.className = "pl-3 company";
      companyName.textContent = ` (${data.bestMatches[i]["2. name"]}, ${data.bestMatches[i]["9. matchScore"]})`;
      companyName.className = "align-middle";

      company.append(ticker, companyName);
      companyList.appendChild(company);

      // to get which row(ticker) is selected
      company.addEventListener("click", (event) => {
        tickerName = event.currentTarget.getAttribute("data-ticker");
        // console.log("Ticker: ", tickerName);
        clearList(companyList);
        getStockQuoteInfo(tickerName, name, logoUrl);
        if (!checkMobileSize()) drawStockChart(tickerName, name, idChartContainer, idChartGraph);
        updateQuote();
      });
    }
  }).fail((jqxhr, textStatus, error) => {
    console.error(textStatus + ", " + error);
  });
}
