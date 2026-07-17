/* ==================== THEME ==================== */
(function() {
  const saved = localStorage.getItem('enem_theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  }
  const savedFont = localStorage.getItem('enem_font_size');
  if (savedFont) {
    document.documentElement.style.setProperty('--font-size-base', savedFont + 'px');
  }
})();

const THEMES = [
  { id: 'dark',  name: 'Midnight',  group: 'dark',  color: '#a29bfe' },
  { id: 'cafe',  name: 'Cafe',      group: 'dark',  color: '#d4a574' },
  { id: 'ocean', name: 'Ocean',     group: 'dark',  color: '#5bc0eb' },
  { id: 'light', name: 'Classico',  group: 'light', color: '#6c5ce7' },
  { id: 'sakura',name: 'Sakura',    group: 'light', color: '#e06090' },
  { id: 'forest',name: 'Forest',    group: 'light', color: '#2d9a4a' }
];

function setTheme(themeId) {
  document.documentElement.setAttribute('data-theme', themeId);
  localStorage.setItem('enem_theme', themeId);
}

function getTheme() {
  return document.documentElement.getAttribute('data-theme') || 'dark';
}

function setFontSize(sizePx) {
  document.documentElement.style.setProperty('--font-size-base', sizePx + 'px');
  localStorage.setItem('enem_font_size', sizePx);
}

/* ==================== EMOJI PICKER ==================== */
const EMOJI_DATA = {
  'Favoritos': ['\u{1F4AA}','\u{1F4D6}','\u{270F}\u{FE0F}','\u{1F4DA}','\u{1F3AF}','\u{2B50}','\u{2705}','\u{274C}','\u{26A0}\u{FE0F}','\u{1F4A1}','\u{1F680}','\u{1F4DD}','\u{1F525}','\u{1F31F}','\u{1F4AF}','\u{2714}\u{FE0F}'],
  'Emoji': ['\u{1F60A}','\u{1F60D}','\u{1F914}','\u{1F60E}','\u{1F92F}','\u{1F62E}','\u{1F631}','\u{1F970}','\u{1F64F}','\u{1F44D}','\u{1F44E}','\u{1F44B}','\u{1F64C}','\u{1F525}','\u{1F680}','\u{2728}'],
  'Objetos': ['\u{1F4D6}','\u{1F4DA}','\u{270F}\u{FE0F}','\u{1F4D1}','\u{1F4CF}','\u{1F4D0}','\u{1F9EA}','\u{1F52C}','\u{1F4BB}','\u{1F4F0}','\u{1F5DE}\u{FE0F}','\u{1F4D5}','\u{1F4D7}','\u{1F4D8}','\u{1F4D9}','\u{1F4DC}'],
  'Sinais': ['\u{2705}','\u{274C}','\u{26A0}\u{FE0F}','\u{2753}','\u{2757}','\u{2611}\u{FE0F}','\u{1F518}','\u{2B05}\u{FE0F}','\u{27A1}\u{FE0F}','\u{2B06}\u{FE0F}','\u{2B07}\u{FE0F}','\u{267E}\u{FE0F}','\u{267F}','\u{23F0}','\u{1F512}','\u{1F511}'],
  'Natureza': ['\u{1F33F}','\u{1F33B}','\u{1F33A}','\u{1F338}','\u{1F33C}','\u{1F331}','\u{1F332}','\u{1F333}','\u{2600}\u{FE0F}','\u{1F319}','\u{2B50}','\u{2601}\u{FE0F}','\u{26C5}','\u{1F308}','\u{1F30A}','\u{1F30D}'],
  'Bandeiras': ['\u{1F1E7}\u{1F1F7}','\u{1F1FA}\u{1F1F8}','\u{1F1EA}\u{1F1F8}','\u{1F1EE}\u{1F1F9}','\u{1F1EC}\u{1F1E7}','\u{1F1E9}\u{1F1EA}','\u{1F1F5}\u{1F1F9}','\u{1F1F2}\u{1F1FD}','\u{1F1E6}\u{1F1FA}','\u{1F1F0}\u{1F1FF}']
};

function initEmojiPickers() {
  document.querySelectorAll('[data-emoji-target]').forEach(btn => {
    const targetId = btn.getAttribute('data-emoji-target');
    const target = document.getElementById(targetId);
    if (!target) return;

    const picker = document.createElement('div');
    picker.className = 'emoji-picker';
    picker.innerHTML = `
      <div class="emoji-picker-header">
        ${Object.keys(EMOJI_DATA).map((cat, i) =>
          `<button class="emoji-cat-btn${i === 0 ? ' active' : ''}" data-cat="${cat}">${cat}</button>`
        ).join('')}
      </div>
      <div class="emoji-grid"></div>
    `;
    btn.parentElement.style.position = 'relative';
    btn.parentElement.appendChild(picker);

    function renderCat(cat) {
      const grid = picker.querySelector('.emoji-grid');
      grid.innerHTML = '';
      (EMOJI_DATA[cat] || []).forEach(e => {
        const b = document.createElement('button');
        b.className = 'emoji-item';
        b.textContent = e;
        b.addEventListener('click', () => {
          const start = target.selectionStart;
          const end = target.selectionEnd;
          target.value = target.value.slice(0, start) + e + target.value.slice(end);
          target.selectionStart = target.selectionEnd = start + e.length;
          target.focus();
          picker.classList.remove('show');
        });
        grid.appendChild(b);
      });
    }

    picker.querySelectorAll('.emoji-cat-btn').forEach(cb => {
      cb.addEventListener('click', () => {
        picker.querySelectorAll('.emoji-cat-btn').forEach(b => b.classList.remove('active'));
        cb.classList.add('active');
        renderCat(cb.dataset.cat);
      });
    });

    renderCat(Object.keys(EMOJI_DATA)[0]);

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.emoji-picker.show').forEach(p => {
        if (p !== picker) p.classList.remove('show');
      });
      picker.classList.toggle('show');
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.emoji-picker.show').forEach(p => p.classList.remove('show'));
  });
}

