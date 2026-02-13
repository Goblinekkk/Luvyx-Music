const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const progress = document.getElementById('progress');
const trackTitle = document.getElementById('trackTitle');
const artistName = document.getElementById('artistName');
const art = document.getElementById('art');
const searchInput = document.getElementById('musicSearch');
const resultsList = document.getElementById('resultsList');

// Hledání hudby přes iTunes API
async function searchMusic() {
    const query = searchInput.value.trim();
    if (!query) return;

    try {
        const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=6`);
        const data = await res.json();
        
        resultsList.innerHTML = "";
        if (data.results.length === 0) return;

        resultsList.classList.remove('results-hide');

        data.results.forEach(song => {
            const div = document.createElement('div');
            div.className = 'result-item';
            div.innerText = `${song.trackName} - ${song.artistName}`;
            div.onclick = () => playSong(song);
            resultsList.appendChild(div);
        });
    } catch (error) {
        console.error("Chyba při hledání:", error);
    }
}

// Spuštění vybrané skladby
function playSong(song) {
    trackTitle.innerText = song.trackName;
    artistName.innerText = song.artistName;
    
    // Nastavení zdroje a obrázku (převod na vyšší rozlišení)
    audio.src = song.previewUrl;
    const highResArt = song.artworkUrl100.replace('100x100', '600x600');
    art.style.backgroundImage = `url(${highResArt})`;
    
    resultsList.classList.add('results-hide');
    searchInput.value = "";
    
    audio.play();
    updateUI(true);
}

// Ovládání přehrávání
function togglePlay() {
    if (!audio.src) return;
    
    if (audio.paused) {
        audio.play();
        updateUI(true);
    } else {
        audio.pause();
        updateUI(false);
    }
}

function updateUI(isPlaying) {
    if (isPlaying) {
        // Ikona Pause
        playIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
        art.classList.add('playing');
    } else {
        // Ikona Play
        playIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
        art.classList.remove('playing');
    }
}

// Progress bar logika
audio.ontimeupdate = () => {
    if (audio.duration) {
        const pct = (audio.currentTime / audio.duration) * 100;
        progress.style.width = pct + "%";
    }
};

// Kliknutí do progress baru
document.getElementById('progressClickArea').onclick = (e) => {
    if (!audio.src) return;
    const width = e.currentTarget.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
};

// Eventy
document.getElementById('searchBtn').onclick = searchMusic;
searchInput.onkeydown = (e) => { if (e.key === "Enter") searchMusic(); };
playBtn.onclick = togglePlay;

// Automatický reset po skončení
audio.onended = () => updateUI(false);
