$("#stockModal").on("show.bs.modal", (event) => {
  const ticker = $("#myModalLabel").attr("data-ticker");
  const companyName = $("#myModalLabel").text();
  getNews(companyName);
  drawStockChart(ticker, companyName, idChartContainerModal, idChartGraph);
});

$("#stockModal").on("shown.bs.modal", (event) => {
  // console.log("the modal is fully shown");
});

$("#stockModal").on("hide.bs.modal", (event) => {
  // console.log("the modal is about to close");
});