/* ==================== SHARED STYLES ==================== */
const style = document.createElement('style');
style.textContent = `
  .admin-only.hidden { display: none !important; }
  .toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 8px;
    pointer-events: none;
  }
  .toast {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 18px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: var(--shadow-lg);
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
    pointer-events: auto;
    animation: toastIn 0.35s cubic-bezier(0.16,1,0.3,1);
    backdrop-filter: blur(12px);
    min-width: 200px;
    max-width: 360px;
  }
  .toast.toast-success { border-left: 3px solid #00b894; }
  .toast.toast-error { border-left: 3px solid #e17055; }
  .toast.toast-info { border-left: 3px solid #74b9ff; }
  .toast-icon { flex-shrink: 0; font-size: 16px; }
  .toast.toast-exit { animation: toastOut 0.3s ease forwards; }
  @keyframes toastIn {
    from { opacity: 0; transform: translateX(40px) scale(0.95); }
    to { opacity: 1; transform: translateX(0) scale(1); }
  }
  @keyframes toastOut {
    to { opacity: 0; transform: translateX(40px) scale(0.95); }
  }
  .btn-back-watch {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 10px;
    color: var(--text-dim);
    font-size: 13px;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .btn-back-watch:hover {
    color: var(--text-primary);
    border-color: var(--border-hover);
    background: var(--bg-card-hover);
  }
  .btn-fullscreen {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 10px;
    color: var(--text-dim);
    font-size: 12px;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .btn-fullscreen:hover {
    color: var(--accent);
    border-color: var(--accent);
    background: var(--accent-bg);
  }

  /* User dropdown menu */
  .user-dropdown {
    position: absolute;
    bottom: 100%;
    left: 0;
    right: 0;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    padding: 6px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(8px);
    transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
    z-index: 200;
    margin-bottom: 8px;
  }
  .user-dropdown.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
  .user-dropdown-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 12px;
    background: none;
    border: none;
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    font-size: 13px;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: all 0.15s ease;
    text-align: left;
  }
  .user-dropdown-item:hover {
    background: var(--bg-card-hover);
    color: var(--text-primary);
  }
  .user-dropdown-item.danger {
    color: #e74c3c;
  }
  .user-dropdown-item.danger:hover {
    background: rgba(231,76,60,0.08);
  }
  .user-dropdown-divider {
    height: 1px;
    background: var(--border);
    margin: 4px 0;
  }
  .sidebar-footer { position: relative; }

  /* Settings modal theme grid */
  .theme-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 20px;
  }
  .theme-card {
    padding: 12px;
    border-radius: var(--radius-md);
    border: 2px solid var(--border);
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
  }
  .theme-card:hover {
    border-color: var(--border-hover);
    transform: translateY(-1px);
  }
  .theme-card.active {
    border-color: var(--accent);
    box-shadow: 0 0 12px var(--accent-glow);
  }
  .theme-card-preview {
    display: flex;
    gap: 3px;
    justify-content: center;
    margin-bottom: 8px;
  }
  .theme-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1px solid rgba(0,0,0,0.1);
  }
  .theme-card-name {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-secondary);
  }
  .theme-card-group {
    font-size: 10px;
    color: var(--text-dim);
    margin-top: 2px;
  }

  /* Font size control */
  .font-size-control {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }
  .font-size-control label {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
    flex-shrink: 0;
    min-width: 100px;
  }
  .font-size-control input[type="range"] {
    flex: 1;
    accent-color: var(--accent);
    height: 4px;
  }
  .font-size-value {
    font-size: 13px;
    font-weight: 700;
    color: var(--text-primary);
    min-width: 36px;
    text-align: right;
  }
  .font-size-preview {
    padding: 12px;
    background: var(--bg-sidebar);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 16px;
  }

  /* Logo styles */
  .sidebar-logo-img {
    height: 28px;
    width: auto;
    margin-right: 4px;
  }
  .login-logo-img {
    height: 64px;
    width: auto;
    margin-bottom: 16px;
  }
`;
document.head.appendChild(style);

