function clearList(element) {
  while (element.firstChild) {
    element.removeChild(element.lastChild);
  }
}

function checkModal() {
  return $("#stockModal").hasClass("show");
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

$(window).resize(() => {
  if (checkScreenMD()) {
    $(".stock-logo").hide(600);
    $(".news-image").hide(600);
    $(".media-body").addClass("pl-2");
    $(".news-image").removeClass("d-sm-block");
    $(".news-image").addClass("d-lg-block");
  } else if (checkScreenXS()) {
    $(".news-image").hide(600);
  } else {
    $(".stock-logo").show(600);
    $(".news-image").show(600);
    $(".media-body").removeClass("pl-2");
    $(".news-image").addClass("d-sm-block");
    $(".news-image").removeClass("d-lg-block");
  }
});

function queryDataError(data) {
  if (Object.prototype.hasOwnProperty.call(data, "Note")) {
    alert("[Error] Wrong JSON data from the API server");
    return true;
  }
}

function isMobile() {
  return "ontouchstart" in document.documentElement;
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
});
