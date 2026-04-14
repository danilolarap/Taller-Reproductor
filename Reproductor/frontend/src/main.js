const API_BASE = "http://localhost:8080/api";

const localSongs = new Map();

const fileInput = document.getElementById('file-input');
const btnAddStart = document.getElementById('btn-add-start');
const btnAddEnd = document.getElementById('btn-add-end');
const btnAddPos = document.getElementById('btn-add-pos');
const insertPositionInput = document.getElementById('insert-position');

const btnPrev = document.getElementById('btn-prev');
const btnPlay = document.getElementById('btn-play');
const btnNext = document.getElementById('btn-next');
const audioPlayer = document.getElementById('audio-player');
const currentDisplay = document.getElementById('current-song-display');
const playlistUI = document.getElementById('playlist');
const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    themeToggle.innerHTML = isDark ? '<i class="ph ph-sun"></i> Claro' : '<i class="ph ph-moon"></i> Oscuro';
});

function getCurrentFile() {
    if (fileInput.files && fileInput.files.length > 0) {
        return fileInput.files[0];
    }
    alert("Por favor selecciona un archivo MP3 primero.");
    return null;
}

fileInput.addEventListener('change', () => {
    const display = document.getElementById('file-name-display');
    if (fileInput.files && fileInput.files.length > 0) {
        display.textContent = fileInput.files[0].name;
    } else {
        display.textContent = "Ningún archivo elegido";
    }
});

function generateId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function prepareSong(file) {
    const songId = generateId();
    const songName = file.name.replace('.mp3', '');
    const objectUrl = URL.createObjectURL(file);
    localSongs.set(songId, objectUrl);
    return { songId, songName };
}

async function updateUI() {
    try {
        const listRes = await fetch(`${API_BASE}/playlist`);
        const list = await listRes.json();
        
        const currRes = await fetch(`${API_BASE}/current`);
        const current = await currRes.json();

        playlistUI.innerHTML = '';
        list.forEach((item, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1} - ${item.songName}`;
            
            const delBtn = document.createElement('button');
            delBtn.innerHTML = '<i class="ph ph-trash"></i>';
            delBtn.className = 'btn-danger';
            delBtn.style.marginLeft = 'auto';
            delBtn.style.padding = '0.4rem 0.6rem';
            delBtn.style.fontSize = '1.1rem';
            delBtn.onclick = async () => {
                await fetch(`${API_BASE}/remove/${index}`, { method: 'DELETE' });
                updateUI();
            };

            if (current && current.songId === item.songId) {
                li.classList.add('playing-item');
                li.textContent += " (Reproduciendo)";
            }
            li.appendChild(delBtn);
            playlistUI.appendChild(li);
        });

        if (current && current.songId) {
            currentDisplay.textContent = current.songName;
            const url = localSongs.get(current.songId);
            if (url && audioPlayer.src !== url) {
                audioPlayer.src = url;
                audioPlayer.play().then(() => {
                    btnPlay.innerHTML = '<i class="ph-fill ph-pause"></i>';
                }).catch(e => {
                    console.log("Auto-play requirere interacción previa");
                    btnPlay.innerHTML = '<i class="ph-fill ph-play"></i>';
                });
            }
        } else {
            currentDisplay.textContent = "Ninguna canción en reproducción";
            audioPlayer.src = "";
            btnPlay.innerHTML = '<i class="ph-fill ph-play"></i>';
        }

    } catch (e) {
        console.error("Error al actualizar UI:", e);
    }
}

btnAddEnd.addEventListener('click', async () => {
    const file = getCurrentFile();
    if (!file) return;
    const data = prepareSong(file);
    await fetch(`${API_BASE}/append`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    updateUI();
});

btnAddStart.addEventListener('click', async () => {
    const file = getCurrentFile();
    if (!file) return;
    const data = prepareSong(file);
    await fetch(`${API_BASE}/prepend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    updateUI();
});

btnAddPos.addEventListener('click', async () => {
    const posValue = parseInt(insertPositionInput.value, 10);
    if (isNaN(posValue) || posValue < 1) {
        alert("Por favor ingresa una posición válida (1 o mayor)");
        return;
    }
    const file = getCurrentFile();
    if (!file) return;
    
    // In our UI list is 1-based, backend expects 0-based
    const backendIndex = posValue - 1;
    const data = prepareSong(file);
    await fetch(`${API_BASE}/insert/${backendIndex}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    
    // Clear input
    insertPositionInput.value = "";
    updateUI();
});



btnNext.addEventListener('click', async () => {
    await fetch(`${API_BASE}/forward`, { method: 'POST' });
    updateUI();
});

btnPrev.addEventListener('click', async () => {
    await fetch(`${API_BASE}/backward`, { method: 'POST' });
    updateUI();
});

btnPlay.addEventListener('click', () => {
    if (audioPlayer.paused && audioPlayer.src) {
        audioPlayer.play();
        btnPlay.innerHTML = '<i class="ph-fill ph-pause"></i>';
    } else if (!audioPlayer.paused) {
        audioPlayer.pause();
        btnPlay.innerHTML = '<i class="ph-fill ph-play"></i>';
    }
});

const progressBar = document.getElementById('progress-bar');
const timeCurrent = document.getElementById('time-current');
const timeTotal = document.getElementById('time-total');

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration) {
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = progressPercent;
        timeCurrent.textContent = formatTime(audioPlayer.currentTime);
        timeTotal.textContent = formatTime(audioPlayer.duration);
    }
});

progressBar.addEventListener('input', () => {
    if (audioPlayer.duration) {
        const seekTime = (progressBar.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = seekTime;
    }
});

updateUI();