/* ==================== SIDEBAR ==================== */
function updateSidebarUser() {
  const user = JSON.parse(sessionStorage.getItem('enem_currentUser') || 'null');
  if (!user) return;

  const avatar = document.querySelector('.sidebar-footer .avatar');
  if (avatar) {
    avatar.textContent = (user.name || '').charAt(0).toUpperCase();
  }

  const nameEl = document.querySelector('.user-name');
  if (nameEl) nameEl.textContent = user.name || '';

  const roleEl = document.querySelector('.user-role');
  if (roleEl) roleEl.textContent = user.role === 'admin' ? 'Administrador' : 'Estudante';

  document.querySelectorAll('.admin-only').forEach(el => {
    if (user.role === 'admin') {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  });
}

function initSidebar() {
  initUserMenu();
  initSidebarCollapse();
}

function initUserMenu() {
  const userArea = document.querySelector('.sidebar-footer .user');
  if (!userArea) return;

  userArea.style.cursor = 'pointer';

  const dropdown = document.createElement('div');
  dropdown.className = 'user-dropdown';
  dropdown.innerHTML = `
    <button class="user-dropdown-item" id="btnSettings">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      Configuracoes
    </button>
    <div class="user-dropdown-divider"></div>
    <button class="user-dropdown-item danger" id="btnLogoutSidebar">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      Sair
    </button>
  `;
  userArea.style.position = 'relative';
  userArea.appendChild(dropdown);

  userArea.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelectorAll('.user-dropdown.show').forEach(d => {
      if (d !== dropdown) d.classList.remove('show');
    });
    dropdown.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    dropdown.classList.remove('show');
  });

  document.getElementById('btnLogoutSidebar').addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.remove('show');
    logout();
  });

  document.getElementById('btnSettings').addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.remove('show');
    openSettings();
  });
}

function initSidebarCollapse() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  let collapseBtn = sidebar.querySelector('.sidebar-collapse-btn');
  if (!collapseBtn) {
    collapseBtn = document.createElement('button');
    collapseBtn.className = 'sidebar-collapse-btn';
    collapseBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
    sidebar.appendChild(collapseBtn);
  }

  const saved = localStorage.getItem('enem_sidebar_collapsed');
  if (saved === 'true') {
    sidebar.classList.add('collapsed');
    collapseBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;
  }

  collapseBtn.addEventListener('click', () => {
    const isCollapsed = sidebar.classList.toggle('collapsed');
    localStorage.setItem('enem_sidebar_collapsed', isCollapsed);
    collapseBtn.innerHTML = isCollapsed
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
  });
}

