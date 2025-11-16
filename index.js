const API_URL = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=Gjnp8mZOl9hCkgzxsWc2xc7fGlgYzAjT&classificationName=music&countryCode=US&size=200';
const EventByName = document.getElementById('event-by-name');
const EventByCountry = document.getElementById('event-by-country');
const eventsContainer = document.getElementById('eventsContainer');
const eventImages = document.querySelectorAll('.EventsIMG');

let events = [];
const eventsPerPage = 20;
let currentPage = 1;

function renderEvents(eventsToRender = events) {
  eventsContainer.innerHTML = '';

  if (!eventsToRender || eventsToRender.length === 0) {
    eventsContainer.innerHTML = '<p>Події не знайдено.</p>';
    return;
  }

  eventsToRender.forEach(event => {
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
    const response = await fetch(API_URL);
    const data = await response.json();

    events = data._embedded?.events || [];
    originalEvents = [...events];

    return events;
  } catch (error) {
    console.error('Помилка при отриманні подій:', error);
    eventsContainer.innerHTML = '<p>Не вдалося завантажити події.</p>';
    return [];
  }
}

async function startApp() {
  await getEvents();

  seeEvents(currentPage);
  renderPagination();
}


function seeEvents(page){
  const start = (page - 1) * eventsPerPage;
  const end = start + eventsPerPage;
  const eventsToShow = events.slice(start, end);
  renderEvents(eventsToShow);
}

function renderPagination(){
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  const totalPages = Math.ceil(events.length / eventsPerPage);

  const backButton = document.createElement("button");
  backButton.textContent = "<"
  backButton.disabled = currentPage === 1;
  backButton.onclick = () =>{
    if (currentPage > 1){
      currentPage--;
      seeEvents(currentPage);
      renderPagination();
    }
  };
  pagination.append(backButton);

  for (let i = 1; i <= totalPages; i++){
    const eventBTN = document.createElement("button");
    eventBTN.textContent = i;
    if (i === currentPage) eventBTN.classList.add("activePAGE");
    eventBTN.onclick = () => {
      currentPage = i;
      seeEvents(currentPage);
      renderPagination();
    }
    pagination.appendChild(eventBTN);
  }

  const nextButton = document.createElement("button");
  nextButton.textContent = ">";
  nextButton.disabled = currentPage === totalPages;
  nextButton.onclick = () => {
    if (currentPage < totalPages){
      currentPage++;
      seeEvents(currentPage);
      renderPagination();
    }
  };
  pagination.append(nextButton);
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
  
  currentPage = 1;
  seeEvents(currentPage);
  renderPagination();
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

console.log("events loaded:", events.length);
console.log("original:", originalEvents.length);