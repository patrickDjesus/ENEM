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

/* ==================== INIT ==================== */
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initEmojiPickers();
});
