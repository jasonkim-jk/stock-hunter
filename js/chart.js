// get date and price info from server's data and convert them for chart data
function getChartData(data) {
  if (queryDataError(data)) return false;

  // chart data form: [[timestamp, value], [timestamp, value], ...]
  const stockChartData = [];
  const keyData = Object.keys(data["Time Series (Daily)"]);

  // chart data must be sorted by ascending order.
  // server's data are decending, so revert them.
  // server's time data is date, so it must be converted to timestamp.
  for (let i = keyData.length - 1; i >= 0; i--) {
    let price = parseFloat(data["Time Series (Daily)"][keyData[i]]["4. close"]);
    stockChartData.push([Date.parse(keyData[i]), parseFloat(price.toFixed(2))]);
  }

  return stockChartData;
}

// make a new stock chart element
function createChartContainer(container) {
  let tempChartNewsContainer = "";
  let tempNewsContainer = "";

  // to show news data on the modal
  if (checkModalCondition()) {
    tempChartNewsContainer = chartNewsContainerModal;
    tempNewsContainer = newsContainerModal;
    // the previous chart should be deleted
    $(`#${container}-modal`).remove();
  } else {
    tempChartNewsContainer = chartNewsContainer;
    tempNewsContainer = newsContainer;
    // the previous chart should be deleted
    $(`#${container}`).remove();
  }

  let divContainer = document.createElement("div");
  divContainer.className = classChartContainer;
  divContainer.id = container;

  let btnClose = document.createElement("button");
  btnClose.className = classBtnClose;
  btnClose.textContent = "×";

  let divChart = document.createElement("div");
  divChart.id = idChartGraph;
  divContainer.append(btnClose, divChart);
  tempChartNewsContainer.insertBefore(divContainer, tempNewsContainer);

  // to delete stock chart
  btnClose.addEventListener("click", (event) => {
    event.target.parentNode.remove();
  });
}

// draw stock chart using Highcharts API
function drawStockChart(ticker, companyName, container, id) {
  Highcharts.getJSON(urlGetStockSeriesData1DFull + ticker + stockApiKey, (data) => {
    // error check
    let chartData = getChartData(data);
    if (!chartData) return;

    createChartContainer(container);

    // Create the chart
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

function drawShortStockChart(ticker, companyName, container, id) {
  Highcharts.getJSON(urlGetStockSeriesData1D + ticker + stockApiKey, (data) => {
    // error check
    let chartData = getChartData(data);
    if (!chartData) return;

    createChartContainer(container);

    // Create the chart
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
            enabled: null, // auto
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
