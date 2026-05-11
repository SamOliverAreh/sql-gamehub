// ============================================================
//  main.js — QueryQuest core utilities
//  Backend: Google Sheets via Apps Script
// ============================================================

const API_URL = 'https://script.google.com/macros/s/AKfycbyKjgcygxAuz9FzEgCTA-51rmWIpn9L9kZcpWcUxojceubeyoD90S_-0Bp6vM56NzlC-w/exec';
// ^^^ Replace YOUR_DEPLOYMENT_ID after deploying Code.gs

// ============================================================
//  THEME
// ============================================================
function getTheme() { return localStorage.getItem('qq_theme') || 'dark'; }
function setTheme(t) {
  localStorage.setItem('qq_theme', t);
  document.documentElement.setAttribute('data-theme', t);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = t === 'dark' ? '☀️' : '🌙';
}

// ============================================================
//  API HELPER
//  Apps Script redirects /exec to a unique URL — query params
//  must be appended so they survive the redirect.
// ============================================================
async function apiCall(action, params = {}) {
  // Apps Script redirects strip query params — use iframe trick instead:
  // We write a hidden form into a sandboxed iframe, submit it, and
  // read the response via a fetch to the same URL with no-cors fallback.
  // Simplest reliable method: fetch with no-cors returns opaque response,
  // so we use a two-step: fire-and-forget for writes, plain fetch for reads.
  try {
    const token = localStorage.getItem('qq_token');
    const allParams = { action, ...params };
    if (token) allParams.token = token;

    // Build form body — Apps Script reads these as e.parameter on POST
    const formData = new FormData();
    Object.entries(allParams).forEach(([k, v]) => {
      formData.append(k, typeof v === 'object' ? JSON.stringify(v) : String(v));
    });

    // Use XMLHttpRequest which handles Apps Script redirects correctly
    return await new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', API_URL, true);
      xhr.onload = function() {
        try { resolve(JSON.parse(xhr.responseText)); }
        catch { resolve({ ok: false, error: 'Bad response: ' + xhr.responseText.substring(0, 200) }); }
      };
      xhr.onerror = function() {
        resolve({ ok: false, error: 'Network error — check browser console.' });
      };
      xhr.send(formData);
    });
  } catch (e) {
    console.error('API error [' + action + ']:', e);
    return { ok: false, error: 'Network error: ' + e.message };
  }
}

// ============================================================
//  AUTH
// ============================================================
function getUser() {
  try { return JSON.parse(localStorage.getItem('qq_user')) || null; }
  catch { return null; }
}
function setUser(u) { localStorage.setItem('qq_user', JSON.stringify(u)); }

async function register(username, email, password) {
  const r = await apiCall('register', { username, email, password });
  if (r.ok) {
    localStorage.setItem('qq_token', r.token);
    setUser(r.user);
    updateLocalLeaderboard(r.user);
  }
  return r;
}

async function login(username, password) {
  const r = await apiCall('login', { username, password });
  if (r.ok) {
    localStorage.setItem('qq_token', r.token);
    setUser(r.user);
    // Also restore progress from server
    const prog = await apiCall('getProgress');
    if (prog.ok) localStorage.setItem('qq_progress', JSON.stringify(prog.progress));
    updateLocalLeaderboard(r.user);
  }
  return r;
}

async function logout() {
  const token = localStorage.getItem('qq_token');
  if (token) await apiCall('logout', { token });
  localStorage.removeItem('qq_token');
  localStorage.removeItem('qq_user');
  localStorage.removeItem('qq_progress');
  const inPages = window.location.pathname.includes('/pages/');
  window.location.href = inPages ? '../index.html' : 'index.html';
}

