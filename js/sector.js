function getStockSector() {
  $.getJSON(urlGetStockSector + stockApiKey, (data) => {
    if (queryDataError(data)) return;

    const lastUpdate = "Last Updated: " + data["Meta Data"]["Last Refreshed"];
    document.querySelector(".stock-sector-caption").textContent = lastUpdate;
    const keyData = Object.keys(data);

    for (let i = 0; i < stockSector.length; i++) {
      const tr = document.createElement("tr");
      const th = document.createElement("th");
      th.scope = "row";
      // th.className = "text-uppercase";
      th.textContent = stockSector[i];
      tr.appendChild(th);

      for (let j = 1; j < 8; j++) {
        if (j === 6) continue;
        const td = document.createElement("td");
        td.textContent = data[keyData[j]][stockSector[i]];
        td.className = "text-right";
        parseFloat(td.textContent.split("%")) > 0 ? td.classList.add("stock-green") : td.classList.add("stock-red");
        tr.appendChild(td);
      }
      stockSectorBody.appendChild(tr);
    }
    stockSectorContainer.classList.toggle("d-none");
  });
}

getStockSector();
