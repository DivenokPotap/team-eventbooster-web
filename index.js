const API_URL = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=OJiJEoBCngaDdBAg2KhmO8pZN8FH4YRr&classificationName=music';
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
    const venueName = event._embedded?.venues?.[0]?.name || 'Невідоме місце';
    const description = event.info || 'Інформація відсутня';
    const localDate = event.dates?.start?.localDate || 'Дата не вказана';
    const eventName = event.name || 'Без назви';

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