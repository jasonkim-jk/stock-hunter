const urlGetCompanyLogoName = "https://autocomplete.clearbit.com/v1/companies/suggest?query=";
const urlGetStockTickerFromName = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=";
const companyList = document.querySelector(".company-data");
let debounceTimer = 0;

document.querySelector("#btn-search").addEventListener("click", updateQuote);

document.querySelector("#input-company").addEventListener("input", (event) => {
  const inputCompanyName = event.target.value;

  if (!inputCompanyName) {
    clearList(companyList);
    return;
  }

  if(debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    $.ajax({
      url: urlGetCompanyLogoName + inputCompanyName,
      timeout: 5000,
    })
      .done((data) => {
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
      })
      .fail((xhr, textStatus, error) => {
        console.log(xhr, textStatus, error);
        if (textStatus == "timeout") {
          showToast(
            "Notice",
            "Looks like the server is taking to long to respond. Please, try again in sometime.",
            "error"
          );
        } else {
          showToast("Notice", "Company symbol data is currently not available. Please, try again in sometime.", "error");
        }
      });
  }, 500);
});

function getTickerName(name, logoUrl) {
  $.ajax({
    url: urlGetStockTickerFromName + name + stockApiKey,
    timeout: 5000,
  })
    .done((data) => {
      if (!data.bestMatches.length) {
        showToast("Notice", "The stock ticker for the selected company could not be found.");
      } else {
        $("#input-company").val(`Please, select one of the following tickers for ${name}`);
      }

      for (let i = 0; i < data.bestMatches.length && i < 3; i++) {
        const company = document.createElement("div");
        const ticker = document.createElement("span");
        const companyName = document.createElement("span");

        ticker.textContent = data.bestMatches[i]["1. symbol"];
        ticker.className = "font-weight-bold pr-2 autocomplete-height";
        company.setAttribute("data-ticker", ticker.textContent);
        company.className = "pl-3 d-flex justify-content-between align-items-center company";
        companyName.textContent = ` ${data.bestMatches[i]["2. name"]} (${data.bestMatches[i]["9. matchScore"]})`;
        companyName.className = "pr-2 autocomplete-height";

        company.append(ticker, companyName);
        companyList.appendChild(company);

        company.addEventListener("click", (event) => {
          $("#input-company").val("");
          const tickerName = event.currentTarget.getAttribute("data-ticker");
          clearList(companyList);
          getStockQuoteInfo(tickerName, name, logoUrl);
          if (!checkModalCondition()) {
            getNews(name);
            drawStockChart(tickerName, name, "chart-container", "chart-stock");
          }
          updateQuote();
        });
      }
    })
    .fail((xhr, textStatus, error) => {
      if (textStatus == "timeout") {
        showToast(
          "Notice",
          "Looks like the server is taking to long to respond. Please, try again in sometime.",
          "error"
        );
      } else {
        showToast("Notice", "Stock ticker data is currently not available. Please, try again in sometime.", "error");
      }
    });
}

function initHome() {
  $(".chart-container").remove();
  getNews("latest");
}
