/* ==================== SUBJECTS ==================== */
const SUBJECTS = {
  biologia:    { name: 'Biologia',    color: '#00b894', colorLight: 'rgba(0,184,148,0.12)' },
  fisica:      { name: 'Física',      color: '#0984e3', colorLight: 'rgba(9,132,227,0.12)' },
  quimica:     { name: 'Química',     color: '#e17055', colorLight: 'rgba(225,112,85,0.12)' },
  historia:    { name: 'História',    color: '#b2bec3', colorLight: 'rgba(178,190,195,0.12)' },
  matematica:  { name: 'Matemática',  color: '#6c5ce7', colorLight: 'rgba(108,92,231,0.12)' },
  geografia:   { name: 'Geografia',   color: '#00cec9', colorLight: 'rgba(0,206,201,0.12)' },
  filosofia:   { name: 'Filosofia',   color: '#a29bfe', colorLight: 'rgba(162,155,254,0.12)' },
  linguagens:  { name: 'Linguagens',  color: '#fd79a8', colorLight: 'rgba(253,121,168,0.12)' }
};

/* ==================== SUPABASE CLIENT ==================== */
const SUPABASE_URL = 'https://pymtagngzrzupbvbarrl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_zapw9ov_DxM2BnJU5wG58A_Y8eVZphO';
const BUCKET = 'documents';

let sb = null;
try {
  if (window.supabase && window.supabase.createClient) {
    sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('Supabase client initialized OK');
  } else {
    console.warn('Supabase JS not loaded. window.supabase:', typeof window.supabase);
  }
} catch(e) {
  console.warn('Supabase init failed:', e);
}

/* ==================== LOCALSTORAGE HELPERS ==================== */
function getLS(key) {
  try { return JSON.parse(localStorage.getItem('enem_' + key)) || []; }
  catch { return []; }
}

function setLS(key, data) {
  localStorage.setItem('enem_' + key, JSON.stringify(data));
}

/* ==================== USERS ==================== */
const DEFAULT_ADMIN = {
  id: 1,
  name: 'Administrador',
  email: 'admin@enem.com',
  password: 'admin123',
  role: 'admin',
  created_at: '2025-01-01T00:00:00.000Z'
};

async function initUsers() {
  if (sb) {
    try {
      const { data, error } = await sb.from('users').select('id').limit(1);
      console.log('initUsers check:', { data, error });
      if (!data || data.length === 0) {
        console.log('Inserting default admin...');
        const { error: insertError } = await sb.from('users').insert({ ...DEFAULT_ADMIN });
        console.log('Admin insert result:', insertError);
      }
      return;
    } catch(e) { console.warn('Supabase users init failed:', e); }
  }
  const users = getLS('users');
  if (users.length === 0) {
    setLS('users', [{ ...DEFAULT_ADMIN }]);
  }
}

async function getUsers() {
  if (sb) {
    try {
      const { data, error } = await sb.from('users').select('*').order('created_at', { ascending: false });
      if (!error && data) { setLS('users', data); return data; }
    } catch(e) { console.warn('Supabase getUsers failed:', e); }
  }
  return getLS('users');
}

async function addUser(user) {
  user.id = user.id || Date.now();
  user.created_at = user.created_at || new Date().toISOString();
  if (!user.role) user.role = 'user';

  if (sb) {
    try {
      const { error } = await sb.from('users').insert(user);
      if (error) {
        if (error.code === '23505') return false;
        throw error;
      }
      const users = getLS('users');
      users.unshift(user);
      setLS('users', users);
      return true;
    } catch(e) { console.warn('Supabase addUser failed:', e); }
  }

  const users = getLS('users');
  if (users.find(u => u.email === user.email)) return false;
  users.unshift(user);
  setLS('users', users);
  return true;
}

async function updateUser(id, data) {
  if (sb) {
    try {
      const { error } = await sb.from('users').update(data).eq('id', id);
      if (error) {
        if (error.code === '23505') return false;
        throw error;
      }
      const users = getLS('users');
      const idx = users.findIndex(u => u.id === id);
      if (idx !== -1) Object.assign(users[idx], data);
      setLS('users', users);
      return true;
    } catch(e) { console.warn('Supabase updateUser failed:', e); }
  }

  const users = getLS('users');
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return false;
  if (data.email && data.email !== users[idx].email) {
    if (users.find(u => u.email === data.email && u.id !== id)) return false;
  }
  Object.assign(users[idx], data);
  setLS('users', users);
  return true;
}

