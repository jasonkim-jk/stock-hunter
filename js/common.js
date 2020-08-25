function clearList(element) {
  while (element.firstChild) {
    element.removeChild(element.lastChild);
  }
}

function checkMobileSize() {
  return $(window).width() < 500;
}

function checkScreenXS() {
  return $(window).width() <= 559;
}

function checkScreenSM() {
  let screenSize = $(window).width();
  return screenSize >= 559 && screenSize < 751;
}

function checkScreenMD() {
  let screenSize = $(window).width();
  return screenSize >= 751 && screenSize < 975;
}

function checkScreenMoreThanMD() {
  return $(window).width() >= 751;
}

function checkScreenRotated() {
  let angle = screen.orientation.angle;
  return angle === 90 || angle === 270;
}

function checkModalCondition() {
  return checkMobileSize() || (checkScreenRotated() && checkScreenSM());
}

function hideShowImages(timing) {
  if (checkScreenMD()) {
    $(".stock-logo").hide(timing);
    $(".news-image").hide(timing);
    $(".media-body").addClass("pl-2");
    $(".news-image").removeClass("d-sm-block");
    $(".news-image").addClass("d-lg-block");
  } else if (checkScreenXS()) {
    $(".news-image").hide(timing);
  } else {
    $(".stock-logo").show(timing);
    $(".news-image").show(timing);
    $(".media-body").removeClass("pl-2");
    $(".news-image").addClass("d-sm-block");
    $(".news-image").removeClass("d-lg-block");
  }
}

$(window).resize(() => hideShowImages(500));

function queryDataError(data) {
  if (Object.prototype.hasOwnProperty.call(data, "Note")) return true;
}

function isMobile() {
  return "ontouchstart" in document.documentElement;
}

function showToast(header, message, type = 'warning') {
  if(type === "error") {
    $("#toast-header-container").removeClass("bg-warning");
    $("#toast-header-container").addClass("bg-danger");
  }

  $("#toast-header").text(header);
  $("#toast-body").html(message);
  $("#tickerToast").show();
  $("#tickerToast").toast("show");
}

$("#input-company").trigger("focus");
$("#input-company").on("click", () => {
  const obj = document.querySelector(".company-data");
  if (!this.value || obj) {
    clearList(obj);
    $("#input-company").val("");
  }
});

$("#tickerToast").on("hidden.bs.toast", () => {
  $("#tickerToast").hide();
  $("#toast-header-container").toggleClass("bg-warning", true);
  $("#toast-header-container").removeClass("bg-danger");
});
