$("#stockModal").on("show.bs.modal", (event) => {
});

$("#stockModal").on("shown.bs.modal", (event) => {
  // console.log("the modal is fully shown");
  getNews($("#myModalLabel").text());
});

$("#stockModal").on("hide.bs.modal", (event) => {
  console.log("the modal is about to close");
});
