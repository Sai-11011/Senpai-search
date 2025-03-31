document.addEventListener('DOMContentLoaded', async () => {
    const animeDetails = document.getElementById('animeDetails');
    
    const urlParams = new URLSearchParams(window.location.search);
    const animeId = urlParams.get('id');

    if (!animeId) {
        animeDetails.innerHTML = '<p>No anime ID provided.</p>';
        return;
    }

    console.log('Fetching details for anime ID:', animeId);

    async function fetchAnimeDetails(id) {
        try {
            const response = await fetch(`/api/anime/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data); 
            displayAnimeDetails(data.data);
        } catch (error) {
            console.error('Error fetching anime details:', error);
            animeDetails.innerHTML = '<p>Error fetching anime details. Please try again later.</p>';
        }
    }

    function displayAnimeDetails(anime) {
        const imageUrl = anime.images && anime.images.jpg ? anime.images.jpg.image_url : 'default-image-url.jpg'; // Use a default image if not available

        animeDetails.innerHTML = `
        <div class="container">
            <div>
                <h2>${anime.title}</h2>
                <img src="${imageUrl}" alt="${anime.title}">
            </div>
            <div>
                <p><strong>Trailer:</strong> ${anime.trailer && anime.trailer.url ? `<a href="${anime.trailer.url}" target="_blank">Watch Trailer</a>` : 'No trailer available'}</p>
                <p><strong>Source:</strong> ${anime.source}</p>
                <p><strong>Episodes:</strong> ${anime.episodes}</p>
                <p><strong>Status:</strong> ${anime.status}</p>
                <p><strong>Aired:</strong> ${anime.aired.string}</p>
                <p><strong>Duration:</strong> ${anime.duration}</p>
                <p><strong>Rating:</strong> ${anime.rating}</p>
                <p><strong>Score:</strong> ${anime.score}</p>
                <p><strong>Rank:</strong> ${anime.rank}</p>
                <p><strong>Synopsis:</strong> ${anime.synopsis}</p>
                <p><strong>Year:</strong> ${anime.year}</p>
                <p><strong>Producers:</strong> ${anime.producers.map(producer => producer.name).join(', ')}</p>
            </div>
        </div>
        `;
    }

    fetchAnimeDetails(animeId);
animeList.innerHTML = '<p>Loading...</p>';
animeDetails.innerHTML = '<p>Loading...</p>';

});