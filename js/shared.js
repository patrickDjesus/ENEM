/* ==================== THEME ==================== */
(function() {
  const saved = localStorage.getItem('enem_theme');
  if (saved === 'light' || saved === 'dark') {
    document.documentElement.setAttribute('data-theme', saved);
  }
})();

function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('enem_theme', next);
  });
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
  .logout-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--text-dim);
    font-size: 12px;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    margin-bottom: 8px;
  }
  .logout-btn:hover {
    color: #e74c3c;
    border-color: rgba(231,76,60,0.3);
    background: rgba(231,76,60,0.08);
  }
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
  const sidebarFooter = document.querySelector('.sidebar-footer');
  if (sidebarFooter) {
    const userDiv = sidebarFooter.querySelector('.user');
    const logoutBtn = document.createElement('button');
    logoutBtn.id = 'logoutBtn';
    logoutBtn.className = 'logout-btn';
    logoutBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg><span>Sair</span>`;
    if (userDiv) {
      sidebarFooter.insertBefore(logoutBtn, userDiv);
    } else {
      sidebarFooter.appendChild(logoutBtn);
    }
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => logout());
  }

  initSidebarCollapse();
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
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';

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
          <span class="logo">ENEM</span>
          <span class="logo-sub">Study</span>
        </a>
      </div>
      <nav class="nav">
        ${navLinks}
      </nav>
      <div class="sidebar-footer">
        <button class="theme-toggle" id="themeToggle">
          <svg class="icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          <svg class="icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          <span>Tema</span>
          <div class="toggle-track"><div class="toggle-thumb"></div></div>
        </button>
        <div class="user">
          <div class="avatar">${userInitial}</div>
          <div class="user-info">
            <span class="user-name">${userName}</span>
            <span class="user-role">${isAdmin ? 'Administrador' : 'Estudante'}</span>
          </div>
        </div>
      </div>
    </aside>`;
}

/* ==================== RIPPLE EFFECT ==================== */
function initRipples() {
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn-primary, .btn-submit, .btn-login, .btn-play, .btn-quiz, button[role="submit"]');
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

  if (!document.querySelector('.right-panel') && !document.getElementById('sidebarRoot')) {
    const user = requireAuth();
    if (user) updateSidebarUser();
  }
});
