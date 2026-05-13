// ============================================================
//  page-loader.js — Global page blocking overlay
//  Prevents all interaction during async operations and
//  page transitions. Used on every page.
// ============================================================

(function() {
  // ── Inject overlay HTML immediately (before DOM loads) ───
  const style = document.createElement('style');
  style.textContent = `
    #qqPageBlock {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(5, 8, 16, 0.92);
      backdrop-filter: blur(6px);
      z-index: 9999;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
      cursor: not-allowed;
    }
    [data-theme="light"] #qqPageBlock {
      background: rgba(240, 244, 252, 0.92);
    }
    #qqPageBlock.active { display: flex; }
    .qqbl-spinner {
      width: 52px; height: 52px;
      border: 3px solid rgba(0,212,255,0.2);
      border-top-color: #00d4ff;
      border-radius: 50%;
      animation: qqSpin 0.75s linear infinite;
    }
    [data-theme="light"] .qqbl-spinner {
      border-color: rgba(0,111,168,0.2);
      border-top-color: #006fa8;
    }
    @keyframes qqSpin { to { transform: rotate(360deg); } }
    .qqbl-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.88rem;
      color: #00d4ff;
      letter-spacing: 0.1em;
      text-align: center;
    }
    [data-theme="light"] .qqbl-title { color: #006fa8; }
    .qqbl-sub {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.72rem;
      color: #6b8aad;
      text-align: center;
      max-width: 260px;
      line-height: 1.6;
    }
    .qqbl-bar-bg {
      width: 200px; height: 3px;
      background: rgba(0,212,255,0.15);
      border-radius: 99px;
      overflow: hidden;
    }
    [data-theme="light"] .qqbl-bar-bg { background: rgba(0,111,168,0.12); }
    .qqbl-bar-fill {
      height: 100%;
      background: #00d4ff;
      border-radius: 99px;
      width: 0%;
      transition: width 0.3s ease;
    }
    [data-theme="light"] .qqbl-bar-fill { background: #006fa8; }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.id = 'qqPageBlock';
  overlay.innerHTML = `
    <div class="qqbl-spinner"></div>
    <div class="qqbl-title" id="qqBlTitle">Loading</div>
    <div class="qqbl-sub"  id="qqBlSub"></div>
    <div class="qqbl-bar-bg"><div class="qqbl-bar-fill" id="qqBlBar"></div></div>
  `;
  // Insert as first child of body once DOM is ready
  if (document.body) {
    document.body.insertBefore(overlay, document.body.firstChild);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.insertBefore(overlay, document.body.firstChild);
    });
  }
})();

// ── Public API ────────────────────────────────────────────────
window.PageLoader = {
  // Show blocking overlay
  show(title = 'Loading', sub = '', progress = null) {
    const el = document.getElementById('qqPageBlock');
    if (!el) return;
    document.getElementById('qqBlTitle').textContent  = title;
    document.getElementById('qqBlSub').textContent    = sub;
    const bar = document.getElementById('qqBlBar');
    if (progress !== null) {
      bar.style.width = Math.min(100, progress) + '%';
    } else {
      // Indeterminate — animate with keyframes
      bar.style.animation = 'qqIndeterminate 1.6s ease-in-out infinite';
      if (!document.getElementById('qqIndetStyle')) {
        const s = document.createElement('style');
        s.id = 'qqIndetStyle';
        s.textContent = `@keyframes qqIndeterminate {
          0%   { width:0%;   margin-left:0% }
          50%  { width:60%;  margin-left:20% }
          100% { width:0%;   margin-left:100% }
        }`;
        document.head.appendChild(s);
      }
    }
    el.classList.add('active');
    // Prevent scroll
    document.body.style.overflow = 'hidden';
  },

  // Update progress bar (0-100)
  progress(pct, sub) {
    const bar = document.getElementById('qqBlBar');
    if (bar) { bar.style.animation = ''; bar.style.width = pct + '%'; }
    if (sub) document.getElementById('qqBlSub').textContent = sub;
  },

  // Hide overlay
  hide() {
    const el = document.getElementById('qqPageBlock');
    if (!el) return;
    el.classList.remove('active');
    document.body.style.overflow = '';
    const bar = document.getElementById('qqBlBar');
    if (bar) { bar.style.animation = ''; bar.style.width = '0%'; }
  },

  // Convenience: wrap an async function with show/hide
  async wrap(title, sub, asyncFn) {
    this.show(title, sub);
    try {
      const result = await asyncFn();
      return result;
    } finally {
      this.hide();
    }
  }
};