// Restore session on page load (refresh user data from server)
async function restoreSession() {
  const token = localStorage.getItem('qq_token');
  if (!token) return null;
  const r = await apiCall('getUser');
  if (r.ok) {
    setUser(r.user);
    // Re-sync progress
    const prog = await apiCall('getProgress');
    if (prog.ok) localStorage.setItem('qq_progress', JSON.stringify(prog.progress));
    return r.user;
  } else {
    // Token invalid — clear everything
    localStorage.removeItem('qq_token');
    localStorage.removeItem('qq_user');
    localStorage.removeItem('qq_progress');
    return null;
  }
}

// ============================================================
//  PROGRESS — always sync with server + local cache
// ============================================================
function getProgress() {
  try { return JSON.parse(localStorage.getItem('qq_progress')) || {}; }
  catch { return {}; }
}

async function saveProgress(id) {
  // 1. Update local cache immediately (fast UI)
  const p = getProgress();
  if (!p[id]) {
    p[id] = { solved: true, solvedAt: Date.now() };
    localStorage.setItem('qq_progress', JSON.stringify(p));
  }
  // 2. Sync to server
  const r = await apiCall('saveProgress', { challengeId: id });
  return r;
}

function isSolved(id) { return getProgress()[id]?.solved === true; }

// ============================================================
//  XP — sync with server
// ============================================================
function getXP() { const u = getUser(); return u ? (u.xp || 0) : 0; }

async function addXP(amount) {
  const user = getUser();
  if (!user) return;

  // 1. Update local immediately
  user.xp = (user.xp || 0) + amount;
  user.level = calcLevel(user.xp);
  setUser(user);
  updateLocalLeaderboard(user);

  // 2. Sync to server
  const r = await apiCall('addXP', { amount });
  if (r.ok) {
    // Use server's authoritative values
    user.xp    = r.xp;
    user.level = r.level;
    setUser(user);
    updateLocalLeaderboard(user);
  }
}

function calcLevel(xp) {
  if (xp >= 900) return 'Legendary';
  if (xp >= 500) return 'Expert';
  if (xp >= 200) return 'Advanced';
  if (xp >= 100) return 'Skilled';
  if (xp >= 40)  return 'Amateur';
  return 'Rookie';
}

// ============================================================
//  LEADERBOARD
// ============================================================
function updateLocalLeaderboard(user) {
  const board = JSON.parse(localStorage.getItem('qq_leaderboard') || '[]');
  const idx = board.findIndex(e => e.username === user.username);
  const entry = { username: user.username, xp: user.xp, level: user.level };
  if (idx >= 0) board[idx] = entry; else board.push(entry);
  board.sort((a, b) => b.xp - a.xp);
  localStorage.setItem('qq_leaderboard', JSON.stringify(board));
}

async function fetchLeaderboard() {
  const r = await apiCall('getLeaderboard');
  if (r.ok) {
    localStorage.setItem('qq_leaderboard', JSON.stringify(r.leaderboard));
    return r.leaderboard;
  }
  return JSON.parse(localStorage.getItem('qq_leaderboard') || '[]');
}

// Rank from local cache (fast, used in dashboard)
function getLocalRank(username) {
  const board = JSON.parse(localStorage.getItem('qq_leaderboard') || '[]');
  const idx = board.findIndex(e => e.username === username);
  return idx >= 0 ? idx + 1 : null;
}

// ============================================================
//  COUNTER ANIMATION (home page)
// ============================================================
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

// ============================================================
//  HOME PAGE INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { animateCounters(); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(statsBar);
  }
  document.querySelectorAll('.level-card:not(.locked)').forEach(card => {
    card.addEventListener('click', () => {
      const inPages = window.location.pathname.includes('/pages/');
      window.location.href = (inPages ? '' : 'pages/') + 'challenges.html?level=' + card.dataset.level;
    });
  });
});

// ============================================================
//  EXPOSE
// ============================================================
window.QQ = {
  getUser, setUser, logout, register, login, restoreSession,
  getProgress, saveProgress, isSolved,
  getXP, addXP, calcLevel,
  fetchLeaderboard, updateLocalLeaderboard, getLocalRank,
  getTheme, setTheme, apiCall
};
