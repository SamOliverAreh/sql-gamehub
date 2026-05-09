// nav-inject.js — Injects consistent navbar + mobile menu into all pages
// Call buildNav() after DOMContentLoaded in each page

function buildNav(activePage) {
  const inPages = window.location.pathname.includes('/pages/');
  const root = inPages ? '../' : '';

  const navHTML = `
    <a href="${root}index.html" class="nav-logo"><span class="logo-icon">⬡</span><span class="logo-text">QueryQuest</span></a>
    <div class="nav-links">
      <a href="${root}pages/challenges.html" ${activePage==='challenges'?'class="active"':''}>Challenges</a>
      <a href="${root}pages/adventures.html" ${activePage==='adventures'?'class="active"':''}>Adventures</a>
      <a href="${root}pages/leaderboard.html" ${activePage==='leaderboard'?'class="active"':''}>Leaderboard</a>
      <a href="${root}pages/about.html" ${activePage==='about'?'class="active"':''}>About</a>
    </div>
    <div class="nav-auth" id="navAuth"></div>
    <button class="theme-toggle" id="themeToggle" title="Toggle theme">☀️</button>
    <button class="nav-hamburger" id="navHamburger" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  `;

  const mobileHTML = `
    <a href="${root}pages/challenges.html">Challenges</a>
    <a href="${root}pages/adventures.html">Adventures</a>
    <a href="${root}pages/leaderboard.html">Leaderboard</a>
    <a href="${root}pages/about.html">About</a>
    <div class="mobile-divider"></div>
    <div id="mobileAuthLinks"></div>
  `;

  const navbar = document.querySelector('.navbar');
  const mobileMenu = document.querySelector('.nav-mobile-menu') || (() => {
    const d = document.createElement('div');
    d.className = 'nav-mobile-menu';
    d.id = 'navMobileMenu';
    document.body.insertBefore(d, document.body.children[2]);
    return d;
  })();

  if (navbar) navbar.innerHTML = navHTML;
  mobileMenu.id = 'navMobileMenu';
  mobileMenu.innerHTML = mobileHTML;

  // Populate auth in mobile
  const user = QQ.getUser();
  const mobileAuthDiv = document.getElementById('mobileAuthLinks');
  const dashURL = inPages ? 'dashboard.html' : 'pages/dashboard.html';
  const loginURL = inPages ? 'login.html' : 'pages/login.html';
  const regURL   = inPages ? 'register.html' : 'pages/register.html';

  if (mobileAuthDiv) {
    if (user) {
      mobileAuthDiv.innerHTML = `
        <a href="${dashURL}" style="color:var(--accent);">⬡ ${user.username} (Dashboard)</a>
        <button onclick="QQ.logout()" style="color:var(--danger);border-bottom:none;">Logout</button>
      `;
    } else {
      mobileAuthDiv.innerHTML = `
        <a href="${loginURL}">Login</a>
        <a href="${regURL}" style="color:var(--accent);">Play Now →</a>
      `;
    }
  }
}
