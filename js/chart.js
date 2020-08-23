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

function createChartContainer(container) {
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

  let divContainer = document.createElement("div");
  divContainer.className = "col chart-container";
  divContainer.id = container;

  let btnClose = document.createElement("button");
  btnClose.className = "close";
  btnClose.textContent = "×";

  let divChart = document.createElement("div");
  divChart.id = "chart-stock";
  divContainer.append(btnClose, divChart);
  tempChartNewsContainer.insertBefore(divContainer, tempNewsContainer);

  btnClose.addEventListener("click", (event) => {
    event.target.parentNode.remove();
  });
}

const urlGetStockSeriesData1DFull = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=full&symbol=";
function drawStockChart(ticker, companyName, container, id) {
  Highcharts.getJSON(urlGetStockSeriesData1DFull + ticker + stockApiKey, (data) => {
    let chartData = getChartData(data);
    if (!chartData) return;

    createChartContainer(container);

    Highcharts.stockChart(id, {
      rangeSelector: {
        selected: 1,
      },
      title: {
        text: companyName + " Stock Price",
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

const urlGetStockSeriesData1D = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=";
function drawShortStockChart(ticker, companyName, container, id) {
  Highcharts.getJSON(urlGetStockSeriesData1D + ticker + stockApiKey, (data) => {
    let chartData = getChartData(data);
    if (!chartData) return;

    createChartContainer(container);

    Highcharts.stockChart(id, {
      chart: {
        height: 300,
      },
      rangeSelector: {
        allButtonsEnabled: true,
        buttons: [
          {
            type: "month",
            count: 3,
            text: "Day",
            dataGrouping: {
              forced: true,
              units: [["day", [1]]],
            },
          },
          {
            type: "year",
            count: 1,
            text: "Week",
            dataGrouping: {
              forced: true,
              units: [["week", [1]]],
            },
          },
          {
            type: "all",
            text: "Month",
            dataGrouping: {
              forced: true,
              units: [["month", [1]]],
            },
          },
        ],
        buttonTheme: {
          width: 60,
        },
        selected: 2,
      },
      title: {
        text: companyName + " Stock Price",
      },
      _navigator: {
        enabled: false,
      },
      series: [
        {
          name: companyName,
          data: chartData,
          marker: {
            enabled: null,
            radius: 3,
            lineWidth: 1,
            lineColor: "#FFFFFF",
          },
          tooltip: {
            valueDecimals: 2,
          },
        },
      ],
    });
  });
}
