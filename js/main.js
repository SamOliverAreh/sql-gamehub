// main.js — Shared utilities and home page logic

// ===== AUTH STATE =====
function getUser() {
  try { return JSON.parse(localStorage.getItem('qq_user')) || null; } catch { return null; }
}
function setUser(user) {
  localStorage.setItem('qq_user', JSON.stringify(user));
}
function logout() {
  localStorage.removeItem('qq_user');
  // Works whether called from root or /pages/ subdirectory
  const inPages = window.location.pathname.includes('/pages/');
  window.location.href = inPages ? '../index.html' : 'index.html';
}

// Update nav based on auth state
function updateNav() {
  const user = getUser();
  const authEl = document.getElementById('navAuth');
  if (!authEl) return;
  // Determine if we're in /pages/ or at root
  const inPages = window.location.pathname.includes('/pages/');
  const dashURL = inPages ? 'dashboard.html' : 'pages/dashboard.html';
  if (user) {
    authEl.innerHTML = `
      <span class="nav-user">⬡ ${user.username}</span>
      <a href="${dashURL}" class="btn-ghost">Dashboard</a>
      <button class="btn-primary" onclick="logout()">Logout</button>
    `;
  }
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num');
  counters.forEach(el => {
    const target = parseInt(el.dataset.target || 0);
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current) + (target >= 100 ? '+' : '');
    }, 20);
  });
}

// ===== INTERSECTION OBSERVER =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      if (e.target.classList.contains('stats-bar')) animateCounters();
    }
  });
}, { threshold: 0.3 });

document.addEventListener('DOMContentLoaded', () => {
  updateNav();
  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) observer.observe(statsBar);

  // Level card clicks
  document.querySelectorAll('.level-card:not(.locked)').forEach(card => {
    card.addEventListener('click', () => {
      window.location.href = 'pages/challenges.html?level=' + card.dataset.level;
    });
  });
});

// ===== CHALLENGE HELPERS (shared) =====
function getProgress() {
  try { return JSON.parse(localStorage.getItem('qq_progress')) || {}; } catch { return {}; }
}
function saveProgress(id, data) {
  const p = getProgress();
  p[id] = { ...p[id], ...data, solvedAt: Date.now() };
  localStorage.setItem('qq_progress', JSON.stringify(p));
}
function isSolved(id) {
  const p = getProgress();
  return p[id]?.solved === true;
}

// ===== XP HELPERS =====
function getXP() {
  const user = getUser();
  return user ? (user.xp || 0) : 0;
}
function addXP(amount) {
  const user = getUser();
  if (!user) return;
  user.xp = (user.xp || 0) + amount;
  user.level = calcLevel(user.xp);
  setUser(user);
  // Update leaderboard entry
  updateLeaderboard(user);
}
function calcLevel(xp) {
  if (xp >= 900) return 'Legendary';
  if (xp >= 500) return 'Expert';
  if (xp >= 200) return 'Advanced';
  if (xp >= 100) return 'Skilled';
  if (xp >= 40) return 'Amateur';
  return 'Rookie';
}
function updateLeaderboard(user) {
  const board = JSON.parse(localStorage.getItem('qq_leaderboard') || '[]');
  const idx = board.findIndex(e => e.username === user.username);
  const entry = { username: user.username, xp: user.xp, level: user.level };
  if (idx >= 0) board[idx] = entry;
  else board.push(entry);
  board.sort((a, b) => b.xp - a.xp);
  localStorage.setItem('qq_leaderboard', JSON.stringify(board));
}

window.QQ = { getUser, setUser, logout, getProgress, saveProgress, isSolved, getXP, addXP, calcLevel, updateLeaderboard };
