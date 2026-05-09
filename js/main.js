// main.js — Shared utilities: auth, XP, progress
// Theme toggle + hamburger are handled entirely by nav-inject.js

// ===== THEME =====
// Applied immediately by nav-inject.js IIFE — no flash
function getTheme() { return localStorage.getItem('qq_theme') || 'dark'; }
function setTheme(t) {
  localStorage.setItem('qq_theme', t);
  document.documentElement.setAttribute('data-theme', t);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = t === 'dark' ? '☀️' : '🌙';
}

// ===== AUTH =====
function getUser() {
  try { return JSON.parse(localStorage.getItem('qq_user')) || null; }
  catch { return null; }
}
function setUser(u) { localStorage.setItem('qq_user', JSON.stringify(u)); }
function logout() {
  localStorage.removeItem('qq_user');
  const inPages = window.location.pathname.includes('/pages/');
  window.location.href = inPages ? '../index.html' : 'index.html';
}

// ===== PROGRESS =====
function getProgress() {
  try { return JSON.parse(localStorage.getItem('qq_progress')) || {}; }
  catch { return {}; }
}
function saveProgress(id, data) {
  const p = getProgress();
  p[id] = { ...p[id], ...data, solvedAt: Date.now() };
  localStorage.setItem('qq_progress', JSON.stringify(p));
}
function isSolved(id) { return getProgress()[id]?.solved === true; }

// ===== XP =====
function getXP() { const u = getUser(); return u ? (u.xp || 0) : 0; }
function addXP(amount) {
  const user = getUser();
  if (!user) return;
  user.xp = (user.xp || 0) + amount;
  user.level = calcLevel(user.xp);
  setUser(user);
  updateLeaderboard(user);
}
function calcLevel(xp) {
  if (xp >= 900) return 'Legendary';
  if (xp >= 500) return 'Expert';
  if (xp >= 200) return 'Advanced';
  if (xp >= 100) return 'Skilled';
  if (xp >= 40)  return 'Amateur';
  return 'Rookie';
}
function updateLeaderboard(user) {
  const board = JSON.parse(localStorage.getItem('qq_leaderboard') || '[]');
  const idx = board.findIndex(e => e.username === user.username);
  const entry = { username: user.username, xp: user.xp, level: user.level };
  if (idx >= 0) board[idx] = entry; else board.push(entry);
  board.sort((a, b) => b.xp - a.xp);
  localStorage.setItem('qq_leaderboard', JSON.stringify(board));
}

// ===== COUNTER ANIMATION (home page) =====
function animateCounters() {
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target || 0);
    let current = 0;
    const inc = target / 60;
    const timer = setInterval(() => {
      current += inc;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current) + (target >= 100 ? '+' : '');
    }, 20);
  });
}

// ===== HOME PAGE INIT =====
document.addEventListener('DOMContentLoaded', () => {
  // Stats counter observer (home page only)
  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { animateCounters(); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(statsBar);
  }

  // Level card clicks (home page)
  document.querySelectorAll('.level-card:not(.locked)').forEach(card => {
    card.addEventListener('click', () => {
      const inPages = window.location.pathname.includes('/pages/');
      window.location.href = (inPages ? '' : 'pages/') + 'challenges.html?level=' + card.dataset.level;
    });
  });
});

// ===== EXPOSE API =====
window.QQ = {
  getUser, setUser, logout,
  getProgress, saveProgress, isSolved,
  getXP, addXP, calcLevel, updateLeaderboard,
  getTheme, setTheme
};
