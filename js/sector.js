const urlGetStockSector = "https://www.alphavantage.co/query?function=SECTOR";
const stockSectorBody = document.querySelector(".stock-sector-body");

const stockSector = [
  "Communication Services",
  "Consumer Discretionary",
  "Consumer Staples",
  "Energy",
  "Financials",
  "Health Care",
  "Industrials",
  "Information Technology",
  "Materials",
  "Real Estate",
  "Utilities",
];

const stockTableIndex = [
  { sector: document.querySelector("#table-title"), type: "alpha" },
  { sector: document.querySelector("#table-current"), type: "numeric" },
  { sector: document.querySelector("#table-1day"), type: "numeric" },
  { sector: document.querySelector("#table-5day"), type: "numeric" },
  { sector: document.querySelector("#table-1mon"), type: "numeric" },
  { sector: document.querySelector("#table-3mon"), type: "numeric" },
  { sector: document.querySelector("#table-1year"), type: "numeric" },
];

const stockSectorData = [];

document.querySelector("#table-th-row").addEventListener("click", (event) => {
  if (event.target.id === "") return;
  let sortOrder = "";

  switch (event.target.id) {
    case "table-reload":
      initializeOtherIcons("");
      getStockSector("reload");
      return;
    case "table-title":
    case "sector-title":
      sortOrder = changeSortIcon(stockTableIndex[0].sector, stockTableIndex[0].type);
      sortItems(stockSectorData, "sector", sortOrder, "alpha");
      break;
    case "table-current":
    case "sector-current":
      sortOrder = changeSortIcon(stockTableIndex[1].sector, stockTableIndex[1].type);
      sortItems(stockSectorData, "Rank A: Real-Time Performance", sortOrder, "numeric");
      break;
    case "table-1day":
    case "sector-1day":
      sortOrder = changeSortIcon(stockTableIndex[2].sector, stockTableIndex[2].type);
      sortItems(stockSectorData, "Rank B: 1 Day Performance", sortOrder, "numeric");
      break;
    case "table-5day":
    case "sector-5day":
      sortOrder = changeSortIcon(stockTableIndex[3].sector, stockTableIndex[3].type);
      sortItems(stockSectorData, "Rank C: 5 Day Performance", sortOrder, "numeric");
      break;
    case "table-1mon":
    case "sector-1mon":
      sortOrder = changeSortIcon(stockTableIndex[4].sector, stockTableIndex[4].type);
      sortItems(stockSectorData, "Rank D: 1 Month Performance", sortOrder, "numeric");
      break;
    case "table-3mon":
    case "sector-3mon":
      sortOrder = changeSortIcon(stockTableIndex[5].sector, stockTableIndex[5].type);
      sortItems(stockSectorData, "Rank E: 3 Month Performance", sortOrder, "numeric");
      break;
    case "table-1year":
    case "sector-1year":
      sortOrder = changeSortIcon(stockTableIndex[6].sector, stockTableIndex[6].type);
      sortItems(stockSectorData, "Rank G: 1 Year Performance", sortOrder, "numeric");
      break;
    default:
      console.error("No matching case");
      return;
  }

  updateTable(stockSectorData);
});

function changeSortIcon(element, sortType) {
  let sortOrder = "";
  initializeOtherIcons(element);

  if (element.classList.contains("sort-down")) {
    element.classList.remove("sort-no", "sort-down", `fa-sort-${sortType}-down`);
    element.classList.add("sort-up", `fa-sort-${sortType}-down-alt`);
    sortOrder = "descending";
  } else if (element.classList.contains("sort-up")) {
    element.classList.remove("sort-no", "sort-up", `fa-sort-${sortType}-down-alt`);
    element.classList.add("sort-down", `fa-sort-${sortType}-down`);
    sortOrder = "ascending";
  } else {
    element.classList.remove("sort-no", "sort-up");
    element.classList.add("sort-down", `fa-sort-${sortType}-down`);
    sortOrder = "ascending";
  }

  return sortOrder;
}