async function removeUser(id) {
  if (id === 1) return false;

  if (sb) {
    try {
      await sb.from('users').delete().eq('id', id);
      setLS('users', getLS('users').filter(u => u.id !== id));
      return true;
    } catch(e) { console.warn('Supabase removeUser failed:', e); }
  }

  setLS('users', getLS('users').filter(u => u.id !== id));
  return true;
}

async function authenticateUser(email, password) {
  console.log('authenticateUser called:', email);
  if (sb) {
    try {
      console.log('Trying Supabase auth...');
      const { data, error } = await sb.from('users').select('*').eq('email', email).eq('password', password).single();
      console.log('Supabase result:', { data, error });
      if (!error && data) return data;
    } catch(e) { console.warn('Supabase auth failed:', e); }
  } else {
    console.warn('Supabase not available, using localStorage fallback');
  }

  await initUsers();
  const users = getLS('users');
  console.log('localStorage users:', users);
  return users.find(u => u.email === email && u.password === password) || null;
}

/* ==================== SESSION ==================== */
function getCurrentUser() {
  try {
    const data = sessionStorage.getItem('enem_currentUser');
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

function setCurrentUser(user) {
  sessionStorage.setItem('enem_currentUser', JSON.stringify(user));
}

function logout() {
  sessionStorage.removeItem('enem_currentUser');
  window.location.href = 'index.html';
}

function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'index.html';
    return null;
  }
  return user;
}

function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === 'admin';
}

/* ==================== DOCUMENTS ==================== */
async function getDocuments() {
  if (sb) {
    try {
      const { data, error } = await sb.from('documents').select('*').order('created_at', { ascending: false });
      if (!error && data) { setLS('documents', data); return data; }
    } catch(e) { console.warn('Supabase getDocuments failed:', e); }
  }
  return getLS('documents');
}

async function addDocument(doc) {
  doc.id = doc.id || Date.now();
  doc.created_at = doc.created_at || new Date().toISOString();

  if (sb) {
    try {
      const { error } = await sb.from('documents').insert(doc);
      if (error) throw error;
      const docs = getLS('documents');
      docs.unshift(doc);
      setLS('documents', docs);
      return true;
    } catch(e) { console.warn('Supabase addDocument failed:', e); }
  }

  const docs = getLS('documents');
  docs.unshift(doc);
  setLS('documents', docs);
  return true;
}

async function removeDocument(id) {
  if (sb) {
    try {
      const docs = await getDocuments();
      const doc = docs.find(d => d.id === id);
      if (doc && doc.file_path) {
        try { await sb.storage.from(BUCKET).remove([doc.file_path]); } catch(e) { console.warn('Storage remove skipped:', e); }
      }
      await sb.from('documents').delete().eq('id', id);
      setLS('documents', getLS('documents').filter(d => d.id !== id));
      return;
    } catch(e) { console.warn('Supabase removeDocument failed:', e); }
  }
  setLS('documents', getLS('documents').filter(d => d.id !== id));
}

/* ==================== VIDEOS ==================== */
async function getVideos() {
  if (sb) {
    try {
      const { data, error } = await sb.from('videos').select('*').order('created_at', { ascending: false });
      if (!error && data) { setLS('videos', data); return data; }
    } catch(e) { console.warn('Supabase getVideos failed:', e); }
  }
  return getLS('videos');
}

async function addVideo(video) {
  video.id = video.id || Date.now();
  video.created_at = video.created_at || new Date().toISOString();
  video.notes = video.notes || [];
  const user = getCurrentUser();
  if (!video.user_id && user) video.user_id = user.id;

  if (sb) {
    try {
      const { error } = await sb.from('videos').insert(video);
      if (error) throw error;
      const vids = getLS('videos');
      vids.unshift(video);
      setLS('videos', vids);
      return true;
    } catch(e) { console.warn('Supabase addVideo failed, using localStorage:', e); }
  }

  const vids = getLS('videos');
  vids.unshift(video);
  setLS('videos', vids);
  return true;
}

async function removeVideo(id) {
  if (sb) {
    try {
      await sb.from('videos').delete().eq('id', id);
      setLS('videos', getLS('videos').filter(v => v.id !== id));
      return;
    } catch(e) { console.warn('Supabase removeVideo failed:', e); }
  }
  setLS('videos', getLS('videos').filter(v => v.id !== id));
}

