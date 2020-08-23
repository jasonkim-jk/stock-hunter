function getNews(keyWord) {
  const urlAllArticlesSearch = "https://api.currentsapi.services/v1/search?language=en&country=us&keywords=";
  const searchUrl = urlAllArticlesSearch + keyWord + newsApiKey;

  $.getJSON(searchUrl, (data) => {
    addNewsList(data, keyWord);
    if (checkScreenXS()) {
      $(".news-image").hide(600);
    }
  }).fail((jqxhr, textStatus, error) => {
    console.error(textStatus + ", " + error);
  });
}

function addNewsList(data, keyWord) {
  let tempNewsContainer = "";

  if ((checkMobileSize() || checkScreenRotated()) && checkModal()) {
    tempNewsContainer = document.querySelector(".news-container-modal");
  } else {
    tempNewsContainer = document.querySelector(".news-container");
  }

  clearList(tempNewsContainer);

  const newsContainerTitleLine = document.createElement("hr");
  newsContainerTitleLine.className = "mb-0";

  const newsContainerTitle = document.createElement("h4");
  newsContainerTitle.className = "text-center text-dark mb-2 mb-sm-3";
  newsContainerTitle.textContent = keyWord === "latest" ? "Latest News" : `${keyWord} News`;
  tempNewsContainer.append(newsContainerTitle, newsContainerTitleLine);

  for (let i = 0; i < data.news.length && i < 10; i++) {
    const a = document.createElement("a");
    a.href = data.news[i].url;
    a.target = "_blank";
    tempNewsContainer.appendChild(a);

    const divContainer = document.createElement("div");
    divContainer.className =
      "card flex-sm-row box-shadow h-150 rounded-0 border-top-0 border-left-0 border-right-0 hvr-underline-reveal";
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
    divContent.className = "card-body d-sm-flex flex-column align-items-start w-100 p-1 pl-2";
    divContainer.appendChild(divContent);

    const newsCategory = document.createElement("strong");
    newsCategory.className = "d-block text-success";
    newsCategory.textContent = data.news[i].category[0];

    const newsTime = document.createElement("span");
    newsTime.className = "d-block text-muted text-truncate";
    newsTime.style.textTransform = "capitalize";
    newsTime.textContent =
      "By " +
      data.news[i].author.substr(0, 25) +
      " • " +
      data.news[i].published.slice(0, data.news[i].published.indexOf("+"));

    const newsTitle = document.createElement("p");
    newsTitle.className = "mb-0 text-text d-block text-truncate";
    newsTitle.textContent = data.news[i].title;

    const newsText = document.createElement("p");
    newsText.className = "mb-auto text-dark d-block text-truncate";
    newsText.textContent = data.news[i].description;

    divContent.append(newsCategory, newsTime, newsTitle, newsText);
    divContainer.append(img, divContent);
  }
}

getNews("latest");
