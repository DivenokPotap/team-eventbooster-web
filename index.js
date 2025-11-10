const API_URL = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=Gjnp8mZOl9hCkgzxsWc2xc7fGlgYzAjT&classificationName=music';
const EventByName = document.getElementById('event-by-name');
const EventByCountry = document.getElementById('event-by-country');
const eventsContainer = document.getElementById('eventsContainer');
const eventImages = document.querySelectorAll('.EventsIMG');

let events = [];
const eventsPerPage = 20;
let currentPage = 1;

function renderEvents() {
  eventsContainer.innerHTML = '';

  if (!events || events.length === 0) {
    eventsContainer.innerHTML = '<p>Події не знайдено.</p>';
    return;
  }

  events.forEach(event => {
    const div = document.createElement('div');
    div.classList.add('card');

    const imageUrl = event.images?.[0]?.url || '';
    const venueName = event._embedded?.venues?.[0]?.name || 'No place';
    const description = event.info || 'No Info';
    const localDate = event.dates?.start?.localDate || 'Dateless';
    const eventName = event.name || 'Nameless';

    div.innerHTML = `
      <div class="decorpink"></div>
      <img class="EventsIMG" src="${imageUrl}" alt="${eventName}">
      <h2 class="EventsTitle">${eventName}</h2>
      <p class="EventsDate">${localDate}</p>
      <p class="EventsVenue">${venueName}</p>
    `;
    
    div.addEventListener('click', () => {
      const modal = document.getElementById('myModal');
      modal.style.display = 'block';

      const modalImg = modal.querySelector('.ModalIMG');
      modalImg.src = imageUrl;
      modalImg.alt = eventName;

      modal.querySelector('.EventINFO').textContent = description;
      modal.querySelector('.EventWHEN').textContent = localDate;
      modal.querySelector('.EventWHERE').textContent = `${venueName}`;
      modal.querySelector('.EventWHO').textContent = eventName;

    });

    eventsContainer.appendChild(div);
  });
}

async function getEvents() {
  try {
    console.log('Отримуємо події...');
    const response = await fetch(API_URL);
    const data = await response.json();
    events = data._embedded?.events || [];
    console.log('Подій отримано:', events.length);

    renderEvents();
  } catch (error) {
    console.error('Помилка при отриманні подій:', error);
    eventsContainer.innerHTML = '<p>Не вдалося завантажити події </p>';
  }
}

async function startApp() {
  await getEvents();
}


startApp();

let originalEvents = [];


const syncOriginalOnce = setInterval(() => {
  if (Array.isArray(events) && events.length) {
    originalEvents = [...events];
    clearInterval(syncOriginalOnce);
  }
}, 100);


function filterEvents() {
  const nameValue = EventByName.value.toLowerCase().trim();
  const countryValue = EventByCountry.value.toLowerCase().trim();

  events = originalEvents.filter(ev => {
    const eventName = (ev.name || '').toLowerCase();
    const venueName = (ev._embedded?.venues?.[0]?.name || '').toLowerCase(); // нижняя строка карточки

    if (nameValue && countryValue) {
      return eventName.includes(nameValue) && venueName.includes(countryValue);
    }

    if (nameValue) return eventName.includes(nameValue);

    if (countryValue) return venueName.includes(countryValue);

    return true;
  });

  renderEvents();
}


document.querySelectorAll('.searchbtn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault(); 
    filterEvents();
  });
});


[EventByName, EventByCountry].forEach(inp => {
  inp?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      filterEvents();
    }
  });
});