

const apiKey = '7z33C4SsVgjpcrtA4u05XT_jFW2jCIfy';

document.getElementById("stocks").addEventListener("input", function(event) {
  let inputValue = event.target.value.toUpperCase();
  inputValue = inputValue.replace(/[^A-Za-z]/g, '');
  if (inputValue.length > 5) {
    inputValue = inputValue.slice(0, 5); 
  }
  event.target.value = inputValue; 
});

let new_chart;

async function lookupStock() {
  const ticker = document.getElementById("stocks").value.toUpperCase();
  const days = parseInt(document.getElementById("days").value);
  const toDate = new Date().toISOString().split("T")[0];
  const fromDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${fromDate}/${toDate}?adjusted=true&sort=asc&apiKey=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      alert("No data returned. Check the ticker symbol or try again later.");
      return;
    }
    const labels = data.results.map(entry => new Date(entry.t).toLocaleDateString());
    const values = data.results.map(entry => entry.c);

    if (new_chart) {
      new_chart.destroy();
    }
    new_chart = new Chart(document.getElementById("stockChart"), {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: `${ticker} Closing Prices`,
          data: values,
          fill: false,
          borderColor: 'black',
          tension: 0.1
        }]
      }
    });
  } catch (error) {
    console.error(error);
    alert("An error occurred while fetching stock data.");
  }
}

async function loadTopStocks() {
  const response = await fetch("https://tradestie.com/api/v1/apps/reddit?date=2022-04-03");
  const data = await response.json();
  const top5 = data.slice(0, 5);
  const tbody = document.querySelector("#stockTable tbody");
  tbody.innerHTML = "";
  top5.forEach((stock) => {
    const row = document.createElement("tr");
    const bullishIcon = "bull.png";
    const bearishIcon = "bear.png";
    const sentimentClass = stock.sentiment === "Bullish" ? 
      `<img src="${bullishIcon}" alt="Bullish" style="width: 60px; height: 60px;">` : 
      `<img src="${bearishIcon}" alt="Bearish" style="width: 60px; height: 60px;">`;
    row.innerHTML = `
      <td><a href="https://finance.yahoo.com/quote/${stock.ticker}" target="_blank">${stock.ticker}</a></td>
      <td>${stock.no_of_comments}</td>
      <td>${sentimentClass}</td>
    `;
    tbody.appendChild(row);
  });
}

window.onload = loadTopStocks;

function VoiceStocks() {
  if (annyang) {
    const commands = {
      'hello': () => alert('Hello World'),
      'change the color to *color': (color) => document.body.style.backgroundColor = color.toLowerCase(),
      'navigate to *page': (page) => {
        const lower = page.toLowerCase();
        if (lower.includes('home')) location.href = 'home.html';
        else if (lower.includes('stock')) location.href = 'stocks.html';
        else if (lower.includes('dog')) location.href = 'dogs.html';
      },
      'look up *stock': (stock) => {
        document.getElementById("stocks").value = stock.toUpperCase();
        lookupStock();
      },
      'load top stocks': loadTopStocks
    };

    annyang.addCommands(commands);
    annyang.start({autoRestart:false});
  } else {
    console.error("Annyang is not defined or failed to load.");
  }
};


function turnOffAudio() {
  if (typeof annyang !== 'undefined') {
    annyang.abort();
  } else {
    console.error("Annyang is not defined or failed to load.");
  }
}


