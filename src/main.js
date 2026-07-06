import './style.css';
import { Sidebar, SearchBar, Grid, PlayerModal, SettingsPanel } from './ui.js';
import { fetchTrending, searchMulti, fetchDetails, fetchSeason } from './api.js';

const app = document.querySelector('#app');

const DEFAULT_SERVERS = [
    { id: 'vidsrcpro', name: 'VidSrc Pro', moviePattern: 'https://vidsrc.pro/embed/movie/{id}', tvPattern: 'https://vidsrc.pro/embed/tv/{id}/{s}/{e}' },
    { id: 'embedsu', name: 'Embed.su', moviePattern: 'https://embed.su/embed/movie/{id}', tvPattern: 'https://embed.su/embed/tv/{id}/{s}/{e}' },
    { id: 'vidsrc2', name: 'VidSrc 2', moviePattern: 'https://vidsrc.to/embed/movie/{id}', tvPattern: 'https://vidsrc.to/embed/tv/{id}/{s}/{e}' },
    { id: '2embed', name: '2Embed', moviePattern: 'https://www.2embed.cc/embed/{id}', tvPattern: 'https://www.2embed.cc/embedtv/{id}&s={s}&e={e}' },
    { id: 'smashy', name: 'Smashy', moviePattern: 'https://player.smashy.stream/movie/{id}', tvPattern: 'https://player.smashy.stream/tv/{id}&s={s}&e={e}' }
];

const getServers = () => {
    const customServersRaw = localStorage.getItem('openflix_custom_servers');
    const customServers = customServersRaw ? JSON.parse(customServersRaw) : [];
    return [...DEFAULT_SERVERS, ...customServers];
};

const saveCustomServer = (server) => {
    const customServersRaw = localStorage.getItem('openflix_custom_servers');
    const customServers = customServersRaw ? JSON.parse(customServersRaw) : [];
    customServers.push(server);
    localStorage.setItem('openflix_custom_servers', JSON.stringify(customServers));
};

const deleteCustomServer = (id) => {
    const customServersRaw = localStorage.getItem('openflix_custom_servers');
    let customServers = customServersRaw ? JSON.parse(customServersRaw) : [];
    customServers = customServers.filter(s => s.id !== id);
    localStorage.setItem('openflix_custom_servers', JSON.stringify(customServers));
};

// State
let state = {
    page: 'home',
    query: '',
    results: [],
    currentId: null,
    currentType: null,
    currentSeason: 1,
    currentEpisode: 1,
    numberOfSeasons: 1,
    activeServer: 'vidsrcpro'
};

