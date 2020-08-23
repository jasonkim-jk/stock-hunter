const urlAllArticlesSearch = "https://api.currentsapi.services/v1/search?language=en&country=us&keywords=";
const urlLatestNews = "https://api.currentsapi.services/v1/latest-news?language=us&country=us";

function getNews(keyWord, category = "") {
  let searchUrl = "";

  if (category === "latest" || !keyWord) {
    searchUrl = urlLatestNews + newsApiKey;
  } else {
    searchUrl = urlAllArticlesSearch + keyWord + newsApiKey;
  }

  $.getJSON(searchUrl, (data) => {
    addNewsList(data);
    if (checkScreenXS()) {
      $(".news-image").hide(600);
    }
  }).fail((jqxhr, textStatus, error) => {
    console.error(textStatus + ", " + error);
  });
}

function addNewsList(data) {
  let tempNewsContainer = "";

  if ((checkMobileSize() || checkScreenRotated()) && checkModal()) {
    tempNewsContainer = document.querySelector(".news-container-modal");
  } else {
    tempNewsContainer = document.querySelector(".news-container");
  }

  clearList(tempNewsContainer);

  // make news element up to 10
  // for (let i = 0; i < data.news.length && i < 10; i++) {
  for (let i = 0; i < data.news.length; i++) {
    const a = document.createElement("a");
    a.href = data.news[i].url;
    a.target = "_blank";
    tempNewsContainer.appendChild(a);

    const divContainer = document.createElement("div");
    divContainer.className = "card flex-sm-row box-shadow h-150 hvr-grow hvr-underline-reveal";
    a.appendChild(divContainer);

    const img = document.createElement("img");
    img.className = "card-img-left col-3 flex-auto d-sm-block news-image";
    img.alt = "news image " + i;
    if (data.news[i].image !== "None") {
      img.src = data.news[i].image;
    } else {
      img.src = "img/noimage.png";
    }

    const divContent = document.createElement("div");
    divContent.className = "card-body d-sm-flex flex-column align-items-start p-1 pl-2";
    divContainer.appendChild(divContent);

    const newsCategory = document.createElement("strong");
    newsCategory.className = "d-inline-block mb-0 text-success";
    newsCategory.textContent = data.news[i].category[0];

    const newsTitle = document.createElement("h6");
    newsTitle.className = "mb-0 text-dark";
    newsTitle.textContent = data.news[i].title.substr(0, 50) + "...";

    const newsText = document.createElement("p");
    newsText.className = "mb-auto card-text";
    newsText.style.maxWidth = "auto";
    newsText.textContent = data.news[i].description.substr(0, 80) + "...";

    const newsTime = document.createElement("div");
    newsTime.className = "mb-0 text-muted";
    newsTime.style.textTransform = "capitalize";
    newsTime.textContent =
      data.news[i].published.slice(0, data.news[i].published.indexOf("+")) +
      " - By " +
      data.news[i].author.substr(0, 25);

    divContent.append(newsCategory, newsTitle, newsText, newsTime);
    divContainer.append(img, divContent);
  }
}

getNews("latest");
