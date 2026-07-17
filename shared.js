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

/* ==================== INIT ==================== */
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initEmojiPickers();
  initSidebar();

  if (!document.querySelector('.right-panel')) {
    const user = requireAuth();
    if (user) updateSidebarUser();
  }
});
