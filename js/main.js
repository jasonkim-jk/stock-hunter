const urlGetCompanyLogoName = "https://autocomplete.clearbit.com/v1/companies/suggest?query=";
const urlGetStockTickerFromName = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=";
const companyList = document.querySelector(".company-data");

document.querySelector("#btn-search").addEventListener("click", updateQuote);

$("#input-company").keydown((event) => {
  let inputCompanyName = $("#input-company").val();
  let key = event.keyCode || event.charCode;

  if (key === 8 || key === 46) {
    if (!inputCompanyName) {
      clearList(companyList);
      return;
    }
  }

  if (key === 13 || key === 40) {
    document.querySelector(".company").click();
    return;
  }

  inputCompanyName += event.key;

  $.getJSON(urlGetCompanyLogoName + inputCompanyName, (data) => {
    clearList(companyList);

    for (let i = 0; i < data.length && i < 3; i++) {
      const company = document.createElement("div");
      const companyLogoImg = document.createElement("img");
      const companyName = document.createElement("span");
      const companyDomain = document.createElement("span");

      company.className = "d-flex justify-content-between align-items-center company";
      company.setAttribute("data-cname", data[i].name);
      companyLogoImg.src = data[i].logo;
      companyLogoImg.className = "company-logo";
      companyName.textContent = data[i].name;
      companyName.className = "font-weight-bold pr-2 autocomplete-height";
      companyDomain.textContent = ` (${data[i].domain})`;
      companyDomain.className = "ml-auto pr-2 autocomplete-height";
      company.append(companyLogoImg, companyName, companyDomain);
      companyList.appendChild(company);

      company.addEventListener("click", (event) => {
        const selectedCompany = event.currentTarget.getAttribute("data-cname");
        const logoUrl = event.currentTarget.firstChild.src;
        getTickerName(selectedCompany, logoUrl);
        clearList(companyList);
        $("#input-company").val("");
      });
    }
  }).fail((jqxhr, textStatus, error) => {
    console.error(textStatus + ", " + error);
  });
});

function getTickerName(name, logoUrl) {
  $.getJSON(urlGetStockTickerFromName + name + stockApiKey, (data) => {
    if (!data.bestMatches.length) {
      $("#tickerToast").show();
      $("#tickerToast").toast("show");
    }

    for (let i = 0; i < data.bestMatches.length && i < 3; i++) {
      const company = document.createElement("div");
      const ticker = document.createElement("span");
      const companyName = document.createElement("span");

      ticker.textContent = data.bestMatches[i]["1. symbol"];
      ticker.className = "font-weight-bold pr-2 autocomplete-height";
      company.setAttribute("data-ticker", ticker.textContent);
      company.className = "pl-3 d-flex justify-content-between align-items-center company";
      companyName.textContent = ` ${data.bestMatches[i]["2. name"]} (Best matches - ${data.bestMatches[i]["9. matchScore"]})`;
      companyName.className = "pr-2 autocomplete-height";

      company.append(ticker, companyName);
      companyList.appendChild(company);

      company.addEventListener("click", (event) => {
        const tickerName = event.currentTarget.getAttribute("data-ticker");
        clearList(companyList);
        getStockQuoteInfo(tickerName, name, logoUrl);
        if (!checkModalCondition()) {
          getNews(name);
          drawStockChart(tickerName, name, "chart-container-modal", "chart-stock");
        }
        updateQuote();
      });
    }
  }).fail((jqxhr, textStatus, error) => {
    console.error(textStatus + ", " + error);
  });
}
