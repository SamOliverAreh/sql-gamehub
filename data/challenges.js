// challenges-data.js — All SQL challenges with schema, seed data, and solutions

window.CHALLENGES_DATA = [

  // ===== TIER 1: ROOKIE =====
  {
    id: 'r01',
    tier: 1,
    tierName: 'Rookie',
    title: 'Hello, Database!',
    description: 'Retrieve all employees from the employees table. Simple as that — your first query ever.',
    hint: 'Use SELECT * to get all columns, FROM to pick the table.',
    xp: 10,
    concepts: ['SELECT', 'FROM'],
    schema: `
      CREATE TABLE employees (
        id INTEGER PRIMARY KEY,
        name TEXT,
        department TEXT,
        salary INTEGER,
        hire_date TEXT
      );
    `,
    seed: `
      INSERT INTO employees VALUES (1, 'Alice Johnson', 'Engineering', 95000, '2020-03-15');
      INSERT INTO employees VALUES (2, 'Bob Smith', 'Marketing', 72000, '2019-07-22');
      INSERT INTO employees VALUES (3, 'Carol Lee', 'Engineering', 105000, '2018-01-10');
      INSERT INTO employees VALUES (4, 'David Brown', 'HR', 65000, '2021-11-01');
      INSERT INTO employees VALUES (5, 'Eva Green', 'Marketing', 80000, '2020-09-30');
    `,
    solutionQuery: `SELECT * FROM employees;`,
    validate: (rows) => rows.length === 5,
    expectedNote: '5 rows from employees table'
  },

  {
    id: 'r02',
    tier: 1,
    tierName: 'Rookie',
    title: 'Name Game',
    description: 'Retrieve only the name and salary columns from the employees table.',
    hint: 'List column names after SELECT, separated by commas.',
    xp: 10,
    concepts: ['SELECT', 'Columns'],
    schema: `
      CREATE TABLE employees (
        id INTEGER PRIMARY KEY,
        name TEXT,
        department TEXT,
        salary INTEGER,
        hire_date TEXT
      );
    `,
    seed: `
      INSERT INTO employees VALUES (1, 'Alice Johnson', 'Engineering', 95000, '2020-03-15');
      INSERT INTO employees VALUES (2, 'Bob Smith', 'Marketing', 72000, '2019-07-22');
      INSERT INTO employees VALUES (3, 'Carol Lee', 'Engineering', 105000, '2018-01-10');
      INSERT INTO employees VALUES (4, 'David Brown', 'HR', 65000, '2021-11-01');
      INSERT INTO employees VALUES (5, 'Eva Green', 'Marketing', 80000, '2020-09-30');
    `,
    solutionQuery: `SELECT name, salary FROM employees;`,
    validate: (rows, cols) => cols.includes('name') && cols.includes('salary') && cols.length === 2,
    expectedNote: '2 columns: name and salary'
  },

  {
    id: 'r03',
    tier: 1,
    tierName: 'Rookie',
    title: 'The Filter',
    description: 'Find all employees who work in the Engineering department.',
    hint: 'Use WHERE department = \'Engineering\'',
    xp: 10,
    concepts: ['WHERE'],
    schema: `
      CREATE TABLE employees (
        id INTEGER PRIMARY KEY,
        name TEXT,
        department TEXT,
        salary INTEGER,
        hire_date TEXT
      );
    `,
    seed: `
      INSERT INTO employees VALUES (1, 'Alice Johnson', 'Engineering', 95000, '2020-03-15');
      INSERT INTO employees VALUES (2, 'Bob Smith', 'Marketing', 72000, '2019-07-22');
      INSERT INTO employees VALUES (3, 'Carol Lee', 'Engineering', 105000, '2018-01-10');
      INSERT INTO employees VALUES (4, 'David Brown', 'HR', 65000, '2021-11-01');
      INSERT INTO employees VALUES (5, 'Eva Green', 'Marketing', 80000, '2020-09-30');
    `,
    solutionQuery: `SELECT * FROM employees WHERE department = 'Engineering';`,
    validate: (rows) => rows.length === 2 && rows.every(r => r.department === 'Engineering'),
    expectedNote: '2 Engineering employees'
  },

  {
    id: 'r04',
    tier: 1,
    tierName: 'Rookie',
    title: 'High Earners',
    description: 'Find all employees with a salary greater than 80,000, ordered by salary descending.',
    hint: 'Combine WHERE with ORDER BY ... DESC',
    xp: 15,
    concepts: ['WHERE', 'ORDER BY'],
    schema: `
      CREATE TABLE employees (
        id INTEGER PRIMARY KEY,
        name TEXT,
        department TEXT,
        salary INTEGER,
        hire_date TEXT
      );
    `,
    seed: `
      INSERT INTO employees VALUES (1, 'Alice Johnson', 'Engineering', 95000, '2020-03-15');
      INSERT INTO employees VALUES (2, 'Bob Smith', 'Marketing', 72000, '2019-07-22');
      INSERT INTO employees VALUES (3, 'Carol Lee', 'Engineering', 105000, '2018-01-10');
      INSERT INTO employees VALUES (4, 'David Brown', 'HR', 65000, '2021-11-01');
      INSERT INTO employees VALUES (5, 'Eva Green', 'Marketing', 80000, '2020-09-30');
    `,
    solutionQuery: `SELECT * FROM employees WHERE salary > 80000 ORDER BY salary DESC;`,
    validate: (rows) => rows.length === 2 && rows[0].salary > rows[rows.length - 1].salary,
    expectedNote: '2 rows, sorted salary descending'
  },

  // ===== TIER 2: AMATEUR =====
  {
    id: 'a01',
    tier: 2,
    tierName: 'Amateur',
    title: 'Count the Troops',
    description: 'Count how many employees exist in each department.',
    hint: 'Use COUNT(*) with GROUP BY department',
    xp: 25,
    concepts: ['COUNT', 'GROUP BY'],
    schema: `
      CREATE TABLE employees (
        id INTEGER PRIMARY KEY,
        name TEXT,
        department TEXT,
        salary INTEGER
      );
    `,
    seed: `
      INSERT INTO employees VALUES (1,'Alice','Engineering',95000);
      INSERT INTO employees VALUES (2,'Bob','Marketing',72000);
      INSERT INTO employees VALUES (3,'Carol','Engineering',105000);
      INSERT INTO employees VALUES (4,'David','HR',65000);
      INSERT INTO employees VALUES (5,'Eva','Marketing',80000);
      INSERT INTO employees VALUES (6,'Frank','Engineering',88000);
    `,
    solutionQuery: `SELECT department, COUNT(*) as employee_count FROM employees GROUP BY department;`,
    validate: (rows) => rows.length === 3 && rows.every(r => r.employee_count !== undefined),
    expectedNote: '3 departments with counts'
  },

  {
    id: 'a02',
    tier: 2,
    tierName: 'Amateur',
    title: 'Big Departments',
    description: 'Find departments with more than 1 employee, showing the count.',
    hint: 'Use HAVING after GROUP BY to filter aggregated results.',
    xp: 25,
    concepts: ['HAVING', 'GROUP BY'],
    schema: `
      CREATE TABLE employees (
        id INTEGER PRIMARY KEY,
        name TEXT,
        department TEXT,
        salary INTEGER
      );
    `,
    seed: `
      INSERT INTO employees VALUES (1,'Alice','Engineering',95000);
      INSERT INTO employees VALUES (2,'Bob','Marketing',72000);
      INSERT INTO employees VALUES (3,'Carol','Engineering',105000);
      INSERT INTO employees VALUES (4,'David','HR',65000);
      INSERT INTO employees VALUES (5,'Eva','Marketing',80000);
      INSERT INTO employees VALUES (6,'Frank','Engineering',88000);
    `,
    solutionQuery: `SELECT department, COUNT(*) as total FROM employees GROUP BY department HAVING total > 1;`,
    validate: (rows) => rows.length === 2 && rows.every(r => r.total > 1),
    expectedNote: '2 departments (Engineering and Marketing)'
  },

  {
    id: 'a03',
    tier: 2,
    tierName: 'Amateur',
    title: 'Salary Stats',
    description: 'Calculate the average, minimum, and maximum salary per department.',
    hint: 'Use AVG(), MIN(), MAX() — you can use multiple aggregates in one query.',
    xp: 30,
    concepts: ['AVG', 'MIN', 'MAX', 'GROUP BY'],
    schema: `
      CREATE TABLE employees (
        id INTEGER PRIMARY KEY,
        name TEXT,
        department TEXT,
        salary INTEGER
      );
    `,
    seed: `
      INSERT INTO employees VALUES (1,'Alice','Engineering',95000);
      INSERT INTO employees VALUES (2,'Bob','Marketing',72000);
      INSERT INTO employees VALUES (3,'Carol','Engineering',105000);
      INSERT INTO employees VALUES (4,'David','HR',65000);
      INSERT INTO employees VALUES (5,'Eva','Marketing',80000);
      INSERT INTO employees VALUES (6,'Frank','Engineering',88000);
    `,
    solutionQuery: `SELECT department, AVG(salary) as avg_salary, MIN(salary) as min_salary, MAX(salary) as max_salary FROM employees GROUP BY department;`,
    validate: (rows, cols) => cols.some(c => c.includes('avg')) && rows.length === 3,
    expectedNote: 'avg/min/max per 3 departments'
  },

  // ===== TIER 3: SKILLED =====
  {
    id: 's01',
    tier: 3,
    tierName: 'Skilled',
    title: 'Bridge the Gap',
    description: 'Join employees with their department details. Show employee name and full department name.',
    hint: 'Use INNER JOIN ... ON to match employees.dept_id with departments.id',
    xp: 50,
    concepts: ['INNER JOIN'],
    schema: `
      CREATE TABLE employees (
        id INTEGER PRIMARY KEY,
        name TEXT,
        dept_id INTEGER,
        salary INTEGER
      );
      CREATE TABLE departments (
        id INTEGER PRIMARY KEY,
        name TEXT,
        location TEXT
      );
    `,
    seed: `
      INSERT INTO departments VALUES (1, 'Engineering', 'Floor 3');
      INSERT INTO departments VALUES (2, 'Marketing', 'Floor 2');
      INSERT INTO departments VALUES (3, 'HR', 'Floor 1');
      INSERT INTO employees VALUES (1, 'Alice', 1, 95000);
      INSERT INTO employees VALUES (2, 'Bob', 2, 72000);
      INSERT INTO employees VALUES (3, 'Carol', 1, 105000);
      INSERT INTO employees VALUES (4, 'David', 3, 65000);
      INSERT INTO employees VALUES (5, 'Eva', 2, 80000);
    `,
    solutionQuery: `SELECT e.name, d.name as department FROM employees e INNER JOIN departments d ON e.dept_id = d.id;`,
    validate: (rows, cols) => rows.length === 5 && cols.length >= 2,
    expectedNote: '5 rows with name + department'
  },

  {
    id: 's02',
    tier: 3,
    tierName: 'Skilled',
    title: 'Missing Links',
    description: 'Find all departments AND any employees in them. Include departments with no employees (show NULL for missing employees).',
    hint: 'LEFT JOIN from departments to employees — the "left" table keeps all rows.',
    xp: 50,
    concepts: ['LEFT JOIN', 'NULL'],
    schema: `
      CREATE TABLE employees (
        id INTEGER PRIMARY KEY,
        name TEXT,
        dept_id INTEGER
      );
      CREATE TABLE departments (
        id INTEGER PRIMARY KEY,
        name TEXT
      );
    `,
    seed: `
      INSERT INTO departments VALUES (1, 'Engineering');
      INSERT INTO departments VALUES (2, 'Marketing');
      INSERT INTO departments VALUES (3, 'Legal');
      INSERT INTO employees VALUES (1, 'Alice', 1);
      INSERT INTO employees VALUES (2, 'Bob', 2);
      INSERT INTO employees VALUES (3, 'Carol', 1);
    `,
    solutionQuery: `SELECT d.name as department, e.name as employee FROM departments d LEFT JOIN employees e ON d.id = e.dept_id;`,
    validate: (rows) => rows.length >= 4 && rows.some(r => r.employee === null || r.employee === undefined || r.employee === ''),
    expectedNote: '4 rows including Legal dept with NULL employee'
  },

  // ===== TIER 4: ADVANCED =====
  {
    id: 'adv01',
    tier: 4,
    tierName: 'Advanced',
    title: 'Above Average',
    description: 'Find all employees who earn more than the average salary across all employees.',
    hint: 'Use a subquery: WHERE salary > (SELECT AVG(salary) FROM employees)',
    xp: 100,
    concepts: ['Subquery', 'AVG'],
    schema: `
      CREATE TABLE employees (
        id INTEGER PRIMARY KEY,
        name TEXT,
        department TEXT,
        salary INTEGER
      );
    `,
    seed: `
      INSERT INTO employees VALUES (1,'Alice','Engineering',95000);
      INSERT INTO employees VALUES (2,'Bob','Marketing',72000);
      INSERT INTO employees VALUES (3,'Carol','Engineering',105000);
      INSERT INTO employees VALUES (4,'David','HR',65000);
      INSERT INTO employees VALUES (5,'Eva','Marketing',80000);
    `,
    solutionQuery: `SELECT name, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);`,
    validate: (rows) => rows.length === 2 && rows.every(r => r.salary > 83400),
    expectedNote: 'Employees above average salary (~83,400)'
  },

  {
    id: 'adv02',
    tier: 4,
    tierName: 'Advanced',
    title: 'CTE Elegance',
    description: 'Use a CTE to find the department with the highest average salary.',
    hint: 'WITH dept_avg AS (SELECT department, AVG(salary) ... ) SELECT ... FROM dept_avg ORDER BY ... LIMIT 1',
    xp: 100,
    concepts: ['CTE', 'WITH', 'AVG'],
    schema: `
      CREATE TABLE employees (
        id INTEGER PRIMARY KEY,
        name TEXT,
        department TEXT,
        salary INTEGER
      );
    `,
    seed: `
      INSERT INTO employees VALUES (1,'Alice','Engineering',95000);
      INSERT INTO employees VALUES (2,'Bob','Marketing',72000);
      INSERT INTO employees VALUES (3,'Carol','Engineering',105000);
      INSERT INTO employees VALUES (4,'David','HR',65000);
      INSERT INTO employees VALUES (5,'Eva','Marketing',80000);
      INSERT INTO employees VALUES (6,'Frank','Engineering',88000);
    `,
    solutionQuery: `
      WITH dept_avg AS (
        SELECT department, AVG(salary) as avg_salary
        FROM employees
        GROUP BY department
      )
      SELECT department, avg_salary
      FROM dept_avg
      ORDER BY avg_salary DESC
      LIMIT 1;
    `,
    validate: (rows) => rows.length === 1 && rows[0].department === 'Engineering',
    expectedNote: '1 row: Engineering (highest avg)'
  },

  {
    id: 'adv03',
    tier: 4,
    tierName: 'Advanced',
    title: 'Row Number',
    description: 'Rank employees within each department by salary (highest = rank 1) using a window function.',
    hint: 'Use RANK() OVER (PARTITION BY department ORDER BY salary DESC)',
    xp: 120,
    concepts: ['Window Functions', 'RANK()', 'PARTITION BY'],
    schema: `
      CREATE TABLE employees (
        id INTEGER PRIMARY KEY,
        name TEXT,
        department TEXT,
        salary INTEGER
      );
    `,
    seed: `
      INSERT INTO employees VALUES (1,'Alice','Engineering',95000);
      INSERT INTO employees VALUES (2,'Bob','Marketing',72000);
      INSERT INTO employees VALUES (3,'Carol','Engineering',105000);
      INSERT INTO employees VALUES (4,'David','HR',65000);
      INSERT INTO employees VALUES (5,'Eva','Marketing',80000);
      INSERT INTO employees VALUES (6,'Frank','Engineering',88000);
    `,
    solutionQuery: `SELECT name, department, salary, RANK() OVER (PARTITION BY department ORDER BY salary DESC) as dept_rank FROM employees;`,
    validate: (rows, cols) => cols.some(c => c.includes('rank')) && rows.length === 6,
    expectedNote: '6 rows with dept_rank column'
  },

  // ===== TIER 5: EXPERT =====
  {
    id: 'exp01',
    tier: 5,
    tierName: 'Expert',
    title: 'The Top Earner Per Dept',
    description: 'Find the highest-paid employee in each department. Show their name, department, and salary.',
    hint: 'Use RANK() or a correlated subquery. Filter WHERE dept_rank = 1 from a CTE.',
    xp: 200,
    concepts: ['CTE', 'Window Functions', 'RANK()'],
    schema: `
      CREATE TABLE employees (
        id INTEGER PRIMARY KEY,
        name TEXT,
        department TEXT,
        salary INTEGER
      );
    `,
    seed: `
      INSERT INTO employees VALUES (1,'Alice','Engineering',95000);
      INSERT INTO employees VALUES (2,'Bob','Marketing',72000);
      INSERT INTO employees VALUES (3,'Carol','Engineering',105000);
      INSERT INTO employees VALUES (4,'David','HR',65000);
      INSERT INTO employees VALUES (5,'Eva','Marketing',80000);
    `,
    solutionQuery: `
      WITH ranked AS (
        SELECT name, department, salary,
               RANK() OVER (PARTITION BY department ORDER BY salary DESC) as rk
        FROM employees
      )
      SELECT name, department, salary FROM ranked WHERE rk = 1;
    `,
    validate: (rows) => rows.length === 3,
    expectedNote: '3 rows — 1 per department'
  },

  {
    id: 'exp02',
    tier: 5,
    tierName: 'Expert',
    title: 'Running Total',
    description: 'Calculate a running total of salaries ordered by hire date (earliest first).',
    hint: 'Use SUM(salary) OVER (ORDER BY hire_date ROWS UNBOUNDED PRECEDING)',
    xp: 200,
    concepts: ['Window Functions', 'Running Total', 'SUM() OVER'],
    schema: `
      CREATE TABLE employees (
        id INTEGER PRIMARY KEY,
        name TEXT,
        salary INTEGER,
        hire_date TEXT
      );
    `,
    seed: `
      INSERT INTO employees VALUES (1,'Alice',95000,'2018-01-10');
      INSERT INTO employees VALUES (2,'Bob',72000,'2019-07-22');
      INSERT INTO employees VALUES (3,'Carol',80000,'2020-03-15');
      INSERT INTO employees VALUES (4,'David',65000,'2021-11-01');
      INSERT INTO employees VALUES (5,'Eva',105000,'2022-06-05');
    `,
    solutionQuery: `SELECT name, hire_date, salary, SUM(salary) OVER (ORDER BY hire_date) as running_total FROM employees;`,
    validate: (rows, cols) => cols.some(c => c.includes('running')) && rows.length === 5,
    expectedNote: '5 rows with cumulative running_total'
  },

  // ===== TIER 6: LEGENDARY =====
  {
    id: 'leg01',
    tier: 6,
    tierName: 'Legendary',
    title: 'Org Tree',
    description: 'Use a recursive CTE to traverse an employee hierarchy. Return each employee\'s name and their manager\'s name.',
    hint: 'WITH RECURSIVE hierarchy AS (base case UNION ALL recursive case). Join on manager_id = id.',
    xp: 500,
    concepts: ['Recursive CTE', 'Hierarchy', 'Self-Join'],
    schema: `
      CREATE TABLE employees (
        id INTEGER PRIMARY KEY,
        name TEXT,
        manager_id INTEGER
      );
    `,
    seed: `
      INSERT INTO employees VALUES (1, 'CEO Dana', NULL);
      INSERT INTO employees VALUES (2, 'VP Alice', 1);
      INSERT INTO employees VALUES (3, 'VP Bob', 1);
      INSERT INTO employees VALUES (4, 'Dev Carol', 2);
      INSERT INTO employees VALUES (5, 'Dev Frank', 2);
      INSERT INTO employees VALUES (6, 'Mkt Eva', 3);
    `,
    solutionQuery: `
      WITH RECURSIVE hierarchy AS (
        SELECT id, name, manager_id, 0 as depth
        FROM employees WHERE manager_id IS NULL
        UNION ALL
        SELECT e.id, e.name, e.manager_id, h.depth + 1
        FROM employees e
        JOIN hierarchy h ON e.manager_id = h.id
      )
      SELECT h.name as employee, m.name as manager, h.depth as level
      FROM hierarchy h
      LEFT JOIN employees m ON h.manager_id = m.id
      ORDER BY h.depth, h.name;
    `,
    validate: (rows) => rows.length === 6,
    expectedNote: '6 rows showing full org hierarchy'
  }
];

// Tier metadata
window.TIERS = [
  { id: 1, name: 'Rookie',    icon: '🌱', color: '#10b981', minXP: 0 },
  { id: 2, name: 'Amateur',   icon: '⚡', color: '#3b82f6', minXP: 50 },
  { id: 3, name: 'Skilled',   icon: '🔗', color: '#f59e0b', minXP: 150 },
  { id: 4, name: 'Advanced',  icon: '🧠', color: '#7c3aed', minXP: 400 },
  { id: 5, name: 'Expert',    icon: '🏆', color: '#ef4444', minXP: 800 },
  { id: 6, name: 'Legendary', icon: '⚡', color: '#00d4ff', minXP: 2000 },
];
