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

let supabase = null;
try {
  if (window.supabase && window.supabase.createClient) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('Supabase client initialized OK');
  } else {
    console.warn('Supabase JS not loaded yet. window.supabase:', typeof window.supabase);
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
  if (supabase) {
    try {
      const { data, error } = await supabase.from('users').select('id').limit(1);
      console.log('initUsers check:', { data, error });
      if (!data || data.length === 0) {
        console.log('Inserting default admin...');
        const { error: insertError } = await supabase.from('users').insert({ ...DEFAULT_ADMIN });
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
  if (supabase) {
    try {
      const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
      if (!error && data) { setLS('users', data); return data; }
    } catch(e) { console.warn('Supabase getUsers failed:', e); }
  }
  return getLS('users');
}

async function addUser(user) {
  user.id = user.id || Date.now();
  user.created_at = user.created_at || new Date().toISOString();
  if (!user.role) user.role = 'user';

  if (supabase) {
    try {
      const { error } = await supabase.from('users').insert(user);
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
  if (supabase) {
    try {
      const { error } = await supabase.from('users').update(data).eq('id', id);
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

  if (supabase) {
    try {
      await supabase.from('users').delete().eq('id', id);
      setLS('users', getLS('users').filter(u => u.id !== id));
      return true;
    } catch(e) { console.warn('Supabase removeUser failed:', e); }
  }

  setLS('users', getLS('users').filter(u => u.id !== id));
  return true;
}

async function authenticateUser(email, password) {
  console.log('authenticateUser called:', email);
  if (supabase) {
    try {
      console.log('Trying Supabase auth...');
      const { data, error } = await supabase.from('users').select('*').eq('email', email).eq('password', password).single();
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
  if (supabase) {
    try {
      const { data, error } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
      if (!error && data) { setLS('documents', data); return data; }
    } catch(e) { console.warn('Supabase getDocuments failed:', e); }
  }
  return getLS('documents');
}

async function addDocument(doc) {
  doc.id = doc.id || Date.now();
  doc.created_at = doc.created_at || new Date().toISOString();

  if (supabase) {
    try {
      const { error } = await supabase.from('documents').insert(doc);
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
  if (supabase) {
    try {
      const docs = await getDocuments();
      const doc = docs.find(d => d.id === id);
      if (doc && doc.file_path) {
        await supabase.storage.from(BUCKET).remove([doc.file_path]);
      }
      await supabase.from('documents').delete().eq('id', id);
      setLS('documents', getLS('documents').filter(d => d.id !== id));
      return;
    } catch(e) { console.warn('Supabase removeDocument failed:', e); }
  }
  setLS('documents', getLS('documents').filter(d => d.id !== id));
}

/* ==================== VIDEOS ==================== */
async function getVideos() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
      if (!error && data) { setLS('videos', data); return data; }
    } catch(e) { console.warn('Supabase getVideos failed:', e); }
  }
  return getLS('videos');
}

async function addVideo(video) {
  video.id = video.id || Date.now();
  video.created_at = video.created_at || new Date().toISOString();
  if (!video.notes) video.notes = [];

  if (supabase) {
    try {
      const { error } = await supabase.from('videos').insert(video);
      if (error) throw error;
      const vids = getLS('videos');
      vids.unshift(video);
      setLS('videos', vids);
      return true;
    } catch(e) { console.warn('Supabase addVideo failed:', e); }
  }

  const vids = getLS('videos');
  vids.unshift(video);
  setLS('videos', vids);
  return true;
}

async function removeVideo(id) {
  if (supabase) {
    try {
      await supabase.from('videos').delete().eq('id', id);
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

  if (supabase) {
    try {
      await supabase.from('videos').update({ notes: v.notes }).eq('id', videoId);
    } catch(e) { console.warn('Supabase addNote failed:', e); }
  }
  setLS('videos', vids);
}

async function removeNoteFromVideo(videoId, noteIndex) {
  const vids = await getVideos();
  const v = vids.find(v => v.id === videoId);
  if (!v) return;

  if (v.notes) v.notes.splice(noteIndex, 1);

  if (supabase) {
    try {
      await supabase.from('videos').update({ notes: v.notes }).eq('id', videoId);
    } catch(e) { console.warn('Supabase removeNote failed:', e); }
  }
  setLS('videos', vids);
}

/* ==================== QUIZZES ==================== */
async function getQuizzes() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('quizzes').select('*').order('created_at', { ascending: false });
      if (!error && data) { setLS('quizzes', data); return data; }
    } catch(e) { console.warn('Supabase getQuizzes failed:', e); }
  }
  return getLS('quizzes');
}

async function addQuiz(quiz) {
  quiz.id = quiz.id || Date.now();
  quiz.created_at = quiz.created_at || new Date().toISOString();

  if (supabase) {
    try {
      const { error } = await supabase.from('quizzes').insert(quiz);
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
  if (supabase) {
    try {
      await supabase.from('quizzes').delete().eq('id', id);
      setLS('quizzes', getLS('quizzes').filter(q => q.id !== id));
      return;
    } catch(e) { console.warn('Supabase removeQuiz failed:', e); }
  }
  setLS('quizzes', getLS('quizzes').filter(q => q.id !== id));
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
