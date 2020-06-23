// to get news data from open-api server
function getNews(keyWord, category = "") {
  let searchUrl = "";

  if (category === "latest" || !keyWord) {
    searchUrl = urlLatestNews + newsApiKey;
  } else {
    searchUrl = urlAllArticlesSearch + keyWord + newsApiKey;
  }

  $.getJSON(searchUrl, (data) => {
    addNewsList(data);
  }).fail((jqxhr, textStatus, error) => {
    console.error(textStatus + ", " + error);
  });
}

// add news list for the selected ticker
function addNewsList(data) {
  // console.dir(data);
  clearList(newsContainer);

  // make news element up to 10
  for (let i = 0; i < data.news.length && i < 10; i++) {
    // news page link
    const a = document.createElement("a");
    a.href = data.news[i].url;
    a.target = "_blank";
    newsContainer.appendChild(a);

    const divContainer = document.createElement("div");
    divContainer.className = classNewsContainer;
    a.appendChild(divContainer);

    // news image
    const img = document.createElement("img");
    img.className = classNewsImg;
    img.alt = "news image " + i;
    if (data.news[i].image !== "None") {
      img.src = data.news[i].image;
    } else {
      img.src = noImage;
    }

    // news content - category, title, text, time
    const divContent = document.createElement("div");
    divContent.className = classNewsContent;
    divContainer.appendChild(divContent);

    const newsCategory = document.createElement("strong");
    newsCategory.className = classNewsCategory;
    newsCategory.textContent = data.news[i].category[0];

    const newsTitle = document.createElement("h5");
    newsTitle.className = classNewsTitle;
    newsTitle.textContent = data.news[i].title;

    const newsText = document.createElement("p");
    newsText.className = classNewsText;
    newsText.style.maxWidth = "auto";
    newsText.textContent = data.news[i].description;

    const newsTime = document.createElement("div");
    newsTime.className = classNewsTime;
    newsTime.style.textTransform = "capitalize";
    newsTime.textContent =
      "By" + data.news[i].author + " - " + data.news[i].published.slice(0, data.news[i].published.indexOf("+"));

    divContent.append(newsCategory, newsTitle, newsText, newsTime);
    divContainer.append(img, divContent);
  }
}

getNews("latest");