function renderSidebar(activePage) {
  const user = getCurrentUser();
  const userName = user ? user.name : 'Estudante';
  const userInitial = (userName.split(' ')[0] || 'P')[0].toUpperCase();
  const isAdmin = user && user.role === 'admin';

  const pages = [
    { id: 'home', href: 'home.html', label: 'Inicio', icon: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>' },
    { id: 'documents', href: 'documents.html', label: 'Documentos', icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>' },
    { id: 'videos', href: 'videos.html', label: 'Videos', icon: '<polygon points="23,7 16,12 23,17"/><rect x="1" y="5" width="15" height="14" rx="2"/>' },
    { id: 'quizzes', href: 'quizzes.html', label: 'Quizzes', icon: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>' }
  ];

  const adminPages = [
    { id: 'users', href: 'users.html', label: 'Usuarios', icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' }
  ];

  const allPages = isAdmin ? [...pages, ...adminPages] : pages;

  const navLinks = allPages.map(p => `
    <a href="${p.href}" class="nav-item${activePage === p.id ? ' active' : ''}" data-tooltip="${p.label}">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p.icon}</svg>
      <span>${p.label}</span>
    </a>`).join('');

  return `
    <aside class="sidebar">
      <div class="sidebar-header">
        <a href="home.html" class="logo-link">
          <img src="img/logo.png" alt="ENEM" class="sidebar-logo-img" onerror="this.style.display='none'">
          <span class="logo">ENEM</span>
          <span class="logo-sub">Study</span>
        </a>
      </div>
      <nav class="nav">
        ${navLinks}
      </nav>
      <div class="sidebar-footer">
        <div class="user">
          <div class="avatar">${userInitial}</div>
          <div class="user-info">
            <span class="user-name">${userName}</span>
            <span class="user-role">${isAdmin ? 'Administrador' : 'Estudante'}</span>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left:auto;color:var(--text-dim);flex-shrink:0"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>
    </aside>`;
}

/* ==================== SETTINGS MODAL ==================== */
function openSettings() {
  let overlay = document.getElementById('settingsOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'settingsOverlay';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal" style="width:480px;">
        <div class="modal-header">
          <h2>Configuracoes</h2>
          <button class="modal-close" id="settingsClose">&times;</button>
        </div>
        <div style="padding-bottom:8px">
          <h3 style="font-size:13px;font-weight:700;color:var(--text-secondary);margin-bottom:12px;">Tema</h3>
          <div class="theme-grid" id="themeGrid"></div>

          <h3 style="font-size:13px;font-weight:700;color:var(--text-secondary);margin-bottom:12px;">Tamanho da Fonte</h3>
          <div class="font-size-control">
            <label>Aa</label>
            <input type="range" id="fontSizeSlider" min="11" max="18" step="1" value="${parseInt(localStorage.getItem('enem_font_size') || '14')}">
            <span class="font-size-value" id="fontSizeValue">${parseInt(localStorage.getItem('enem_font_size') || '14')}px</span>
          </div>
          <div class="font-size-preview" id="fontSizePreview">
            <p>Texto de exemplo para visualizar o tamanho da fonte.</p>
          </div>

          <h3 style="font-size:13px;font-weight:700;color:var(--text-secondary);margin-bottom:12px;">Compactar sidebar</h3>
          <label style="display:flex;align-items:center;gap:10px;cursor:pointer;margin-bottom:16px;">
            <input type="checkbox" id="compactSidebarCheck" ${localStorage.getItem('enem_sidebar_collapsed') === 'true' ? 'checked' : ''} style="accent-color:var(--accent);width:16px;height:16px;">
            <span style="font-size:13px;color:var(--text-secondary)">Iniciar sidebar compacta</span>
          </label>

          <button class="btn-submit" id="settingsReset" style="background:var(--bg-card-hover);color:var(--text-secondary);border:1px solid var(--border);">
            Restaurar padroes
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const grid = document.getElementById('themeGrid');
    THEMES.forEach(t => {
      const card = document.createElement('div');
      card.className = 'theme-card' + (getTheme() === t.id ? ' active' : '');
      card.dataset.theme = t.id;
      const colors = getThemePreviewColors(t.id);
      card.innerHTML = `
        <div class="theme-card-preview">
          <div class="theme-dot" style="background:${colors[0]}"></div>
          <div class="theme-dot" style="background:${colors[1]}"></div>
          <div class="theme-dot" style="background:${colors[2]}"></div>
          <div class="theme-dot" style="background:${colors[3]}"></div>
        </div>
        <div class="theme-card-name">${t.name}</div>
        <div class="theme-card-group">${t.group === 'dark' ? 'Escuro' : 'Claro'}</div>
      `;
      card.addEventListener('click', () => {
        setTheme(t.id);
        grid.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        updateFontSizePreview();
        showToast('Tema alterado para ' + t.name, 'success');
      });
      grid.appendChild(card);
    });

    const slider = document.getElementById('fontSizeSlider');
    const valueEl = document.getElementById('fontSizeValue');
    slider.addEventListener('input', () => {
      const val = slider.value;
      valueEl.textContent = val + 'px';
      setFontSize(val);
      updateFontSizePreview();
    });

    document.getElementById('compactSidebarCheck').addEventListener('change', function() {
      localStorage.setItem('enem_sidebar_collapsed', this.checked);
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        sidebar.classList.toggle('collapsed', this.checked);
        const collapseBtn = sidebar.querySelector('.sidebar-collapse-btn');
        if (collapseBtn) {
          collapseBtn.innerHTML = this.checked
            ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`
            : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
        }
      }
    });

    document.getElementById('settingsReset').addEventListener('click', () => {
      setTheme('dark');
      setFontSize(14);
      localStorage.removeItem('enem_sidebar_collapsed');
      slider.value = 14;
      valueEl.textContent = '14px';
      document.getElementById('compactSidebarCheck').checked = false;
      grid.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
      grid.querySelector('[data-theme="dark"]').classList.add('active');
      updateFontSizePreview();
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) sidebar.classList.remove('collapsed');
      showToast('Configuracoes restauradas', 'success');
    });

    document.getElementById('settingsClose').addEventListener('click', () => {
      overlay.classList.remove('show');
    });
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('show');
    });
  }

  function updateFontSizePreview() {
    const preview = document.getElementById('fontSizePreview');
    if (preview) preview.style.fontSize = 'var(--font-size-base)';
  }

  overlay.classList.add('show');
}

function getThemePreviewColors(themeId) {
  const themes = {
    dark:  ['#111113', '#1e1e22', '#a29bfe', '#ededef'],
    cafe:  ['#241c16', '#3a2e22', '#d4a574', '#f0e6d8'],
    ocean: ['#111820', '#1c2632', '#5bc0eb', '#e0e8f0'],
    light: ['#ffffff', '#e4e4e7', '#6c5ce7', '#18181b'],
    sakura:['#ffffff', '#f0d4dc', '#e06090', '#2d1a22'],
    forest:['#ffffff', '#c8dcc8', '#2d9a4a', '#1a2418']
  };
  return themes[themeId] || themes.dark;
}

/* ==================== RIPPLE EFFECT ==================== */
function initRipples() {
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn-primary, .btn-submit, .btn-login, .btn-play, .btn-quiz, .ripple-container, button[role="submit"]');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    btn.style.position = btn.style.position || 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}

/* ==================== SKELETON LOADERS ==================== */
function showSkeletons(container, count, type) {
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'skeleton skeleton-' + (type || 'card');
    el.style.animationDelay = (i * 0.1) + 's';
    container.appendChild(el);
  }
}

/* ==================== FLOATING WIDGET ==================== */
function initFloatingWidget() {
  if (document.querySelector('.floating-widget') || !document.querySelector('.main')) return;
  
  const user = getCurrentUser();
  if (!user) return;

  const widget = document.createElement('div');
  widget.className = 'floating-widget';
  widget.innerHTML = `
    <div class="widget-panel" id="widgetPanel">
      <div class="widget-tabs">
        <button class="widget-tab active" data-tab="notes">Rascunho</button>
        <button class="widget-tab" data-tab="calc">Calculadora</button>
      </div>
      <div class="widget-body" id="widgetBody">
        <div id="tabNotes">
          <textarea id="widgetNotes" placeholder="Escreva seus apontamentos aqui...">${localStorage.getItem('enem_widget_notes') || ''}</textarea>
        </div>
        <div id="tabCalc" style="display:none">
          <div class="calc-display" id="calcDisplay">0</div>
          <div class="calc-grid">
            <button class="calc-btn" data-val="C">C</button>
            <button class="calc-btn op" data-val="(">(</button>
            <button class="calc-btn op" data-val=")">)</button>
            <button class="calc-btn op" data-val="/">&divide;</button>
            <button class="calc-btn" data-val="7">7</button>
            <button class="calc-btn" data-val="8">8</button>
            <button class="calc-btn" data-val="9">9</button>
            <button class="calc-btn op" data-val="*">&times;</button>
            <button class="calc-btn" data-val="4">4</button>
            <button class="calc-btn" data-val="5">5</button>
            <button class="calc-btn" data-val="6">6</button>
            <button class="calc-btn op" data-val="-">&minus;</button>
            <button class="calc-btn" data-val="1">1</button>
            <button class="calc-btn" data-val="2">2</button>
            <button class="calc-btn" data-val="3">3</button>
            <button class="calc-btn op" data-val="+">+</button>
            <button class="calc-btn" data-val="0">0</button>
            <button class="calc-btn" data-val=".">.</button>
            <button class="calc-btn" data-val="backspace">&larr;</button>
            <button class="calc-btn eq" data-val="=">=</button>
          </div>
        </div>
      </div>
    </div>
    <button class="widget-toggle" id="widgetToggle">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
    </button>
  `;
  document.body.appendChild(widget);

  document.getElementById('widgetToggle').addEventListener('click', () => {
    document.getElementById('widgetPanel').classList.toggle('show');
  });

  document.querySelectorAll('.widget-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.widget-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tabNotes').style.display = tab.dataset.tab === 'notes' ? '' : 'none';
      document.getElementById('tabCalc').style.display = tab.dataset.tab === 'calc' ? '' : 'none';
    });
  });

  const notesArea = document.getElementById('widgetNotes');
  notesArea.addEventListener('input', () => {
    localStorage.setItem('enem_widget_notes', notesArea.value);
  });

  const calcDisplay = document.getElementById('calcDisplay');
  let calcExpr = '';
  document.querySelectorAll('.calc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.val;
      if (val === 'C') { calcExpr = ''; calcDisplay.textContent = '0'; }
      else if (val === 'backspace') { calcExpr = calcExpr.slice(0, -1); calcDisplay.textContent = calcExpr || '0'; }
      else if (val === '=') {
        try { calcDisplay.textContent = Function('"use strict";return (' + calcExpr + ')')(); calcExpr = calcDisplay.textContent; }
        catch { calcDisplay.textContent = 'Erro'; calcExpr = ''; }
      }
      else { calcExpr += val; calcDisplay.textContent = calcExpr; }
    });
  });
}

/* ==================== FOCUS MODE ==================== */
function initFocusMode() {
  window.enableFocusMode = function(contentEl) {
    document.body.classList.add('focus-active');
    let overlay = document.querySelector('.focus-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'focus-overlay';
      document.body.appendChild(overlay);
    }
    overlay.classList.add('active');
    overlay.onclick = function() { window.disableFocusMode(); };
  };

  window.disableFocusMode = function() {
    document.body.classList.remove('focus-active');
    const overlay = document.querySelector('.focus-overlay');
    if (overlay) overlay.classList.remove('active');
  };
}

/* ==================== TOAST NOTIFICATIONS ==================== */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '\u2705', error: '\u274C', info: '\u2139\uFE0F' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* ==================== INIT ==================== */
document.addEventListener('DOMContentLoaded', () => {
  initRipples();
  initFloatingWidget();
  initFocusMode();

  if (document.querySelector('.right-panel')) {
    return;
  }
  const user = requireAuth();
  if (user) updateSidebarUser();
});
