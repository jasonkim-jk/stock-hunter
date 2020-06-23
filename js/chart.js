// get date and price info from server's data and convert them for chart data
function getChartData(data) {
  // workaround for the free open-api problem
  // frequent queries can cause empty data problem
  // "Note" property means error!
  if (data.hasOwnProperty("Note")) return false;

  // chart data form: [[timestamp, value], [timestamp, value], ...]
  let stockChartData = [];
  let keyData = Object.keys(data["Time Series (Daily)"]);

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
function createChartContainer() {
  // the previous chart should be deleted
  $("#chart-container").remove();

  let container = document.querySelector(".chart-news-container");
  let newsContainer = document.querySelector(".news-container");
  let divContainer = document.createElement("div");
  divContainer.className = classChartContainer;

  let btnClose = document.createElement("button");
  btnClose.className = classBtnClose;
  btnClose.textContent = "×";

  let divChart = document.createElement("div");
  divChart.id = idChartGraph;
  divContainer.append(btnClose, divChart);
  container.insertBefore(divContainer, newsContainer);

  // to delete stock chart
  btnClose.addEventListener("click", (event) => {
    event.target.parentNode.remove();
  });
}

// draw stock chart using Highcharts API
function drawStockChart(ticker, companyName) {
  Highcharts.getJSON(urlGetStockSeriesData + ticker + stockApiKey, (data) => {
    // error check
    let chartData = getChartData(data);
    if (!chartData) return;

    createChartContainer();

    // Create the chart
    Highcharts.stockChart(idChartGraph, {
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
