// ===== THEME =====
function getTheme() { return localStorage.getItem('qq_theme') || 'dark'; }
function setTheme(t) {
  localStorage.setItem('qq_theme', t);
  document.documentElement.setAttribute('data-theme', t);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = t === 'dark' ? '☀️' : '🌙';
}
function toggleTheme() { setTheme(getTheme() === 'dark' ? 'light' : 'dark'); }

// ===== AUTH =====
function getUser() { try { return JSON.parse(localStorage.getItem('qq_user')) || null; } catch { return null; } }
function setUser(u) { localStorage.setItem('qq_user', JSON.stringify(u)); }
function logout() {
  localStorage.removeItem('qq_user');
  const inPages = window.location.pathname.includes('/pages/');
  window.location.href = inPages ? '../index.html' : 'index.html';
}

// ===== NAV =====
function updateNav() {
  const user = getUser();
  const authEl = document.getElementById('navAuth');
  if (!authEl) return;
  const inPages = window.location.pathname.includes('/pages/');
  const dashURL = inPages ? 'dashboard.html' : 'pages/dashboard.html';
  const loginURL = inPages ? 'login.html' : 'pages/login.html';
  const regURL   = inPages ? 'register.html' : 'pages/register.html';
  if (user) {
    authEl.innerHTML = `
      <span class="nav-user">⬡ ${user.username}</span>
      <a href="${dashURL}" class="btn-ghost btn-sm">Dashboard</a>
      <button class="btn-ghost btn-sm" onclick="logout()">Logout</button>
    `;
  } else {
    authEl.innerHTML = `
      <a href="${loginURL}" class="btn-ghost btn-sm">Login</a>
      <a href="${regURL}" class="btn-primary btn-sm">Play Now</a>
    `;
  }
}

// ===== MOBILE MENU =====
function initMobileMenu() {
  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('navMobileMenu');
  if (!hamburger || !mobileMenu) return;
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
    }
  });
}

// ===== PROGRESS =====
function getProgress() { try { return JSON.parse(localStorage.getItem('qq_progress')) || {}; } catch { return {}; } }
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
  board.sort((a,b) => b.xp - a.xp);
  localStorage.setItem('qq_leaderboard', JSON.stringify(board));
}

// ===== COUNTER ANIMATION =====
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

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  // Apply theme
  setTheme(getTheme());

  // Theme toggle button
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  // Nav
  updateNav();
  initMobileMenu();

  // Stats counter
  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { animateCounters(); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(statsBar);
  }

  // Level card links
  document.querySelectorAll('.level-card:not(.locked)').forEach(card => {
    card.addEventListener('click', () => {
      const inPages = window.location.pathname.includes('/pages/');
      window.location.href = (inPages ? '' : 'pages/') + 'challenges.html?level=' + card.dataset.level;
    });
  });
});

window.QQ = { getUser, setUser, logout, getProgress, saveProgress, isSolved, getXP, addXP, calcLevel, updateLeaderboard, getTheme, setTheme, toggleTheme };
