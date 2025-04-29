document.addEventListener("DOMContentLoaded", () => {
    loadCarouselImages();
    loadRandomBreedButtons();
    setupVoiceCommands();
  });
  
  let randomBreedsDisplayed = [];

  function loadCarouselImages() {
    fetch('https://dog.ceo/api/breeds/image/random/10')
    .then(res => res.json())
    .then(data => {
      const carousel = document.getElementById('carousel');
      carousel.innerHTML = ''; 

      const images = data.message;
      if (!images || images.length === 0) {
        console.error('No images found.');
        return;
      }

      let currentIndex = 0;


      const sliderContainer = document.createElement('div');
      sliderContainer.style.position = 'relative';
      sliderContainer.style.width = '700px'; 
      sliderContainer.style.margin = 'auto';
      sliderContainer.style.display = 'flex';
      sliderContainer.style.alignItems = 'center';
      sliderContainer.style.justifyContent = 'center';
      sliderContainer.style.marginTop = '20px';

      
      const img = document.createElement('img');
      img.src = images[currentIndex];
      img.alt = 'dog image';
      img.style.width = '100%';         
      img.style.height = 'auto';         
      img.style.maxHeight = '80vh';      
      img.style.objectFit = 'contain';   
      img.style.borderRadius = '10px';   

     
      const leftArrow = document.createElement('div');
      leftArrow.textContent = '<';
      leftArrow.style.position = 'absolute';
      leftArrow.style.left = '10px';
      leftArrow.style.top = '50%';
      leftArrow.style.transform = 'translateY(-50%)';
      leftArrow.style.fontSize = '48px';
      leftArrow.style.color = '#007bff';
      leftArrow.style.cursor = 'pointer';
      leftArrow.style.userSelect = 'none';
      leftArrow.style.zIndex = '10';

   
      const rightArrow = document.createElement('div');
      rightArrow.textContent = '>';
      rightArrow.style.position = 'absolute';
      rightArrow.style.right = '10px';
      rightArrow.style.top = '50%';
      rightArrow.style.transform = 'translateY(-50%)';
      rightArrow.style.fontSize = '48px';
      rightArrow.style.color = '#007bff';
      rightArrow.style.cursor = 'pointer';
      rightArrow.style.userSelect = 'none';
      rightArrow.style.zIndex = '10';

    
      leftArrow.addEventListener('click', () => {
        currentIndex--;
        if (currentIndex < 0) {
          currentIndex = images.length - 1;
        }
        img.src = images[currentIndex];
      });

      rightArrow.addEventListener('click', () => {
        currentIndex++;
        if (currentIndex >= images.length) {
          currentIndex = 0;
        }
        img.src = images[currentIndex];
      });

     
      sliderContainer.appendChild(leftArrow);
      sliderContainer.appendChild(img);
      sliderContainer.appendChild(rightArrow);

     
      carousel.appendChild(sliderContainer);
    })
    .catch(error => {
      console.error('Error loading carousel images:', error);
    });
}

  
  function loadRandomBreedButtons() {
    fetch('https://api.thedogapi.com/v1/breeds')
      .then(res => res.json())
      .then(data => {
        const randomBreeds = getRandomItems(data, 10);
        randomBreedsDisplayed = randomBreeds;
        const buttonsContainer = document.getElementById('breed-buttons');
        buttonsContainer.innerHTML = '';
  
        randomBreeds.forEach(breed => {
          const button = document.createElement('button');
          button.textContent = breed.name;
          button.className = 'breed-button';
          button.addEventListener('click', () => showBreedInfo(breed));
          buttonsContainer.appendChild(button);
        });
      });
  }
  
  function showBreedInfo(breed) {
    const lifeSpan = breed.life_span || 'N/A';
    const [minLife, maxLife] = lifeSpan.includes('–') || lifeSpan.includes('-')
      ? lifeSpan.split(/[–-]/).map(s => s.trim())
      : [lifeSpan, lifeSpan];
  
    const content = `
      <h2>${breed.name}</h2>
      <p><strong>Description:</strong> ${breed.temperament || 'N/A'}</p>
      <p><strong>Min Life:</strong> ${minLife} years</p>
      <p><strong>Max Life:</strong> ${maxLife} years</p>
    `;
  
    displayBreedInfo(content);
  }
  
  function displayBreedInfo(content) {
    const infoBox = document.getElementById('breed-info');
    infoBox.innerHTML = content;
    infoBox.style.display = 'block';
  }
  
  function getRandomItems(arr, n) {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }
  
  function setupVoiceCommands() {
    if (typeof annyang !== 'undefined') {
      const commands = {
        'hello': () => alert('Hello back to you!'),
        'change the color to *color': (color) => {
          document.body.style.backgroundColor = color.toLowerCase();
        },
        'navigate to *page': (page) => {
          const lower = page.toLowerCase();
          if (lower.includes('home')) location.href = 'home.html';
          else if (lower.includes('stock')) location.href = 'stocks.html';
          else if (lower.includes('dog')) location.href = 'dogs.html';
        },
        'load dog breed *name': (name) => {
        const match = randomBreedsDisplayed.find(b => b.name.toLowerCase() === name.toLowerCase()); 
        if (match) {
          showBreedInfo(match);
        } else {
          alert(`Breed "${name}" not found among the displayed breeds. Try another one shown on screen.`);
        }
    }
      };
  
      annyang.addCommands(commands);
      annyang.start();
  
      window.turnOnAudio = () => annyang.start();
      window.turnOffAudio = () => annyang.abort();
    }
  }