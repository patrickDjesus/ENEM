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
  const nav = document.querySelector('.nav');
  if (nav) {
    const usuariosLink = document.createElement('a');
    usuariosLink.href = 'users.html';
    usuariosLink.className = 'nav-item admin-only hidden';
    usuariosLink.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Usuarios`;
    nav.appendChild(usuariosLink);
  }

  const sidebarFooter = document.querySelector('.sidebar-footer');
  if (sidebarFooter) {
    const userDiv = sidebarFooter.querySelector('.user');
    const logoutBtn = document.createElement('button');
    logoutBtn.id = 'logoutBtn';
    logoutBtn.className = 'logout-btn';
    logoutBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> Sair`;
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

/* ==================== INIT ==================== */
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initEmojiPickers();
  initSidebar();
  initRipples();
  initFloatingWidget();
  initFocusMode();

  if (!document.querySelector('.right-panel')) {
    const user = requireAuth();
    if (user) updateSidebarUser();
  }
});
