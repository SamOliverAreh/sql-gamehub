// terminal-demo.js — Animated terminal on home page

const DEMO_LINES = [
  {
    query: "SELECT name, salary FROM employees ORDER BY salary DESC LIMIT 5;",
    result: "✓ 5 rows returned — Query solved in 12ms"
  },
  {
    query: "SELECT dept, COUNT(*) as total FROM employees GROUP BY dept HAVING total > 3;",
    result: "✓ 4 departments matched — +25 XP earned!"
  },
  {
    query: "SELECT e.name, d.name FROM employees e JOIN departments d ON e.dept_id = d.id;",
    result: "✓ Perfect JOIN — Achievement unlocked: Table Weaver 🏅"
  }
];

let demoIdx = 0;

function typeWriter(element, text, speed, callback) {
  let i = 0;
  element.textContent = '';
  const cursor = document.createElement('span');
  cursor.textContent = '█';
  cursor.style.animation = 'pulse 1s infinite';
  element.appendChild(cursor);

  const interval = setInterval(() => {
    if (i < text.length) {
      element.textContent = text.substring(0, i + 1);
      element.appendChild(cursor);
      i++;
    } else {
      clearInterval(interval);
      cursor.remove();
      if (callback) setTimeout(callback, 600);
    }
  }, speed);
}

function runDemo() {
  const typed = document.getElementById('typedLine');
  const result = document.getElementById('resultLine');
  if (!typed || !result) return;

  const demo = DEMO_LINES[demoIdx % DEMO_LINES.length];
  result.textContent = '';

  typeWriter(typed, '> ' + demo.query, 35, () => {
    setTimeout(() => {
      result.textContent = demo.result;
      demoIdx++;
      setTimeout(runDemo, 3000);
    }, 500);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(runDemo, 1200);
});
