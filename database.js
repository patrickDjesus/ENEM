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

function getDB(key) {
  try { return JSON.parse(localStorage.getItem('enem_' + key)) || []; }
  catch { return []; }
}

function setDB(key, data) {
  localStorage.setItem('enem_' + key, JSON.stringify(data));
}

function addDocument(doc) {
  const docs = getDB('documents');
  doc.id = Date.now();
  doc.createdAt = new Date().toISOString();
  docs.unshift(doc);
  setDB('documents', docs);
}

function removeDocument(id) {
  setDB('documents', getDB('documents').filter(d => d.id !== id));
}

function addVideo(video) {
  const vids = getDB('videos');
  video.id = Date.now();
  video.createdAt = new Date().toISOString();
  if (!video.notes) video.notes = [];
  vids.unshift(video);
  setDB('videos', vids);
}

function removeVideo(id) {
  setDB('videos', getDB('videos').filter(v => v.id !== id));
}

function addNoteToVideo(videoId, noteText) {
  const vids = getDB('videos');
  const v = vids.find(v => v.id === videoId);
  if (v) {
    v.notes.unshift({ text: noteText, createdAt: new Date().toISOString() });
    setDB('videos', vids);
  }
}

function removeNoteFromVideo(videoId, noteIndex) {
  const vids = getDB('videos');
  const v = vids.find(v => v.id === videoId);
  if (v) {
    v.notes.splice(noteIndex, 1);
    setDB('videos', vids);
  }
}

function addQuiz(quiz) {
  const quizzes = getDB('quizzes');
  quiz.id = Date.now();
  quiz.createdAt = new Date().toISOString();
  quizzes.unshift(quiz);
  setDB('quizzes', quizzes);
}

function removeQuiz(id) {
  setDB('quizzes', getDB('quizzes').filter(q => q.id !== id));
}

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
