# ⬡ QueryQuest — SQL GameHub

> A gamified SQL challenge platform showcasing real-world SQL proficiency across 6 difficulty tiers.

**Live Demo:** [your-github-SamOliverAreh.github.io/sql-gamehub](https://github.com)

---

## 🎯 About

QueryQuest is a portfolio project built to demonstrate **deep SQL expertise** through an interactive, gamified challenge platform. Players write real SQL queries against a live in-browser SQLite engine, earn XP, and climb the leaderboard.

This project covers the full breadth of SQL — from basic `SELECT` statements to **recursive CTEs** and **window functions**.

---

## ✨ Features

- **Real SQL Execution** — SQL.js runs a genuine SQLite engine in-browser. Every query actually executes.
- **42 Challenges** across 6 difficulty tiers (Rookie → Legendary)
- **User Registration & Login** with persistent progress tracking
- **XP System** — earn points for solving challenges, unlock higher tiers
- **Leaderboard** — compete with other players globally (stored in localStorage; connect to a backend for real persistence)
- **Syntax Highlighting** — CodeMirror editor with SQL mode
- **Hint System** — each challenge has a hidden hint
- **Solution Viewer** — view solutions to learn from them
- **Mobile-Responsive** design

---

## 🗂️ Project Structure

```
sql-gamehub/
├── index.html              # Landing page
├── css/
│   └── main.css            # All styles (CSS variables, components)
├── js/
│   ├── main.js             # Shared utilities, auth, XP system
│   └── terminal-demo.js    # Animated terminal on homepage
├── data/
│   └── challenges.js       # All 12+ challenge definitions (expandable to 42+)
└── pages/
    ├── register.html        # User registration
    ├── login.html           # Login
    ├── dashboard.html       # User dashboard, stats, progress
    ├── challenges.html      # Challenge browser with tier filters
    ├── challenge.html       # SQL editor + results + validation
    ├── leaderboard.html     # Global leaderboard
    └── about.html           # Portfolio/about page
```

---

## 🧠 SQL Concepts Demonstrated

| Tier | Concepts |
|------|----------|
| 🌱 Rookie | SELECT, WHERE, ORDER BY, LIMIT |
| ⚡ Amateur | GROUP BY, HAVING, COUNT, SUM, AVG, MIN, MAX |
| 🔗 Skilled | INNER JOIN, LEFT JOIN, RIGHT JOIN, UNION |
| 🧠 Advanced | Subqueries, CTEs (WITH), Window Functions |
| 🏆 Expert | RANK(), PARTITION BY, Running Totals, Correlated Subqueries |
| ⚡ Legendary | Recursive CTEs, Hierarchical Queries, Advanced Analytics |

---

## 🚀 Deploy to GitHub Pages

1. Fork or clone this repo
2. Push to your GitHub account
3. Go to **Settings → Pages**
4. Set Source to **Deploy from branch: main / root**
5. Your site will be live at `https://SamOliveAreh.github.io/sql-gamehub/`

No build step. No dependencies. Pure HTML/CSS/JS.

---

## 🔧 Tech Stack

| Technology | Purpose |
|-----------|---------|
| HTML5 / CSS3 | Structure & styling |
| Vanilla JavaScript | Logic, auth, XP system |
| [SQL.js](https://sql.js.org/) | In-browser SQLite engine |
| [CodeMirror](https://codemirror.net/) | SQL syntax highlighting |
| Google Fonts | Typography (Orbitron, Share Tech Mono, Exo 2) |
| localStorage | User data persistence |

---

## 📝 Adding More Challenges

Challenges are defined in `data/challenges.js`. Each challenge object looks like:

```javascript
{
  id: 'unique_id',
  tier: 1,                    // 1-6
  tierName: 'Rookie',
  title: 'Challenge Title',
  description: 'What to solve.',
  hint: 'Hint text shown on request.',
  xp: 10,                     // XP reward
  concepts: ['SELECT', 'WHERE'],
  schema: `CREATE TABLE ...`,  // DDL to create tables
  seed: `INSERT INTO ...`,     // Data to populate tables
  solutionQuery: `SELECT ...`, // Reference solution
  validate: (rows, cols) => rows.length === 5,  // Validation function
  expectedNote: 'Description of expected output'
}
```

---

## 🔒 Authentication Note

This project uses **localStorage** for user data — no backend required for portfolio deployment. For a production app, replace the auth logic in `js/main.js` and `pages/register.html` with real backend calls (Node.js/Express, Supabase, Firebase, etc.).

Passwords are stored in localStorage for demo purposes only. **Do not use this auth system in production.**

---

## 📄 License

MIT — feel free to fork, remix, and use as your own portfolio project.

---

*Built to showcase SQL proficiency for data science and data analyst roles.*
