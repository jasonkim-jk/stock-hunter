$("#stockModal").on("show.bs.modal", (event) => {
  const ticker = $("#myModalLabel").attr("data-ticker");
  const companyName = $("#myModalLabel").text();
  showStockLogo($("#myModalLabel").attr("data-logoUrl"));
  getNews(companyName);
  drawStockChart(ticker, companyName, "chart-container-modal", "chart-stock");
});

$("#stockModal").on("hide.bs.modal", (event) => {
  $(".modal-stock-logo").remove();
  $("#myModalLabel").text("");
  $("#myModalLabel").attr("data-ticker", "");
  $("#myModalLabel").attr("data-logoUrl", "");
  clearList(document.querySelector(".news-container-modal"));
  $('#chart-container-modal').remove();
});

function showStockLogo(imgUrl) {
  const modalHeader = document.querySelector(".modal-header");
  const imgElement = document.createElement("img");
  imgElement.src = imgUrl;
  imgElement.className = "modal-stock-logo";
  imgElement.alt = "stock logo image";
  modalHeader.insertBefore(imgElement, modalHeader.childNodes[0]);
}
