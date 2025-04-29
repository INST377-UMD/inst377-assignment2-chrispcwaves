
async function fetchQuote() {
      
    try {
        const response = await fetch("https://zenquotes.io/api/random");
        const data = await response.json();
        const quote = data[0].q;
        const author = data[0].a;
        document.getElementById("quoteBlock").innerHTML = `"${quote}"<br><br>— ${author}`;
      } catch (error) {
        document.getElementById("quoteBlock").innerHTML = "Unable to load quote at this time.";
        console.error("Quote fetch error:", error);
      }
    }

    window.onload = fetchQuote;


if (annyang) {
        const commands = {
          'hello': () => alert('Hello World'),
          'change the color to *color': (color) => document.body.style.backgroundColor = color.toLowerCase(),
          'navigate to *page': (page) => {
            const lower = page.toLowerCase();
            if (lower.includes('home')) location.href = 'home.html';
            else if (lower.includes('stock')) location.href = 'stocks.html';
            else if (lower.includes('dog')) location.href = 'dogs.html';
          }
};
    
        annyang.addCommands(commands);
        annyang.start();
    
        function turnOffAudio() {
          annyang.abort();
        }
    
        function turnOnAudio() {
          annyang.start();
        }
      }