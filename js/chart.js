function getChartData(data) {
  if (queryDataError(data)) return false;

  const stockChartData = [];
  const keyData = Object.keys(data["Time Series (Daily)"]);

  for (let i = keyData.length - 1; i >= 0; i--) {
    let price = parseFloat(data["Time Series (Daily)"][keyData[i]]["4. close"]);
    stockChartData.push([Date.parse(keyData[i]), parseFloat(price.toFixed(2))]);
  }

  return stockChartData;
}

function createChartContainer(container, companyName) {
  let tempChartNewsContainer = "";
  let tempNewsContainer = "";

  if (checkModalCondition()) {
    tempChartNewsContainer = document.querySelector(".chart-news-container-modal");
    tempNewsContainer = document.querySelector(".news-container-modal");
    $(`#${container}-modal`).remove();
  } else {
    tempChartNewsContainer = document.querySelector(".chart-news-container");
    tempNewsContainer = document.querySelector(".news-container");
    $(`#${container}`).remove();
  }

  const divContainer = document.createElement("div");
  divContainer.className = "col chart-container";
  divContainer.id = container;

  const chartContainerTitle = document.createElement("h4");
  chartContainerTitle.className = "text-center text-dark mb-2 mb-sm-3";
  chartContainerTitle.textContent = `${companyName} Stock Chart`;

  const chartContainerTitleLine = document.createElement("hr");
  chartContainerTitleLine.className = "my-0";

  const btnClose = document.createElement("button");
  btnClose.className = "close mr-2";
  btnClose.textContent = "×";

  const divChart = document.createElement("div");
  divChart.id = "chart-stock";
  divContainer.append(btnClose, chartContainerTitle, chartContainerTitleLine, divChart);
  tempChartNewsContainer.insertBefore(divContainer, tempNewsContainer);

  btnClose.addEventListener("click", (event) => {
    event.target.parentNode.remove();
  });
}

const urlGetStockSeriesData1DFull =
  "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=full&symbol=";
function drawStockChart(ticker, companyName, container, id) {
  Highcharts.getJSON(urlGetStockSeriesData1DFull + ticker + stockApiKey, (data) => {
    const chartData = getChartData(data);
    if (!chartData) return;

    createChartContainer(container, companyName);

    Highcharts.stockChart(id, {
      rangeSelector: {
        selected: 0,
      },
      series: [
        {
          name: companyName,
          data: chartData,
          tooltip: {
            valueDecimals: 2,
          },
        },
      ],
    });
  });
}
