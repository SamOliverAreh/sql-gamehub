// nav-inject.js — Injects navbar + mobile menu, wires ALL event listeners
// Call buildNav('pageName') once inside DOMContentLoaded

function buildNav(activePage) {
  const inPages = window.location.pathname.includes('/pages/');
  const root = inPages ? '../' : '';
  const dashURL  = inPages ? 'dashboard.html'  : 'pages/dashboard.html';
  const loginURL = inPages ? 'login.html'       : 'pages/login.html';
  const regURL   = inPages ? 'register.html'    : 'pages/register.html';

  // ── Navbar HTML ──────────────────────────────────────────────
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    navbar.innerHTML = `
      <a href="${root}index.html" class="nav-logo">
        <span class="logo-icon">⬡</span><span class="logo-text">QueryQuest</span>
      </a>
      <div class="nav-links">
        <a href="${root}pages/challenges.html"  ${activePage==='challenges' ?'class="active"':''}>Challenges</a>
        <a href="${root}pages/adventures.html"  ${activePage==='adventures' ?'class="active"':''}>Adventures</a>
        <a href="${root}pages/leaderboard.html" ${activePage==='leaderboard'?'class="active"':''}>Leaderboard</a>
        <a href="${root}pages/about.html"       ${activePage==='about'      ?'class="active"':''}>About</a>
      </div>
      <div class="nav-auth" id="navAuth"></div>
      <button class="theme-toggle" id="themeToggle" title="Toggle theme"></button>
      <button class="nav-hamburger" id="navHamburger" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
    `;
  }

  // ── Mobile menu HTML ─────────────────────────────────────────
  let mobileMenu = document.getElementById('navMobileMenu');
  if (!mobileMenu) {
    mobileMenu = document.createElement('div');
    mobileMenu.id = 'navMobileMenu';
    mobileMenu.className = 'nav-mobile-menu';
    document.body.insertBefore(mobileMenu, document.body.children[2]);
  }
  mobileMenu.innerHTML = `
    <a href="${root}pages/challenges.html"  ${activePage==='challenges' ?'style="color:var(--accent)"':''}>Challenges</a>
    <a href="${root}pages/adventures.html"  ${activePage==='adventures' ?'style="color:var(--accent)"':''}>Adventures</a>
    <a href="${root}pages/leaderboard.html" ${activePage==='leaderboard'?'style="color:var(--accent)"':''}>Leaderboard</a>
    <a href="${root}pages/about.html"       ${activePage==='about'      ?'style="color:var(--accent)"':''}>About</a>
    <div class="mobile-divider"></div>
    <div id="mobileAuthLinks"></div>
  `;

  // ── Auth links (desktop + mobile) ────────────────────────────
  const user = QQ.getUser();
  const navAuth = document.getElementById('navAuth');
  const mobileAuth = document.getElementById('mobileAuthLinks');

  if (user && user.isAnon) {
    // Anonymous / guest user
    if (navAuth) navAuth.innerHTML = `
      <span class="nav-user" style="color:var(--warning);">👤 Guest</span>
      <a href="${loginURL}" class="btn-ghost btn-sm">Save Progress</a>
      <button class="btn-ghost btn-sm" onclick="QQ.logout()">Exit Guest</button>
    `;
    if (mobileAuth) mobileAuth.innerHTML = `
      <a href="${loginURL}" style="color:var(--warning);">👤 Playing as Guest</a>
      <a href="${loginURL}" style="color:var(--accent);">💾 Save Progress — Register</a>
      <button onclick="QQ.logout()" style="color:var(--danger);background:none;border:none;cursor:pointer;font-family:var(--font-display);font-size:0.82rem;text-align:left;padding:12px 8px;width:100%;text-transform:uppercase;letter-spacing:0.08em;">Exit Guest</button>
    `;
  } else if (user) {
    if (navAuth) navAuth.innerHTML = `
      <span class="nav-user">⬡ ${user.username}</span>
      <a href="${dashURL}" class="btn-ghost btn-sm">Dashboard</a>
      <button class="btn-ghost btn-sm" onclick="QQ.logout()">Logout</button>
    `;
    if (mobileAuth) mobileAuth.innerHTML = `
      <a href="${dashURL}" style="color:var(--accent)">⬡ ${user.username} — Dashboard</a>
      <button onclick="QQ.logout()" style="color:var(--danger);background:none;border:none;cursor:pointer;font-family:var(--font-display);font-size:0.82rem;text-align:left;padding:12px 8px;width:100%;text-transform:uppercase;letter-spacing:0.08em;">Logout</button>
    `;
  } else {
    if (navAuth) navAuth.innerHTML = `
      <a href="${loginURL}" class="btn-ghost btn-sm">Login</a>
      <a href="${regURL}"   class="btn-primary btn-sm">Play Now</a>
    `;
    if (mobileAuth) mobileAuth.innerHTML = `
      <a href="${loginURL}">Login</a>
      <a href="${regURL}" style="color:var(--accent)">Play Now →</a>
    `;
  }

  // ── Theme toggle — wire AFTER injection ──────────────────────
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    // Set correct icon for current theme
    const current = localStorage.getItem('qq_theme') || 'dark';
    themeBtn.textContent = current === 'dark' ? '☀️' : '🌙';

    themeBtn.addEventListener('click', () => {
      const next = (localStorage.getItem('qq_theme') || 'dark') === 'dark' ? 'light' : 'dark';
      localStorage.setItem('qq_theme', next);
      document.documentElement.setAttribute('data-theme', next);
      themeBtn.textContent = next === 'dark' ? '☀️' : '🌙';
    });
  }

  // ── Hamburger — wire AFTER injection ─────────────────────────
  const hamburger = document.getElementById('navHamburger');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle('open');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
      }
    });

    // Close when a link inside is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }
}

// Apply theme immediately on page load (before buildNav) to prevent flash
(function() {
  const t = localStorage.getItem('qq_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', t);
})();
