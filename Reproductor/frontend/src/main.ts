const API_BASE = "http://localhost:8080/api";

// Diccionario local para URLs (Blob) de los MP3 subidos
const localSongs = new Map<string, string>();

// Elementos
const fileInput = document.getElementById('file-input') as HTMLInputElement;
const btnAddStart = document.getElementById('btn-add-start') as HTMLButtonElement;
const btnAddEnd = document.getElementById('btn-add-end') as HTMLButtonElement;
const btnAddPos = document.getElementById('btn-add-pos') as HTMLButtonElement;
const insertIndexNode = document.getElementById('insert-index') as HTMLInputElement;

const btnRemove = document.getElementById('btn-remove') as HTMLButtonElement;
const removeIndexNode = document.getElementById('remove-index') as HTMLInputElement;

const btnPrev = document.getElementById('btn-prev') as HTMLButtonElement;
const btnNext = document.getElementById('btn-next') as HTMLButtonElement;
const audioPlayer = document.getElementById('audio-player') as HTMLAudioElement;
const currentDisplay = document.getElementById('current-song-display') as HTMLElement;
const playlistUI = document.getElementById('playlist') as HTMLUListElement;
const themeToggle = document.getElementById('theme-toggle') as HTMLButtonElement;

// Manejo de tema
themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    themeToggle.textContent = isDark ? "☀️ Claro" : "🌙 Oscuro";
});

// Helper para obtener el archivo actual del input
function getCurrentFile(): File | null {
    if (fileInput.files && fileInput.files.length > 0) {
        return fileInput.files[0];
    }
    alert("Por favor selecciona un archivo MP3 primero.");
    return null;
}

// Preparar canción localmente
function prepareSong(file: File) {
    const songId = crypto.randomUUID();
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

        // Render playlist
        playlistUI.innerHTML = '';
        list.forEach((item: any, index: number) => {
            const li = document.createElement('li');
            li.textContent = `${index} - ${item.songName}`;
            if (current && current.songId === item.songId) {
                li.classList.add('playing-item');
                li.textContent += " (Reproduciendo)";
            }
            playlistUI.appendChild(li);
        });

        // Update player
        if (current && current.songId) {
            currentDisplay.textContent = current.songName;
            const url = localSongs.get(current.songId);
            if (url && audioPlayer.src !== url) {
                audioPlayer.src = url;
                audioPlayer.play().catch(e => console.log("Auto-play requirere interacción previa"));
            }
        } else {
            currentDisplay.textContent = "Ninguna canción en reproducción";
            audioPlayer.src = "";
        }

    } catch (e) {
        console.error("Error al actualizar UI:", e);
    }
}

// Eventos de botones
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
    const file = getCurrentFile();
    const pos = parseInt(insertIndexNode.value);
    if (!file || isNaN(pos)) return;
    const data = prepareSong(file);
    await fetch(`${API_BASE}/insert/${pos}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    updateUI();
});

btnRemove.addEventListener('click', async () => {
    const pos = parseInt(removeIndexNode.value);
    if (isNaN(pos)) return;
    await fetch(`${API_BASE}/remove/${pos}`, { method: 'DELETE' });
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

// Iniciar UI
updateUI();
