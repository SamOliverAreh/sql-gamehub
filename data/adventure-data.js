// adventure-data.js — All story-mode challenge definitions

window.ADVENTURE_DATA = {

  // ===================== DETECTIVE =====================
  detective: [
    {
      id: 'det01',
      title: 'The Missing CFO',
      story: 'CFO Raymond Chen hasn\'t shown up in 3 days. HR records show he badged in last Tuesday at 11:47pm. Query the access_logs to find every location he visited that night.',
      narrative: `The city rain hammers your office window. A manila envelope slides under the door — DataCorp letterhead. "Find Ray Chen. Before they do." You open the company database and start typing...`,
      objective: 'Find all building access events for employee_id 1047 on 2024-01-16, ordered by time.',
      hint: 'Filter by employee_id AND date using WHERE. Use strftime or LIKE for date filtering.',
      concepts: ['SELECT', 'WHERE', 'ORDER BY', 'Date Filter'],
      xp: 40,
      mode: 'detective',
      schema: `
        CREATE TABLE access_logs (
          id INTEGER PRIMARY KEY,
          employee_id INTEGER,
          employee_name TEXT,
          location TEXT,
          badge_time TEXT,
          action TEXT
        );`,
      seed: `
        INSERT INTO access_logs VALUES (1,1047,'Raymond Chen','Main Lobby','2024-01-16 08:12:00','ENTRY');
        INSERT INTO access_logs VALUES (2,1047,'Raymond Chen','Floor 12 - Finance','2024-01-16 08:15:00','ENTRY');
        INSERT INTO access_logs VALUES (3,1001,'Alice Wong','Main Lobby','2024-01-16 09:00:00','ENTRY');
        INSERT INTO access_logs VALUES (4,1047,'Raymond Chen','Server Room B','2024-01-16 23:47:00','ENTRY');
        INSERT INTO access_logs VALUES (5,1047,'Raymond Chen','Parking Garage','2024-01-16 23:52:00','EXIT');
        INSERT INTO access_logs VALUES (6,1002,'Bob Marsh','Main Lobby','2024-01-16 10:30:00','ENTRY');
        INSERT INTO access_logs VALUES (7,1047,'Raymond Chen','Floor 12 - Finance','2024-01-16 23:49:00','ENTRY');`,
      solutionQuery: `SELECT location, badge_time, action FROM access_logs WHERE employee_id = 1047 AND badge_time LIKE '2024-01-16%' ORDER BY badge_time;`,
      validate: (rows) => rows.length === 4 && rows.some(r => r.location && r.location.includes('Server')),
      expectedNote: '4 events including Server Room B at 11:47pm'
    },
    {
      id: 'det02',
      title: 'Follow the Money',
      story: 'The auditors found anomalies. 47 transactions over $50,000 in a single week — all from one account. Query the transactions table to identify the top 5 largest transfers and who authorized them.',
      narrative: `"The money didn't just vanish," your informant whispers. "It was moved. Carefully. Incrementally." You pull up the transactions database and crack your knuckles.`,
      objective: 'Find the top 5 transactions by amount, showing sender, receiver, amount, and authorized_by.',
      hint: 'ORDER BY amount DESC then LIMIT 5.',
      concepts: ['ORDER BY', 'LIMIT', 'SELECT columns'],
      xp: 50,
      mode: 'detective',
      schema: `
        CREATE TABLE transactions (
          id INTEGER PRIMARY KEY,
          sender_account TEXT,
          receiver_account TEXT,
          amount REAL,
          authorized_by TEXT,
          tx_date TEXT,
          notes TEXT
        );`,
      seed: `
        INSERT INTO transactions VALUES (1,'ACC-001','ACC-OFFSHORE-77',125000.00,'R. Chen','2024-01-15','Consulting');
        INSERT INTO transactions VALUES (2,'ACC-001','ACC-OFFSHORE-77',98500.00,'R. Chen','2024-01-14','Equipment');
        INSERT INTO transactions VALUES (3,'ACC-003','ACC-005',12000.00,'A. Wong','2024-01-13','Payroll');
        INSERT INTO transactions VALUES (4,'ACC-001','ACC-OFFSHORE-77',200000.00,'R. Chen','2024-01-16','Infrastructure');
        INSERT INTO transactions VALUES (5,'ACC-002','ACC-006',8000.00,'B. Marsh','2024-01-12','Office supplies');
        INSERT INTO transactions VALUES (6,'ACC-001','ACC-OFFSHORE-99',75000.00,'R. Chen','2024-01-15','Legal fees');
        INSERT INTO transactions VALUES (7,'ACC-001','ACC-OFFSHORE-77',55000.00,'R. Chen','2024-01-13','Software');`,
      solutionQuery: `SELECT sender_account, receiver_account, amount, authorized_by FROM transactions ORDER BY amount DESC LIMIT 5;`,
      validate: (rows) => rows.length === 5 && parseFloat(rows[0].amount) >= 200000,
      expectedNote: 'Top 5 transactions, largest first ($200k)'
    },
    {
      id: 'det03',
      title: 'The Inside Man',
      story: 'Someone leaked the server room access code. Only employees with "ADMIN" clearance AND access to Floor 12 could have done it. Cross-reference both tables to find the suspects.',
      narrative: `Two data points. Two tables. One leak. "Whoever got into that server room," the security chief says, "had help from someone on the inside." You JOIN the tables and wait.`,
      objective: 'Find employees who have BOTH admin_clearance = 1 AND accessed "Floor 12 - Finance" in access_logs.',
      hint: 'JOIN employees to access_logs on employee_id, then filter by admin_clearance AND location.',
      concepts: ['INNER JOIN', 'WHERE multiple conditions'],
      xp: 70,
      mode: 'detective',
      schema: `
        CREATE TABLE employees (
          id INTEGER PRIMARY KEY,
          name TEXT,
          department TEXT,
          admin_clearance INTEGER
        );
        CREATE TABLE access_logs (
          id INTEGER PRIMARY KEY,
          employee_id INTEGER,
          location TEXT,
          badge_time TEXT
        );`,
      seed: `
        INSERT INTO employees VALUES (1001,'Alice Wong','Engineering',0);
        INSERT INTO employees VALUES (1002,'Bob Marsh','IT',1);
        INSERT INTO employees VALUES (1003,'Carol Reyes','Finance',1);
        INSERT INTO employees VALUES (1004,'Dan Okafor','Marketing',0);
        INSERT INTO employees VALUES (1047,'Raymond Chen','Finance',1);
        INSERT INTO access_logs VALUES (1,1002,'Floor 12 - Finance','2024-01-16 23:30:00');
        INSERT INTO access_logs VALUES (2,1003,'Floor 12 - Finance','2024-01-15 09:00:00');
        INSERT INTO access_logs VALUES (3,1001,'Floor 12 - Finance','2024-01-14 14:00:00');
        INSERT INTO access_logs VALUES (4,1004,'Main Lobby','2024-01-16 08:00:00');
        INSERT INTO access_logs VALUES (5,1047,'Server Room B','2024-01-16 23:47:00');`,
      solutionQuery: `SELECT DISTINCT e.name, e.department FROM employees e INNER JOIN access_logs al ON e.id = al.employee_id WHERE e.admin_clearance = 1 AND al.location = 'Floor 12 - Finance';`,
      validate: (rows) => rows.length === 2,
      expectedNote: '2 suspects with admin clearance + Floor 12 access'
    },
    {
      id: 'det04',
      title: 'Conspiracy Web',
      story: 'The CFO had accomplices. Using a CTE, find all employees who reported to him directly OR indirectly (up to 2 levels), and check if any of them also authorized suspicious transactions.',
      narrative: `"It's not one person," the DA says. "It's a network." You stare at the org chart and the transaction logs. Time to write the most important query of your career.`,
      objective: 'Use a CTE to find direct and indirect reports of employee_id 1047, then JOIN with transactions to find any who authorized payments.',
      hint: 'WITH reports AS (SELECT id,name,manager_id FROM employees WHERE manager_id=1047 ...) then JOIN to transactions on authorized_by name.',
      concepts: ['CTE', 'JOIN', 'Subquery'],
      xp: 90,
      mode: 'detective',
      schema: `
        CREATE TABLE employees (
          id INTEGER PRIMARY KEY,
          name TEXT,
          manager_id INTEGER
        );
        CREATE TABLE transactions (
          id INTEGER PRIMARY KEY,
          amount REAL,
          authorized_by TEXT
        );`,
      seed: `
        INSERT INTO employees VALUES (1047,'Raymond Chen',NULL);
        INSERT INTO employees VALUES (1003,'Carol Reyes',1047);
        INSERT INTO employees VALUES (1002,'Bob Marsh',1047);
        INSERT INTO employees VALUES (1005,'Eve Santos',1003);
        INSERT INTO employees VALUES (1001,'Alice Wong',1001);
        INSERT INTO transactions VALUES (1,125000,'Carol Reyes');
        INSERT INTO transactions VALUES (2,98500,'Bob Marsh');
        INSERT INTO transactions VALUES (3,12000,'Alice Wong');
        INSERT INTO transactions VALUES (4,200000,'Raymond Chen');`,
      solutionQuery: `
        WITH reports AS (
          SELECT id, name FROM employees WHERE manager_id = 1047
          UNION
          SELECT e.id, e.name FROM employees e
          JOIN employees m ON e.manager_id = m.id WHERE m.manager_id = 1047
        )
        SELECT r.name, t.amount FROM reports r
        JOIN transactions t ON t.authorized_by = r.name;`,
      validate: (rows) => rows.length >= 2,
      expectedNote: 'At least 2 accomplices found in transactions'
    },
    {
      id: 'det05',
      title: 'The Smoking Gun',
      story: 'Cross-reference ALL evidence: employees with admin access, Floor 12 visits after 10pm, and transaction authorization — all in one query. Build the full picture.',
      narrative: `The pieces are all there. The final query will either confirm your theory — or blow it apart. You type slowly, deliberately. This is the query that closes the case.`,
      objective: 'Find employees who have admin_clearance=1, visited Floor 12 after 22:00, AND authorized a transaction over $50,000. Show their name, amount, and badge_time.',
      hint: 'JOIN three tables: employees, access_logs, transactions. Filter badge_time > 22:00 using LIKE or strftime, amount > 50000.',
      concepts: ['Multi-table JOIN', 'Complex WHERE', 'String filtering'],
      xp: 100,
      mode: 'detective',
      schema: `
        CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, admin_clearance INTEGER);
        CREATE TABLE access_logs (id INTEGER PRIMARY KEY, employee_id INTEGER, location TEXT, badge_time TEXT);
        CREATE TABLE transactions (id INTEGER PRIMARY KEY, authorized_by TEXT, amount REAL);`,
      seed: `
        INSERT INTO employees VALUES (1002,'Bob Marsh',1);
        INSERT INTO employees VALUES (1003,'Carol Reyes',1);
        INSERT INTO employees VALUES (1001,'Alice Wong',0);
        INSERT INTO access_logs VALUES (1,1002,'Floor 12 - Finance','2024-01-16 23:30:00');
        INSERT INTO access_logs VALUES (2,1003,'Floor 12 - Finance','2024-01-15 09:00:00');
        INSERT INTO access_logs VALUES (3,1001,'Floor 12 - Finance','2024-01-16 22:15:00');
        INSERT INTO transactions VALUES (1,'Bob Marsh',98500);
        INSERT INTO transactions VALUES (2,'Carol Reyes',12000);
        INSERT INTO transactions VALUES (3,'Alice Wong',75000);`,
      solutionQuery: `
        SELECT e.name, t.amount, al.badge_time
        FROM employees e
        JOIN access_logs al ON e.id = al.employee_id
        JOIN transactions t ON t.authorized_by = e.name
        WHERE e.admin_clearance = 1
          AND al.location = 'Floor 12 - Finance'
          AND al.badge_time > '2024-01-16 22:00:00'
          AND t.amount > 50000;`,
      validate: (rows) => rows.length >= 1,
      expectedNote: 'The guilty party identified with all 3 criteria met'
    },
    {
      id: 'det06',
      title: 'Case Closed',
      story: 'Write the final report. Use a window function to rank all suspects by total transaction amount authorized, and show their cumulative running total of suspicious payments.',
      narrative: `You slide the dossier across the DA's desk. "Every suspect. Every dollar. Every timestamp." The DA's eyes widen. "How did you—" You smile. "SQL."`,
      objective: 'For each person in transactions, show their name, total amount authorized, their rank by total, and a running total ordered by rank.',
      hint: 'GROUP BY name for totals. Then use SUM() OVER and RANK() OVER in a CTE or subquery.',
      concepts: ['GROUP BY', 'RANK()', 'SUM() OVER', 'Window Functions'],
      xp: 100,
      mode: 'detective',
      schema: `
        CREATE TABLE transactions (id INTEGER PRIMARY KEY, authorized_by TEXT, amount REAL, tx_date TEXT);`,
      seed: `
        INSERT INTO transactions VALUES (1,'Bob Marsh',98500,'2024-01-14');
        INSERT INTO transactions VALUES (2,'Carol Reyes',12000,'2024-01-13');
        INSERT INTO transactions VALUES (3,'Raymond Chen',200000,'2024-01-16');
        INSERT INTO transactions VALUES (4,'Bob Marsh',55000,'2024-01-13');
        INSERT INTO transactions VALUES (5,'Raymond Chen',125000,'2024-01-15');
        INSERT INTO transactions VALUES (6,'Carol Reyes',8000,'2024-01-12');`,
      solutionQuery: `
        WITH totals AS (
          SELECT authorized_by, SUM(amount) as total_amount
          FROM transactions GROUP BY authorized_by
        )
        SELECT authorized_by, total_amount,
          RANK() OVER (ORDER BY total_amount DESC) as suspect_rank,
          SUM(total_amount) OVER (ORDER BY total_amount DESC) as running_total
        FROM totals;`,
      validate: (rows, cols) => rows.length === 3 && cols.some(c => c.includes('rank')),
      expectedNote: '3 suspects ranked by total amount with running total'
    }
  ],

  // ===================== SPACE =====================
  space: [
    {
      id: 'sp01',
      title: 'System Diagnostics',
      story: 'The ship\'s computer is flickering. Run a systems check — query all ship_systems and find which ones have status != "NOMINAL". We need a list fast.',
      narrative: `Red warning lights pulse across the bridge. "Lieutenant Vega," the Captain says, "I need that systems report NOW." Your fingers hit the keyboard. The void of space has never felt so close.`,
      objective: 'Select all ship systems where status is NOT "NOMINAL", ordered by severity descending.',
      hint: 'Use WHERE status != \'NOMINAL\' and ORDER BY severity DESC.',
      concepts: ['WHERE !=', 'ORDER BY DESC'],
      xp: 50,
      mode: 'space',
      schema: `
        CREATE TABLE ship_systems (
          id INTEGER PRIMARY KEY,
          system_name TEXT,
          status TEXT,
          severity INTEGER,
          last_checked TEXT
        );`,
      seed: `
        INSERT INTO ship_systems VALUES (1,'Life Support','NOMINAL',0,'2157-03-12 08:00');
        INSERT INTO ship_systems VALUES (2,'Navigation Array','CRITICAL',5,'2157-03-12 07:45');
        INSERT INTO ship_systems VALUES (3,'Hyperdrive','WARNING',3,'2157-03-12 07:50');
        INSERT INTO ship_systems VALUES (4,'Communications','NOMINAL',0,'2157-03-12 08:00');
        INSERT INTO ship_systems VALUES (5,'Oxygen Recycler','WARNING',4,'2157-03-12 07:55');
        INSERT INTO ship_systems VALUES (6,'Gravity Plating','OFFLINE',5,'2157-03-12 06:00');`,
      solutionQuery: `SELECT system_name, status, severity FROM ship_systems WHERE status != 'NOMINAL' ORDER BY severity DESC;`,
      validate: (rows) => rows.length === 4 && rows[0].severity >= rows[rows.length-1].severity,
      expectedNote: '4 non-nominal systems ordered by severity'
    },
    {
      id: 'sp02',
      title: 'Crew Manifest',
      story: 'We\'re approaching a gravity well. Need the total mass of all crew plus equipment by department to calculate thrust needed. GROUP BY department and show totals.',
      narrative: `"If we can't calculate the thrust ratio," Engineer Zhao warns, "we'll be pulled in." You pull up the manifest tables. Physics is just math. Math is just queries.`,
      objective: 'Find the count of crew members and sum of their equipment_kg per department, only for departments with more than 2 crew members.',
      hint: 'GROUP BY department, COUNT(*), SUM(equipment_kg), then HAVING COUNT(*) > 2.',
      concepts: ['GROUP BY', 'COUNT', 'SUM', 'HAVING'],
      xp: 80,
      mode: 'space',
      schema: `
        CREATE TABLE crew (
          id INTEGER PRIMARY KEY,
          name TEXT,
          department TEXT,
          rank TEXT,
          equipment_kg REAL
        );`,
      seed: `
        INSERT INTO crew VALUES (1,'Vega','Command',  'Lieutenant',12.5);
        INSERT INTO crew VALUES (2,'Chen','Command',  'Captain',   15.0);
        INSERT INTO crew VALUES (3,'Zhao','Engineering','Engineer', 22.0);
        INSERT INTO crew VALUES (4,'Park','Engineering','Tech',     18.5);
        INSERT INTO crew VALUES (5,'Kim', 'Engineering','Tech',     17.0);
        INSERT INTO crew VALUES (6,'Ross','Science',  'Scientist',  10.0);
        INSERT INTO crew VALUES (7,'Diaz','Command',  'Ensign',    11.0);`,
      solutionQuery: `SELECT department, COUNT(*) as crew_count, SUM(equipment_kg) as total_kg FROM crew GROUP BY department HAVING COUNT(*) > 2;`,
      validate: (rows) => rows.length === 2 && rows.every(r => r.crew_count > 2),
      expectedNote: '2 departments (Command & Engineering) with 3+ crew'
    },
    {
      id: 'sp03',
      title: 'Star Chart Navigation',
      story: 'The nav array is down. You need to find the nearest star systems within 50 light-years that have a habitable_score > 6, joined with our fuel_depot records to see if we can reach them.',
      narrative: `Static fills the nav screen. You have the star charts. You have the fuel logs. You have SQL. "Can we make it?" the Captain asks. One JOIN will tell you everything.`,
      objective: 'JOIN star_systems with fuel_depots on system_id. Show systems within 50 ly with habitable_score > 6 that have a fuel depot with fuel_units > 100.',
      hint: 'INNER JOIN star_systems with fuel_depots ON star_systems.id = fuel_depots.system_id, then WHERE distance_ly <= 50 AND habitable_score > 6 AND fuel_units > 100.',
      concepts: ['INNER JOIN', 'Multiple WHERE conditions'],
      xp: 100,
      mode: 'space',
      schema: `
        CREATE TABLE star_systems (
          id INTEGER PRIMARY KEY,
          name TEXT,
          distance_ly REAL,
          habitable_score INTEGER
        );
        CREATE TABLE fuel_depots (
          id INTEGER PRIMARY KEY,
          system_id INTEGER,
          fuel_units INTEGER,
          last_resupply TEXT
        );`,
      seed: `
        INSERT INTO star_systems VALUES (1,'Alpha Centauri B',4.2,8);
        INSERT INTO star_systems VALUES (2,'Tau Ceti',11.9,7);
        INSERT INTO star_systems VALUES (3,'Proxima Centauri',4.2,3);
        INSERT INTO star_systems VALUES (4,'Epsilon Eridani',10.5,9);
        INSERT INTO star_systems VALUES (5,'Wolf 359',7.9,2);
        INSERT INTO star_systems VALUES (6,'Vega Prime',55.0,9);
        INSERT INTO fuel_depots VALUES (1,1,250,'2157-01-10');
        INSERT INTO fuel_depots VALUES (2,2,50,'2157-02-01');
        INSERT INTO fuel_depots VALUES (3,4,400,'2157-03-01');
        INSERT INTO fuel_depots VALUES (4,6,600,'2157-03-10');`,
      solutionQuery: `SELECT ss.name, ss.distance_ly, ss.habitable_score, fd.fuel_units FROM star_systems ss INNER JOIN fuel_depots fd ON ss.id = fd.system_id WHERE ss.distance_ly <= 50 AND ss.habitable_score > 6 AND fd.fuel_units > 100;`,
      validate: (rows) => rows.length === 2,
      expectedNote: '2 reachable habitable systems with enough fuel'
    },
    {
      id: 'sp04',
      title: 'Oxygen Crisis',
      story: 'The recyclers are failing. Use a CTE to calculate each crew member\'s oxygen consumption rate vs their department average. Flag anyone consuming more than 20% above their department average.',
      narrative: `The air is getting thin. "Who's consuming the most oxygen?" Medical Officer Park asks. You don't guess. You query.`,
      objective: 'Use a CTE to find department average O2 consumption, then SELECT crew members whose o2_per_hour is more than 20% above their department average.',
      hint: 'WITH dept_avg AS (SELECT department, AVG(o2_per_hour) as avg_o2 FROM crew GROUP BY department) SELECT c.name, c.o2_per_hour, d.avg_o2 FROM crew c JOIN dept_avg d ... WHERE c.o2_per_hour > d.avg_o2 * 1.2.',
      concepts: ['CTE', 'AVG', 'JOIN', 'Calculated condition'],
      xp: 130,
      mode: 'space',
      schema: `
        CREATE TABLE crew (
          id INTEGER PRIMARY KEY,
          name TEXT,
          department TEXT,
          o2_per_hour REAL
        );`,
      seed: `
        INSERT INTO crew VALUES (1,'Vega',   'Command',     1.2);
        INSERT INTO crew VALUES (2,'Chen',   'Command',     1.8);
        INSERT INTO crew VALUES (3,'Zhao',   'Engineering', 1.4);
        INSERT INTO crew VALUES (4,'Park',   'Engineering', 2.1);
        INSERT INTO crew VALUES (5,'Kim',    'Engineering', 1.3);
        INSERT INTO crew VALUES (6,'Ross',   'Science',     1.1);
        INSERT INTO crew VALUES (7,'Diaz',   'Command',     1.0);`,
      solutionQuery: `
        WITH dept_avg AS (
          SELECT department, AVG(o2_per_hour) as avg_o2
          FROM crew GROUP BY department
        )
        SELECT c.name, c.department, c.o2_per_hour, ROUND(d.avg_o2,2) as dept_avg
        FROM crew c
        JOIN dept_avg d ON c.department = d.department
        WHERE c.o2_per_hour > d.avg_o2 * 1.2;`,
      validate: (rows) => rows.length >= 1,
      expectedNote: 'Crew members consuming 20%+ above their dept average'
    },
    {
      id: 'sp05',
      title: 'The Final Jump',
      story: 'One last hyperspace jump. Use a recursive CTE to trace the optimal route through waypoints — each waypoint links to the next via next_waypoint_id. List the full chain from START to EARTH.',
      narrative: `"One jump left," Zhao says quietly. "If the route is wrong, we miss Earth's gravity window forever." You open the navigation database. Recursive SQL. The most powerful tool in the universe right now.`,
      objective: 'Write a recursive CTE to traverse waypoints from the one named "START" to the final destination, showing each waypoint name and hop number in order.',
      hint: 'WITH RECURSIVE route AS (base: WHERE name=\'START\' UNION ALL recursive: JOIN waypoints ON w.id = r.next_id) SELECT name, hop FROM route.',
      concepts: ['Recursive CTE', 'Graph traversal', 'WITH RECURSIVE'],
      xp: 140,
      mode: 'space',
      schema: `
        CREATE TABLE waypoints (
          id INTEGER PRIMARY KEY,
          name TEXT,
          sector TEXT,
          next_waypoint_id INTEGER
        );`,
      seed: `
        INSERT INTO waypoints VALUES (1,'START','Deep Void',2);
        INSERT INTO waypoints VALUES (2,'Kepler Station','Kepler Belt',3);
        INSERT INTO waypoints VALUES (3,'Asteroid Ring Alpha','Sol Approach',4);
        INSERT INTO waypoints VALUES (4,'Luna Relay','Sol System',5);
        INSERT INTO waypoints VALUES (5,'EARTH','Sol System',NULL);`,
      solutionQuery: `
        WITH RECURSIVE route AS (
          SELECT id, name, sector, next_waypoint_id, 1 as hop
          FROM waypoints WHERE name = 'START'
          UNION ALL
          SELECT w.id, w.name, w.sector, w.next_waypoint_id, r.hop + 1
          FROM waypoints w
          JOIN route r ON w.id = r.next_waypoint_id
        )
        SELECT name, sector, hop FROM route ORDER BY hop;`,
      validate: (rows) => rows.length === 5 && rows[rows.length-1].name === 'EARTH',
      expectedNote: '5 waypoints from START to EARTH in order'
    }
  ],

  // ===================== DUNGEON =====================
  dungeon: [
    {
      id: 'dun01',
      title: 'Floor 1: The Goblin Scribe',
      story: 'A goblin blocks the stairs, furiously scribbling in a ledger. "Answer my query, or never pass!" He demands a list of all monsters on Floor 1, sorted by danger level ascending.',
      narrative: `You descend the mossy steps. Torchlight flickers. A hunched goblin looks up from his tome. "IDENTIFY YOURSELF." You say nothing. You open your terminal. Time to fight with code.`,
      objective: 'Select all monsters on floor_number = 1, ordered by danger_level ASC.',
      hint: 'Simple SELECT with WHERE floor_number = 1 ORDER BY danger_level ASC.',
      concepts: ['SELECT', 'WHERE', 'ORDER BY ASC'],
      xp: 30,
      mode: 'dungeon',
      schema: `
        CREATE TABLE monsters (
          id INTEGER PRIMARY KEY,
          name TEXT,
          floor_number INTEGER,
          danger_level INTEGER,
          weakness TEXT
        );`,
      seed: `
        INSERT INTO monsters VALUES (1,'Goblin Scribe',1,2,'Fire');
        INSERT INTO monsters VALUES (2,'Rat Swarm',1,1,'Light');
        INSERT INTO monsters VALUES (3,'Skeleton Archer',2,4,'Blunt');
        INSERT INTO monsters VALUES (4,'Cave Troll',1,3,'Magic');
        INSERT INTO monsters VALUES (5,'Dark Knight',5,9,'Holy');
        INSERT INTO monsters VALUES (6,'Shadow Wyrm',7,10,'Ancient SQL');`,
      solutionQuery: `SELECT name, danger_level, weakness FROM monsters WHERE floor_number = 1 ORDER BY danger_level ASC;`,
      validate: (rows) => rows.length === 3 && rows[0].danger_level <= rows[rows.length-1].danger_level,
      expectedNote: '3 monsters on Floor 1 sorted by danger ASC'
    },
    {
      id: 'dun02',
      title: 'Floor 2: The Inventory Room',
      story: 'A trapped adventurer left loot behind. Find all items in the chest where item_type = "weapon" OR value > 100 gold. These could help you survive the floors below.',
      narrative: `Skeletons rattle as you step over them. A rusted chest sits in the corner. The goblin scribe\'s key clicks. Inside: weapons, potions, junk. You query the contents.`,
      objective: 'Find all chest items where item_type is "weapon" OR gold_value > 100, ordered by gold_value DESC.',
      hint: 'Use WHERE item_type = \'weapon\' OR gold_value > 100 with parentheses for clarity.',
      concepts: ['WHERE OR', 'ORDER BY'],
      xp: 40,
      mode: 'dungeon',
      schema: `
        CREATE TABLE chest_items (
          id INTEGER PRIMARY KEY,
          name TEXT,
          item_type TEXT,
          gold_value INTEGER,
          enchanted INTEGER
        );`,
      seed: `
        INSERT INTO chest_items VALUES (1,'Iron Sword','weapon',80,0);
        INSERT INTO chest_items VALUES (2,'Health Potion','consumable',50,0);
        INSERT INTO chest_items VALUES (3,'Enchanted Bow','weapon',200,1);
        INSERT INTO chest_items VALUES (4,'Dragon Scale','material',150,0);
        INSERT INTO chest_items VALUES (5,'Old Boot','junk',5,0);
        INSERT INTO chest_items VALUES (6,'Staff of Querying','weapon',500,1);
        INSERT INTO chest_items VALUES (7,'Mana Crystal','consumable',120,0);`,
      solutionQuery: `SELECT name, item_type, gold_value, enchanted FROM chest_items WHERE item_type = 'weapon' OR gold_value > 100 ORDER BY gold_value DESC;`,
      validate: (rows) => rows.length === 5,
      expectedNote: '5 items: all weapons + items > 100 gold'
    },
    {
      id: 'dun03',
      title: 'Floor 3: The Dungeon Census',
      story: 'The dungeon keeper demands you prove your worth: count all monsters per floor and show the total danger per floor. Only then will she let you pass to Floor 4.',
      narrative: `A robed figure blocks the stairwell. "The dungeon has 47 rooms and I know every creature within them," she says. "Can you say the same?" You type. She watches.`,
      objective: 'Count monsters per floor and sum their danger_level. Show only floors with total_danger > 5.',
      hint: 'GROUP BY floor_number, COUNT(*), SUM(danger_level), HAVING SUM(danger_level) > 5.',
      concepts: ['GROUP BY', 'COUNT', 'SUM', 'HAVING'],
      xp: 60,
      mode: 'dungeon',
      schema: `
        CREATE TABLE monsters (
          id INTEGER PRIMARY KEY,
          name TEXT,
          floor_number INTEGER,
          danger_level INTEGER
        );`,
      seed: `
        INSERT INTO monsters VALUES (1,'Goblin',1,2);
        INSERT INTO monsters VALUES (2,'Rat',1,1);
        INSERT INTO monsters VALUES (3,'Cave Troll',1,3);
        INSERT INTO monsters VALUES (4,'Skeleton',2,4);
        INSERT INTO monsters VALUES (5,'Ghost',2,5);
        INSERT INTO monsters VALUES (6,'Banshee',3,6);
        INSERT INTO monsters VALUES (7,'Slime',3,2);
        INSERT INTO monsters VALUES (8,'Dark Knight',4,9);`,
      solutionQuery: `SELECT floor_number, COUNT(*) as monster_count, SUM(danger_level) as total_danger FROM monsters GROUP BY floor_number HAVING SUM(danger_level) > 5;`,
      validate: (rows) => rows.length === 3 && rows.every(r => r.total_danger > 5),
      expectedNote: '3 floors where total danger > 5'
    },
    {
      id: 'dun04',
      title: 'Floor 4: Cross the Chasm',
      story: 'A bridge spans the chasm — but each plank is a JOIN. Match adventurers who defeated monsters with the loot those monsters dropped. Only matched pairs will hold your weight.',
      narrative: `The chasm yawns below. A voice echoes: "Only those who can JOIN will cross." You look at the two tables carved into the stone walls. You see the relationship. You write the query.`,
      objective: 'JOIN adventurers with monster_kills on adventurer_id, then JOIN with loot on monster_id. Show adventurer name, monster defeated, and loot dropped.',
      hint: 'Three-table join: adventurers JOIN monster_kills JOIN loot.',
      concepts: ['Multi-table JOIN', 'INNER JOIN chain'],
      xp: 80,
      mode: 'dungeon',
      schema: `
        CREATE TABLE adventurers (id INTEGER PRIMARY KEY, name TEXT, class TEXT);
        CREATE TABLE monster_kills (id INTEGER PRIMARY KEY, adventurer_id INTEGER, monster_name TEXT, monster_id INTEGER);
        CREATE TABLE loot (id INTEGER PRIMARY KEY, monster_id INTEGER, item_name TEXT, gold_value INTEGER);`,
      seed: `
        INSERT INTO adventurers VALUES (1,'Aria','Rogue');
        INSERT INTO adventurers VALUES (2,'Bram','Warrior');
        INSERT INTO adventurers VALUES (3,'Cyra','Mage');
        INSERT INTO monster_kills VALUES (1,1,'Goblin',10);
        INSERT INTO monster_kills VALUES (2,2,'Cave Troll',11);
        INSERT INTO monster_kills VALUES (3,1,'Skeleton',12);
        INSERT INTO loot VALUES (1,10,'Goblin Dagger',25);
        INSERT INTO loot VALUES (2,11,'Troll Hide',80);
        INSERT INTO loot VALUES (3,12,'Bone Staff',60);`,
      solutionQuery: `SELECT a.name as adventurer, mk.monster_name, l.item_name, l.gold_value FROM adventurers a JOIN monster_kills mk ON a.id = mk.adventurer_id JOIN loot l ON mk.monster_id = l.id;`,
      validate: (rows) => rows.length === 3 && rows[0].adventurer,
      expectedNote: '3 rows: adventurer + monster + loot item'
    },
    {
      id: 'dun05',
      title: 'Floor 5: The Mirror Puzzle',
      story: 'Two enchanted mirrors show different versions of the dungeon roster. Use a subquery to find monsters that appear in BOTH the "active" list and have a danger level above the dungeon average.',
      narrative: `The mirrors shimmer. One shows reality, one shows shadow. "Find what is real AND dangerous," the Mirror Witch intones. You squint. You query. The truth emerges.`,
      objective: 'Find all monsters whose danger_level is above the average danger_level of ALL monsters in the dungeon.',
      hint: 'WHERE danger_level > (SELECT AVG(danger_level) FROM monsters).',
      concepts: ['Subquery', 'AVG', 'Scalar subquery'],
      xp: 100,
      mode: 'dungeon',
      schema: `
        CREATE TABLE monsters (id INTEGER PRIMARY KEY, name TEXT, floor_number INTEGER, danger_level INTEGER, status TEXT);`,
      seed: `
        INSERT INTO monsters VALUES (1,'Goblin',1,2,'active');
        INSERT INTO monsters VALUES (2,'Skeleton',2,4,'active');
        INSERT INTO monsters VALUES (3,'Cave Troll',1,3,'dormant');
        INSERT INTO monsters VALUES (4,'Dark Knight',5,9,'active');
        INSERT INTO monsters VALUES (5,'Lich',6,8,'active');
        INSERT INTO monsters VALUES (6,'Shadow Wyrm',7,10,'active');
        INSERT INTO monsters VALUES (7,'Banshee',3,5,'active');`,
      solutionQuery: `SELECT name, floor_number, danger_level FROM monsters WHERE danger_level > (SELECT AVG(danger_level) FROM monsters) ORDER BY danger_level DESC;`,
      validate: (rows) => rows.length >= 3 && rows.every(r => r.danger_level > 5),
      expectedNote: 'Monsters above average danger level'
    },
    {
      id: 'dun06',
      title: 'Floor 6: The Lich\'s Ledger',
      story: 'The Lich keeps meticulous records. Use window functions to rank all adventurers by total gold collected, and show a running total of gold as you go down the ranking.',
      narrative: `"My records are perfect," the Lich rasps. "Every gold coin, every kill, every betrayal — catalogued. Can you read them?" He slides an ancient tome across the altar. You open your terminal.`,
      objective: 'Show each adventurer\'s total_gold, their RANK() by total_gold DESC, and a running SUM of gold (cumulative, ordered by rank).',
      hint: 'WITH totals AS (GROUP BY) then SELECT name, total, RANK() OVER (...), SUM() OVER (...) FROM totals.',
      concepts: ['Window Functions', 'RANK()', 'SUM() OVER', 'CTE'],
      xp: 150,
      mode: 'dungeon',
      schema: `
        CREATE TABLE loot_collected (id INTEGER PRIMARY KEY, adventurer_name TEXT, gold_amount INTEGER);`,
      seed: `
        INSERT INTO loot_collected VALUES (1,'Aria',250);
        INSERT INTO loot_collected VALUES (2,'Bram',180);
        INSERT INTO loot_collected VALUES (3,'Cyra',420);
        INSERT INTO loot_collected VALUES (4,'Aria',100);
        INSERT INTO loot_collected VALUES (5,'Bram',300);
        INSERT INTO loot_collected VALUES (6,'Cyra',150);
        INSERT INTO loot_collected VALUES (7,'Dex',80);`,
      solutionQuery: `
        WITH totals AS (
          SELECT adventurer_name, SUM(gold_amount) as total_gold
          FROM loot_collected GROUP BY adventurer_name
        )
        SELECT adventurer_name, total_gold,
          RANK() OVER (ORDER BY total_gold DESC) as gold_rank,
          SUM(total_gold) OVER (ORDER BY total_gold DESC) as running_total
        FROM totals;`,
      validate: (rows, cols) => rows.length === 4 && cols.some(c => c.includes('rank')),
      expectedNote: '4 adventurers ranked by gold with running total'
    },
    {
      id: 'dun07',
      title: 'Floor 7: The Final Boss — Shadow Wyrm',
      story: 'THE LEGENDARY KEY IS HERE. The Shadow Wyrm guards it. Defeat it by writing a recursive CTE that traverses the dungeon\'s room connections from Floor 1 to Floor 7 — the Wyrm\'s lair — showing each room name and depth.',
      narrative: `The ground shakes. Ancient runes pulse. The Shadow Wyrm rises — 10,000 years of darkness, its weakness written in legend: "Only one who masters the recursive arts may pass." You crack your knuckles. This is what you trained for.`,
      objective: 'Write a recursive CTE to traverse dungeon_rooms from room_id=1 (Entrance) following next_room_id, showing each room name and depth level.',
      hint: 'WITH RECURSIVE path AS (SELECT id,name,next_room_id,1 as depth FROM dungeon_rooms WHERE id=1 UNION ALL SELECT r.id,r.name,r.next_room_id, p.depth+1 FROM dungeon_rooms r JOIN path p ON r.id=p.next_room_id) SELECT name,depth FROM path.',
      concepts: ['Recursive CTE', 'WITH RECURSIVE', 'Graph traversal'],
      xp: 240,
      mode: 'dungeon',
      schema: `
        CREATE TABLE dungeon_rooms (
          id INTEGER PRIMARY KEY,
          name TEXT,
          floor_number INTEGER,
          next_room_id INTEGER
        );`,
      seed: `
        INSERT INTO dungeon_rooms VALUES (1,'Dungeon Entrance',1,2);
        INSERT INTO dungeon_rooms VALUES (2,'Goblin Warren',1,3);
        INSERT INTO dungeon_rooms VALUES (3,'Skeleton Crypt',2,4);
        INSERT INTO dungeon_rooms VALUES (4,'Troll Bridge',3,5);
        INSERT INTO dungeon_rooms VALUES (5,'Dark Knight Hall',4,6);
        INSERT INTO dungeon_rooms VALUES (6,'Lich Tower',6,7);
        INSERT INTO dungeon_rooms VALUES (7,'Shadow Wyrm Lair',7,NULL);`,
      solutionQuery: `
        WITH RECURSIVE path AS (
          SELECT id, name, floor_number, next_room_id, 1 as depth
          FROM dungeon_rooms WHERE id = 1
          UNION ALL
          SELECT r.id, r.name, r.floor_number, r.next_room_id, p.depth + 1
          FROM dungeon_rooms r
          JOIN path p ON r.id = p.next_room_id
        )
        SELECT name, floor_number, depth FROM path ORDER BY depth;`,
      validate: (rows) => rows.length === 7 && rows[rows.length-1].name === 'Shadow Wyrm Lair',
      expectedNote: '7 rooms from Entrance to Shadow Wyrm Lair'
    }
  ]
};