async function addNoteToVideo(videoId, noteText) {
  const vids = await getVideos();
  const v = vids.find(v => v.id === videoId);
  if (!v) return;

  if (!v.notes) v.notes = [];
  v.notes.unshift({ text: noteText, created_at: new Date().toISOString() });

  if (sb) {
    try {
      await sb.from('videos').update({ notes: v.notes }).eq('id', videoId);
    } catch(e) { console.warn('Supabase addNote failed:', e); }
  }
  setLS('videos', vids);
}

async function removeNoteFromVideo(videoId, noteIndex) {
  const vids = await getVideos();
  const v = vids.find(v => v.id === videoId);
  if (!v) return;

  if (v.notes) v.notes.splice(noteIndex, 1);

  if (sb) {
    try {
      await sb.from('videos').update({ notes: v.notes }).eq('id', videoId);
    } catch(e) { console.warn('Supabase removeNote failed:', e); }
  }
  setLS('videos', vids);
}

/* ==================== QUIZZES ==================== */
async function getQuizzes() {
  if (sb) {
    try {
      const { data, error } = await sb.from('quizzes').select('*').order('created_at', { ascending: false });
      if (!error && data) { setLS('quizzes', data); return data; }
    } catch(e) { console.warn('Supabase getQuizzes failed:', e); }
  }
  return getLS('quizzes');
}

async function addQuiz(quiz) {
  quiz.id = quiz.id || Date.now();
  quiz.created_at = quiz.created_at || new Date().toISOString();

  if (sb) {
    try {
      const { error } = await sb.from('quizzes').insert(quiz);
      if (error) throw error;
      const quizzes = getLS('quizzes');
      quizzes.unshift(quiz);
      setLS('quizzes', quizzes);
      return true;
    } catch(e) { console.warn('Supabase addQuiz failed:', e); }
  }

  const quizzes = getLS('quizzes');
  quizzes.unshift(quiz);
  setLS('quizzes', quizzes);
  return true;
}

async function removeQuiz(id) {
  if (sb) {
    try {
      await sb.from('quizzes').delete().eq('id', id);
      setLS('quizzes', getLS('quizzes').filter(q => q.id !== id));
      return;
    } catch(e) { console.warn('Supabase removeQuiz failed:', e); }
  }
  setLS('quizzes', getLS('quizzes').filter(q => q.id !== id));
}

/* ==================== PINS (FAVORITES) ==================== */
function getPinned() {
  return getLS('pinned');
}

function togglePin(type, id) {
  const pins = getPinned();
  const key = type + '_' + id;
  const idx = pins.indexOf(key);
  if (idx >= 0) { pins.splice(idx, 1); } else { pins.push(key); }
  setLS('pinned', pins);
  return idx < 0;
}

function isPinned(type, id) {
  return getPinned().includes(type + '_' + id);
}

/* ==================== PROGRESS (CONTINUE WHERE LEFT OFF) ==================== */
function saveProgress(type, id, data) {
  const progress = getLS('progress');
  const key = type + '_' + id;
  const existing = progress.findIndex(p => p.key === key);
  const entry = { key, type, id, ...data, updated_at: new Date().toISOString() };
  if (existing >= 0) progress[existing] = entry; else progress.push(entry);
  setLS('progress', progress);
}

function getProgress(type, id) {
  const progress = getLS('progress');
  return progress.find(p => p.key === (type + '_' + id)) || null;
}

function getRecentProgress() {
  const progress = getLS('progress');
  return progress.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)).slice(0, 5);
}

/* ==================== COMMENTS ==================== */
async function getComments(targetType, targetId) {
  if (sb) {
    try {
      const { data, error } = await sb.from('comments')
        .select('*')
        .eq('target_type', targetType)
        .eq('target_id', targetId)
        .order('created_at', { ascending: true });
      if (!error && data) { setLS('comments_' + targetType + '_' + targetId, data); return data; }
    } catch(e) { console.warn('Supabase getComments failed:', e); }
  }
  return getLS('comments_' + targetType + '_' + targetId);
}

async function addComment(targetType, targetId, userId, userName, text) {
  const comment = {
    id: Date.now(),
    target_type: targetType,
    target_id: targetId,
    user_id: userId,
    user_name: userName,
    text,
    created_at: new Date().toISOString()
  };
  if (sb) {
    try {
      const { error } = await sb.from('comments').insert(comment);
      if (error) throw error;
    } catch(e) { console.warn('Supabase addComment failed:', e); }
  }
  const key = 'comments_' + targetType + '_' + targetId;
  const comments = getLS(key);
  comments.push(comment);
  setLS(key, comments);
  return comment;
}

