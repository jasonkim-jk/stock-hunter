function getNews(keyWord, displayType = "main") {
  const urlAllArticlesSearch = "https://api.currentsapi.services/v1/search?language=en&country=us&keywords=";
  const searchUrl = urlAllArticlesSearch + keyWord + newsApiKey;

  const { newsItemContainer, newsPagerIdStr } = createNewsContainer(keyWord, displayType);
  $.getJSON(searchUrl, (data) => {
    newsItemContainer.classList.remove("loading");
    addNewsList(data, newsItemContainer, newsPagerIdStr);
    if (checkScreenXS()) {
      $(".news-image").hide(600);
    }
  }).fail((jqxhr, textStatus, error) => {
    $(".news-container").remove();
    showToast("Notice", "News data is currently not available. Please, check your network status.", "error");
  });
}

function createNewsContainer(keyWord, displayType) {
  let tempNewsContainer = "";
  const newsItemContainer = document.createElement("div");
  const newsPager = document.createElement("div");
  const newsPagerUl = document.createElement("ul");

  if (displayType === "modal") {
    tempNewsContainer = document.querySelector(".news-container-modal");
    newsItemContainer.className = "news-item-container-modal loading";
    newsPagerUl.id = "news-pagination-modal";
  } else {
    tempNewsContainer = document.querySelector(".news-container");
    newsItemContainer.className = "news-item-container loading";
    newsPagerUl.id = "news-pagination";
  }
  const newsPagerIdStr = newsPagerUl.id;
  clearList(tempNewsContainer);

  const newsContainerTitleLine = document.createElement("hr");
  newsContainerTitleLine.className = "mb-0";

  const newsContainerTitle = document.createElement("h4");
  newsContainerTitle.className = "text-center text-dark mb-2 mb-sm-3";
  newsContainerTitle.textContent = keyWord === "latest" ? "Latest News" : `${keyWord} News`;

  newsPagerUl.className = "pagination";
  newsPager.className = "news-pager d-flex justify-content-center mt-3";
  newsPager.appendChild(newsPagerUl);
  tempNewsContainer.append(newsContainerTitle, newsContainerTitleLine, newsItemContainer, newsPager);

  return { newsItemContainer, newsPagerIdStr };
}

function addNewsList(data, parentElement, pagerObjId) {
  const newsPerPage = 10;
  const totalNews = data.news.length;
  const pages = Math.ceil(totalNews / newsPerPage);

  $(`#${pagerObjId}`).twbsPagination({
    totalPages: pages,
    cssStyle: "",
    first: "<span>&laquo;</span>",
    prev: "←",
    next: "→",
    last: "<span>&raquo;</span>",
    onPageClick: (event, page) => {
      const displayRecordsIndex = Math.max(page - 1, 0) * newsPerPage;
      const endRec = displayRecordsIndex + newsPerPage;
      const displayNews = data.news.slice(displayRecordsIndex, endRec);
      clearList(parentElement);
      displayNewsItems(displayNews, parentElement);
    },
  });
}

function displayNewsItems(data, parentElement) {
  for (let i = 0; i < data.length; i++) {
    const a = document.createElement("a");
    a.href = data[i].url;
    a.target = "_blank";
    parentElement.appendChild(a);

    const divContainer = document.createElement("div");
    divContainer.className =
      "card flex-sm-row box-shadow h-150 rounded-0 border-top-0 border-left-0 border-right-0 hvr-underline-reveal";
    a.appendChild(divContainer);

    const img = document.createElement("img");
    img.className = "card-img-left col-3 flex-auto d-sm-block news-image";
    img.alt = "news " + i;
    if (data[i].image !== "None") {
      img.src = data[i].image;
    } else {
      img.src = "img/noimage.png";
    }

    const divContent = document.createElement("div");
    divContent.className = "card-body d-sm-flex flex-column align-items-start w-100 p-1 pl-2";
    divContainer.appendChild(divContent);

    const newsCategory = document.createElement("strong");
    newsCategory.className = "d-block text-success";
    newsCategory.textContent = data[i].category[0];

    const newsTime = document.createElement("small");
    newsTime.className = "d-block text-muted text-truncate";
    newsTime.style.textTransform = "capitalize";
    newsTime.textContent =
      data[i].published.slice(0, data[i].published.indexOf("+")) + " • By " + data[i].author;

    const newsTitle = document.createElement("p");
    newsTitle.className = "mb-0 text-info d-block text-truncate";
    newsTitle.textContent = data[i].title;

    const newsText = document.createElement("p");
    newsText.className = "mb-auto text-muted d-block text-truncate";
    newsText.textContent = data[i].description;

    divContent.append(newsCategory, newsTime, newsTitle, newsText);
    divContainer.append(img, divContent);
  }
  hideShowImages(0);
}

getNews("latest");
