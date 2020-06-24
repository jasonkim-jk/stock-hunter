$("#stockModal").on("show.bs.modal", (event) => {
  const ticker = $("#myModalLabel").attr("data-ticker");
  const companyName = $("#myModalLabel").text();
  showStockLogo($("#myModalLabel").attr("data-logoUrl"));
  getNews(companyName);
  drawStockChart(ticker, companyName, idChartContainerModal, idChartGraph);
});

$("#stockModal").on("shown.bs.modal", (event) => {
  // console.log("the modal is fully shown");
});

$("#stockModal").on("hide.bs.modal", (event) => {
  // console.log("the modal is about to close");
  $(".modal-stock-logo").remove();
});

function showStockLogo(imgUrl) {
  const modalHeader = document.querySelector(".modal-header");
  const imgElement = document.createElement("img");
  imgElement.src = imgUrl;
  imgElement.className = "modal-stock-logo";
  imgElement.alt = "stock logo image";
  modalHeader.insertBefore(imgElement, modalHeader.childNodes[0]); // add as the first child
}
