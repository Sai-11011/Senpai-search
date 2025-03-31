document.addEventListener('DOMContentLoaded', () => {
    const animeList = document.getElementById('animeList');
    const searchBar = document.getElementById('searchBar');
    const searchButton = document.getElementById('searchButton');
    const loginButton = document.getElementById('loginButton');
    const profilePopup = document.getElementById('profilePopup');
    const closePopup = document.getElementById('closePopup');
    const logoutButton = document.getElementById('logoutButton');
    const displayUsername = document.getElementById('displayUsername');
    const searchHistoryList = document.getElementById('searchHistoryList');
    const userIcon = document.getElementById('userIcon');
    const clearHistoryButton = document.getElementById('clearHistoryButton');

    const loggedInUser  = JSON.parse(localStorage.getItem('loggedInUser '));
    
    if (loggedInUser ) {
        displayUsername.textContent = loggedInUser .username;
        userIcon.style.display = 'block'; 
        loginButton.style.display = 'none'; 

        const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        searchHistory.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            searchHistoryList.appendChild(li);
        });
    } else {
        window.location.href = '/login.html';
    }

    function showProfilePopup() {
        profilePopup.style.display = 'block';
    }

    closePopup.onclick = function() {
        profilePopup.style.display = 'none';
    }

    
    clearHistoryButton.addEventListener('click', () => {
        localStorage.removeItem('searchHistory');
        searchHistoryList.innerHTML = '';
        alert('Search history cleared!'); 
    });

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('loggedInUser ');
        window.location.href = '/login.html';
    });

    async function fetchAnime(query = '') {
        const response = await fetch(`/api/anime?q=${query}`);
        const data = await response.json();
        displayAnime(data.data);
    
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        if (!searchHistory.includes(query) && query) {
            searchHistory.push(query);
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        }
    }

function displayAnime(animeArray) {
    animeList.innerHTML = ''; 
    animeArray.forEach(anime => {
        const animeCard = document.createElement('div');
        animeCard.classList.add('anime-card');
        
        animeCard.addEventListener('click', () => {
            const loggedInUser  = JSON.parse(localStorage.getItem('loggedInUser ')); 
            if (loggedInUser ) {
                window.location.href = `details.html?id=${anime.mal_id}`;
            } else {
                window.location.href = '/login.html';
            }
        });

        animeCard.innerHTML = `
            <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
            <h3>${anime.title}</h3>
        `;
        animeList.appendChild(animeCard);
    });
}

    window.onclick = function(event) {
        if (event.target === profilePopup) {
            profilePopup.style.display = 'none';
        }
    };

    fetchAnime();

    searchButton.addEventListener('click', () => {
        const searchQuery = searchBar.value;
        fetchAnime(searchQuery);
    });

    userIcon.addEventListener('click', showProfilePopup);

    animeList.innerHTML = '<p>Loading...</p>';
});