async function removeComment(targetType, targetId, commentId) {
  if (sb) {
    try { await sb.from('comments').delete().eq('id', commentId); } catch(e) {}
  }
  const key = 'comments_' + targetType + '_' + targetId;
  setLS(key, getLS(key).filter(c => c.id !== commentId));
}

/* ==================== QUIZ RESULTS (RANKING) ==================== */
async function saveQuizResult(quizId, quizTitle, userId, userName, score, total, subject) {
  const result = {
    id: Date.now(),
    quiz_id: quizId,
    quiz_title: quizTitle,
    user_id: userId,
    user_name: userName,
    score,
    total,
    pct: Math.round((score / total) * 100),
    subject,
    created_at: new Date().toISOString()
  };
  if (sb) {
    try {
      const { error } = await sb.from('quiz_results').insert(result);
      if (error) throw error;
    } catch(e) { console.warn('Supabase saveQuizResult failed:', e); }
  }
  const results = getLS('quiz_results');
  results.push(result);
  setLS('quiz_results', results);
  return result;
}

async function getRanking() {
  let results = [];
  if (sb) {
    try {
      const { data, error } = await sb.from('quiz_results').select('*').order('created_at', { ascending: false });
      if (!error && data) { results = data; setLS('quiz_results', data); }
    } catch(e) {}
  }
  if (results.length === 0) results = getLS('quiz_results');
  
  const userStats = {};
  results.forEach(r => {
    if (!userStats[r.user_id]) {
      userStats[r.user_id] = { user_id: r.user_id, user_name: r.user_name, total_score: 0, total_quizzes: 0, best_pct: 0 };
    }
    userStats[r.user_id].total_score += r.pct;
    userStats[r.user_id].total_quizzes++;
    userStats[r.user_id].best_pct = Math.max(userStats[r.user_id].best_pct, r.pct);
  });
  
  return Object.values(userStats)
    .map(u => ({ ...u, avg_pct: Math.round(u.total_score / u.total_quizzes) }))
    .sort((a, b) => b.avg_pct - a.avg_pct || b.total_quizzes - a.total_quizzes);
}

async function getWeeklyRanking() {
  let results = [];
  if (sb) {
    try {
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
      const { data, error } = await sb.from('quiz_results').select('*').gte('created_at', weekAgo).order('created_at', { ascending: false });
      if (!error && data) { results = data; }
    } catch(e) {}
  }
  if (results.length === 0) {
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    results = getLS('quiz_results').filter(r => r.created_at >= weekAgo);
  }
  
  const userStats = {};
  results.forEach(r => {
    if (!userStats[r.user_id]) {
      userStats[r.user_id] = { user_id: r.user_id, user_name: r.user_name, total_score: 0, total_quizzes: 0 };
    }
    userStats[r.user_id].total_score += r.pct;
    userStats[r.user_id].total_quizzes++;
  });
  
  return Object.values(userStats)
    .map(u => ({ ...u, avg_pct: Math.round(u.total_score / u.total_quizzes) }))
    .sort((a, b) => b.avg_pct - a.avg_pct);
}

/* ==================== TIME ESTIMATES ==================== */
function estimateTime(type, data) {
  if (type === 'doc') {
    const sizeMB = parseFloat(data.file_size) || 1;
    return Math.max(5, Math.round(sizeMB * 8));
  }
  if (type === 'video') return 12;
  if (type === 'quiz') return Math.max(3, (data.questions ? data.questions.length : 5) * 2);
  return 5;
}

/* ==================== YOUTUBE ==================== */
function getYoutubeId(url) {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?.*v=)([^&?/]+)/,
    /(?:youtu\.be\/)([^?]+)/,
    /(?:youtube\.com\/embed\/)([^?]+)/,
    /(?:youtube\.com\/v\/)([^?]+)/,
    /(?:youtube\.com\/shorts\/)([^?/]+)/
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

/* ==================== DATE FORMAT ==================== */
function formatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'agora';
  if (diff < 3600000) return 'há ' + Math.floor(diff / 60000) + ' min';
  if (diff < 86400000) return 'há ' + Math.floor(diff / 3600000) + 'h';
  if (diff < 172800000) return 'ontem';
  return d.toLocaleDateString('pt-BR');
}
