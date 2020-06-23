$("#stockModal").on("show.bs.modal", function (e) {
  console.log("the modal is about to be shown");
});

$("#stockModal").on("shown.bs.modal", function (e) {
  console.log("the modal is fully shown");
});
