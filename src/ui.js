
import logo from './assets/logo.png';

export const Sidebar = () => `
  <aside class="sidebar">
    <div class="logo-container">
        <img src="${logo}" alt="OpenFlix" class="logo-img">
    </div>
    <ul class="nav-links">
      <li><a href="#" class="nav-item active" data-page="home"><svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>Home</a></li>
      <li><a href="#" class="nav-item" data-page="search"><svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>Search</a></li>
      <li><a href="#" class="nav-item" data-page="movies"><svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>Movies</a></li>
      <li><a href="#" class="nav-item" data-page="tv"><svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>TV Shows</a></li>
      <li><a href="#" class="nav-item" data-page="anime"><svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>Anime</a></li>
      <li><a href="#" class="nav-item" data-page="settings"><svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>Settings</a></li>
    </ul>
  </aside>
`;

export const SearchBar = () => `
  <div class="search-bar-container">
    <div class="search-wrapper">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" class="search-input" placeholder="Search for movies, TV shows..." id="searchInput">
    </div>
  </div>
`;

export const MediaCard = (media) => {
  const title = media.title || media.name;
  const date = media.release_date || media.first_air_date || 'N/A';
  const year = date.split('-')[0];
  const poster = media.poster_path
    ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Poster'; // Placeholder

  return `
    <div class="media-card" data-id="${media.id}" data-type="${media.media_type || 'movie'}">
        <img src="${poster}" alt="${title}" class="media-poster" loading="lazy">
        <div class="media-play-overlay">
            <div class="media-play-btn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            </div>
        </div>
        <div class="media-info">
            <h3 class="media-title">${title}</h3>
            <span class="media-year">${year}</span>
        </div>
    </div>
    `;
};

export const Grid = (items) => `
    <div class="media-grid">
        ${items.map(MediaCard).join('')}
    </div>
`;

export const PlayerModal = () => `
<div class="modal-overlay" id="playerModal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>Now Playing</h3>
            <button class="close-modal" id="closeModal">&times;</button>
        </div>
        <div class="video-container">
            <iframe 
                id="playerFrame" 
                src="" 
                allowfullscreen 
                referrerpolicy="origin"
                allow="autoplay *; encrypted-media *; fullscreen *; picture-in-picture *"
                sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation allow-presentation"
            ></iframe>
        </div>
        <div class="player-controls">
            <div id="episodes-container" class="episodes-container"></div>
        </div>
        <div class="player-footer" style="padding: 1rem; color: #a3a3a3; font-size: 0.9rem; text-align: center;">
            <p><strong>Security Mode:</strong> Sandbox Enabled.</p>
            <p style="font-size: 0.8rem; margin-top: 5px;">We have enabled strict security. If a server doesn't play, please try another one (e.g. <b>Embed.su</b> or <b>2Embed</b>).</p>
        </div>
        <div class="server-controls" id="serverControlsContainer">
            <!-- Dynamically populated servers go here -->
        </div>
    </div>
</div>
`;

export const SettingsPanel = (servers = []) => {
  const defaultServerIds = ['vidsrcpro', 'embedsu', 'vidsrc2', '2embed', 'smashy'];
  
  const serverItemsHtml = servers.map(srv => {
    const isDefault = defaultServerIds.includes(srv.id);
    return `
      <div class="server-item" data-id="${srv.id}">
        <div class="server-meta">
          <div class="server-info-title">
            ${srv.name}
            ${isDefault ? '<span class="badge-default">System Default</span>' : ''}
          </div>
          <div class="server-info-url" title="${srv.moviePattern}">
            Movie Pattern: ${srv.moviePattern} <br/>
            TV Pattern: ${srv.tvPattern}
          </div>
        </div>
        ${!isDefault ? `
          <button class="delete-server-btn" data-id="${srv.id}" title="Delete Server">
            &times;
          </button>
        ` : ''}
      </div>
    `;
  }).join('');

  return `
    <div class="settings-container">
      <h2>Custom Media Servers</h2>
      
      <div class="settings-section">
        <h3>Add New Server</h3>
        <p>Integrate your own video streams or alternate mirrors. Provide pattern URLs where <code>{id}</code> represents the TMDB ID, <code>{s}</code> the Season, and <code>{e}</code> the Episode number.</p>
        
        <form class="server-form" id="addServerForm">
          <div class="form-row">
            <div class="form-group">
              <label for="serverName">Server Name</label>
              <input type="text" id="serverName" placeholder="e.g., Vidsrc Mirror" required>
            </div>
            <div class="form-group">
              <label for="serverId">Server Key (Unique alphanumeric)</label>
              <input type="text" id="serverId" placeholder="e.g., custom_mirror" pattern="[a-zA-Z0-9_]+" required>
            </div>
          </div>
          
          <div class="form-group">
            <label for="serverMoviePattern">Movie URL Pattern</label>
            <input type="url" id="serverMoviePattern" placeholder="e.g., https://vidsrc.me/embed/movie/{id}" required>
            <div class="placeholder-tags">
              <span class="placeholder-tag">{id}</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="serverTvPattern">TV Show URL Pattern</label>
            <input type="url" id="serverTvPattern" placeholder="e.g., https://vidsrc.me/embed/tv/{id}/{s}/{e}" required>
            <div class="placeholder-tags">
              <span class="placeholder-tag">{id}</span>
              <span class="placeholder-tag">{s}</span>
              <span class="placeholder-tag">{e}</span>
            </div>
          </div>
          
          <button type="submit" class="btn-primary">Add Server Source</button>
        </form>
      </div>

      <div class="settings-section">
        <h3>Configured Servers</h3>
        <p>A list of active content streaming streams currently available in the media player.</p>
        <div class="servers-list">
          ${serverItemsHtml}
        </div>
      </div>
    </div>
  `;
};