// Render Logic
const render = async () => {
    app.innerHTML = `
        ${Sidebar()}
        <main class="main-content">
            ${SearchBar()}
            <div id="content-area">
                Loading...
            </div>
            <footer class="app-footer">
                <p>OpenFlix &copy; 2026. Immersive Deep Space Media System. Data powered by TMDB API.</p>
            </footer>
        </main>
        ${PlayerModal()}
    `;

    const contentArea = document.getElementById('content-area');
    const searchInput = document.getElementById('searchInput');
    const playerModal = document.getElementById('playerModal');
    const playerFrame = document.getElementById('playerFrame');
    const closeModal = document.getElementById('closeModal');
    const episodesContainer = document.getElementById('episodes-container');

    // Server Logic
    const getUrl = (serverId, id, type, s = 1, e = 1) => {
        const servers = getServers();
        const server = servers.find(srv => srv.id === serverId) || servers[0];
        if (!server) return '';
        const pattern = type === 'movie' ? server.moviePattern : server.tvPattern;
        return pattern
            .replace(/{id}/g, id)
            .replace(/{s}/g, s)
            .replace(/{e}/g, e);
    };

    // Episode & Season Logic
    const renderEpisodes = async (tvId, seasonNum) => {
        episodesContainer.innerHTML = '<div style="padding:1rem">Loading episodes...</div>';
        const seasonData = await fetchSeason(tvId, seasonNum);

        if (!seasonData) {
            episodesContainer.innerHTML = '<div style="padding:1rem">Failed to load episodes.</div>';
            return;
        }

        // Render Season Buttons (Horizontal)
        let seasonButtons = '<div class="season-selector">';
        for (let i = 1; i <= state.numberOfSeasons; i++) {
            seasonButtons += `<button class="season-btn ${i == seasonNum ? 'active' : ''}" data-season="${i}">Season ${i}</button>`;
        }
        seasonButtons += '</div>';

        // Render Episode Grid
        let episodeGrid = '<div class="episode-list">';
        seasonData.episodes.forEach(ep => {
            const isSelected = ep.episode_number == state.currentEpisode && seasonNum == state.currentSeason;
            episodeGrid += `
                <button 
                    class="episode-btn ${isSelected ? 'active' : ''}" 
                    data-season="${seasonNum}" 
                    data-episode="${ep.episode_number}"
                    title="${ep.name}"
                >
                    E${ep.episode_number}
                </button>
            `;
        });
        episodeGrid += '</div>';

        episodesContainer.innerHTML = seasonButtons + episodeGrid;

        // Add Listeners
        episodesContainer.querySelectorAll('.season-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const s = parseInt(e.target.dataset.season);
                state.currentSeason = s;
                // Reset to ep 1 when changing season
                state.currentEpisode = 1;
                renderEpisodes(tvId, s);
                updatePlayerUrl();
            });
        });

        episodesContainer.querySelectorAll('.episode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const s = parseInt(e.target.dataset.season);
                const ep = parseInt(e.target.dataset.episode);
                state.currentSeason = s;
                state.currentEpisode = ep;

                // Update active state visually immediately
                episodesContainer.querySelectorAll('.episode-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                updatePlayerUrl();
            });
        });
    };

    const updatePlayerUrl = () => {
        const activeServer = document.querySelector('.server-btn.active').dataset.server;
        const url = getUrl(activeServer, state.currentId, state.currentType, state.currentSeason, state.currentEpisode);
        playerFrame.src = url;

        // Update URL State
        const params = new URLSearchParams(window.location.search);
        if (state.currentType === 'movie') {
            params.set('movie', state.currentId);
            params.delete('tv');
            params.delete('s');
            params.delete('e');
        } else {
            params.set('tv', state.currentId);
            params.set('s', state.currentSeason);
            params.set('e', state.currentEpisode);
            params.delete('movie');
        }
        window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    }

    // Player Utils
    const openPlayer = async (id, type, season = 1, episode = 1) => {
        state.currentId = id;
        state.currentType = type;
        state.currentSeason = parseInt(season);
        state.currentEpisode = parseInt(episode);

        // Dynamically populate server options
        const container = document.getElementById('serverControlsContainer');
        const servers = getServers();
        if (!servers.some(s => s.id === state.activeServer)) {
            state.activeServer = 'vidsrcpro';
        }

        let buttonsHtml = `<span>Server:</span>`;
        servers.forEach(srv => {
            const isActive = srv.id === state.activeServer;
            buttonsHtml += `<button class="server-btn ${isActive ? 'active' : ''}" data-server="${srv.id}">${srv.name}</button>`;
        });
        container.innerHTML = buttonsHtml;

        // Re-attach listeners to dynamically generated buttons
        container.querySelectorAll('.server-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                container.querySelectorAll('.server-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                state.activeServer = e.target.dataset.server;
                updatePlayerUrl();
            });
        });

        // Show/Hide Episodes Container
        if (type === 'tv') {
            episodesContainer.style.display = 'block';
            episodesContainer.innerHTML = '<div style="padding:1rem">Loading show info...</div>';

            // Fetch Details to get season count
            const details = await fetchDetails(id, 'tv');
            if (details) {
                state.numberOfSeasons = details.number_of_seasons;
                await renderEpisodes(id, state.currentSeason);
            }
        } else {
            episodesContainer.style.display = 'none';
        }

        updatePlayerUrl();

        playerFrame.allow = "autoplay *; encrypted-media *; fullscreen *; picture-in-picture *";
        playerFrame.referrerPolicy = "origin";
        playerModal.classList.add('open');
    };

    const closePlayer = () => {
        playerModal.classList.remove('open');
        playerFrame.src = '';
        state.currentId = null;
        state.currentType = null;
        // Clear URL params
        window.history.replaceState({}, '', window.location.pathname);
    };

    closeModal.addEventListener('click', closePlayer);

    // Content Click Handling
    contentArea.addEventListener('click', (e) => {
        const card = e.target.closest('.media-card');
        if (card) {
            const id = card.dataset.id;
            const type = card.dataset.type;
            openPlayer(id, type);
        }
    });

    // Handle URL Params on Load
    const checkUrlParams = () => {
        const params = new URLSearchParams(window.location.search);
        const movieId = params.get('movie');
        const tvId = params.get('tv');

        if (movieId) {
            openPlayer(movieId, 'movie');
        } else if (tvId) {
            const s = params.get('s') || 1;
            const e = params.get('e') || 1;
            openPlayer(tvId, 'tv', s, e);
        }
    };

    // Event Listeners
    searchInput.addEventListener('input', debounce(async (e) => {
        const query = e.target.value;
        if (query.length > 2) {
            state.page = 'search';
            state.query = query;
            const results = await searchMulti(query);
            contentArea.innerHTML = Grid(results);
        } else if (query.length === 0) {
            loadHome();
        }
    }, 500));

    // Sidebar Navigation
    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
            e.target.closest('.nav-item').classList.add('active');

            const page = e.target.getAttribute('data-page');
            if (page === 'home') loadHome();
            else if (page === 'movies') loadByGenre('movie');
            else if (page === 'tv') loadByGenre('tv');
            else if (page === 'anime') loadAnime();
            else if (page === 'settings') loadSettings();
        });
    });

    if (state.page === 'home') {
        loadHome();
    }

    // Check params after initial render
    checkUrlParams();
};