function getFloat(input) {
  return parseFloat(input.split("%"));
}

function sortItems(sortData, sortElement, sortOrder, sortType) {
  sortData.sort(function (a, b) {
    if (sortType === "alpha") {
      var x = a[sortElement].toLowerCase();
      var y = b[sortElement].toLowerCase();
      if (x < y) {
        return sortOrder === "ascending" ? -1 : 1;
      }
      if (x > y) {
        return sortOrder === "ascending" ? 1 : -1;
      }
      return 0;
    } else if (sortType === "numeric") {
      return sortOrder === "ascending"
        ? getFloat(a[sortElement]) - getFloat(b[sortElement])
        : getFloat(b[sortElement]) - getFloat(a[sortElement]);
    }
  });
}

function updateTable(data) {
  const keyData = Object.keys(data[0]);

  clearList(stockSectorBody);

  for (let i = 0; i < stockSectorData.length; i++) {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.scope = "row";
    th.textContent = stockSectorData[i].sector;
    th.className = "font-weight-normal";
    tr.appendChild(th);

    for (let j = 1; j < keyData.length; j++) {
      const td = document.createElement("td");
      td.textContent = data[i][keyData[j]];
      td.className = "text-right";
      parseFloat(td.textContent.split("%")) > 0 ? td.classList.add("stock-green") : td.classList.add("stock-red");
      tr.appendChild(td);
    }
    stockSectorBody.appendChild(tr);
  }
}

function initializeOtherIcons(element) {
  for (let i = 0; i < stockTableIndex.length; i++) {
    if (element === stockTableIndex[i].sector) continue;
    initializeClass(stockTableIndex[i].sector, stockTableIndex[i].type);
  }
}

function initializeClass(element, type) {
  if (type === "alpha") {
    element.classList.remove("sort-down", "sort-up", "fa-sort-alpha-down-alt");
    element.classList.add("sort-no", "fa-sort-alpha-down");
  } else {
    element.classList.remove("sort-down", "sort-up", "fa-sort-numeric-down-alt");
    element.classList.add("sort-no", "fa-sort-numeric-down");
  }
}

function getStockSector(type) {
  $.getJSON(urlGetStockSector + stockApiKey, (data) => {
    if (queryDataError(data)) {
      showToast("Notice", "Stock sector data is currently not available. Please, try again in 1 minute.");
      return;
    }

    const lastUpdate = "Last Updated: " + data["Meta Data"]["Last Refreshed"];
    document.querySelector(".stock-sector-caption").textContent = lastUpdate;
    const keyData = Object.keys(data);
    stockSectorData.splice(0, stockSectorData.length);

    clearList(stockSectorBody);

    for (let i = 0; i < stockSector.length; i++) {
      const tempArray = {};
      const tr = document.createElement("tr");
      const th = document.createElement("th");
      th.scope = "row";
      th.textContent = stockSector[i];
      th.className = "font-weight-normal";
      tempArray["sector"] = stockSector[i];
      tr.appendChild(th);

      for (let j = 1; j < 8; j++) {
        if (j === 6) continue;
        const td = document.createElement("td");
        td.textContent = data[keyData[j]][stockSector[i]];
        tempArray[keyData[j]] = data[keyData[j]][stockSector[i]];
        td.className = "text-right";
        getFloat(td.textContent) > 0 ? td.classList.add("stock-green") : td.classList.add("stock-red");
        tr.appendChild(td);
      }
      stockSectorBody.appendChild(tr);
      stockSectorData.push(tempArray);
    }

    if (type === "create") document.querySelector(".stock-sector-container").classList.toggle("d-none");
  }).fail((jqxhr, textStatus, error) => {
    showToast("Notice", "Stock sector data is currently not available. Please, check your network status.", "error");
  });
}

getStockSector("create");