const loadByGenre = async (type) => {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = '<div class="loader">Loading Content...</div>';
    const trending = await fetchTrending(type);
    contentArea.innerHTML = `
        <h2>Popular ${type === 'movie' ? 'Movies' : 'TV Shows'}</h2>
        ${Grid(trending)}
    `;
    state.page = type;
}

const loadAnime = async () => {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = '<div class="loader">Loading Anime...</div>';
    const results = await fetchTrending('tv');
    contentArea.innerHTML = `
        <h2>Popular Anime (Coming Soon)</h2>
        <p>Anime specific filter requires API update.</p>
        ${Grid(results)}
    `;
};

const loadSettings = () => {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = SettingsPanel(getServers());
    state.page = 'settings';

    // Form element logic for addition
    const form = document.getElementById('addServerForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('serverName').value.trim();
            const id = document.getElementById('serverId').value.trim().toLowerCase();
            const moviePattern = document.getElementById('serverMoviePattern').value.trim();
            const tvPattern = document.getElementById('serverTvPattern').value.trim();

            const current = getServers();
            if (current.some(s => s.id === id)) {
                alert('A server with this key already exists. Please choose a unique key.');
                return;
            }

            saveCustomServer({ id, name, moviePattern, tvPattern });
            loadSettings();
        });
    }

    // Server deletion logic
    contentArea.querySelectorAll('.delete-server-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            if (confirm('Are you sure you want to delete this custom server?')) {
                deleteCustomServer(id);
                loadSettings();
            }
        });
    });
};

const loadHome = async () => {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = '<div class="loader">Loading Trending...</div>';
    const trending = await fetchTrending();
    contentArea.innerHTML = `
        <h2>Trending Now</h2>
        ${Grid(trending)}
    `;
    state.page = 'home';
};

// Utils
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Initial Render
render();
