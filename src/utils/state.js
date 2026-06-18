// src/utils/state.js

const RANKS = ["E", "D", "C", "B", "A", "S", "National Rank", "Shadow Monarch"];

// Default quote examples
export const DEFAULT_QUOTES = [
  "Arise.",
  "No matter how hard or impossible it is, never lose sight of your goal.",
  "I will protect what is mine, even if it means destroying everything else.",
  "System Notification: You have survived the penalty zone."
];

// Helper to get YYYY-MM-DD from Date object
export function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get the Monday of the week for a given date
export function getMondayOfDate(d) {
  const date = new Date(d);
  const day = date.getDay();
  // Adjust when day is Sunday (0) to get previous Monday
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

// Get the week identifier (YYYY-MM-DD of Monday)
export function getWeekId(d = new Date()) {
  return getLocalDateString(getMondayOfDate(d));
}

// Initial state creator
function getInitialState() {
  const todayStr = getLocalDateString();
  const yesterdayObj = new Date();
  yesterdayObj.setDate(yesterdayObj.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterdayObj);
  const tomorrowObj = new Date();
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrowStr = getLocalDateString(tomorrowObj);

  return {
    hunterData: {
      name: "Sung Jin-woo",
      level: 1,
      xp: 0,
      rankIndex: 0, // Rank E
      rankProgress: 0, // 0 - 100%
      title: "None",
      hp: 100,
      maxHp: 100,
      quote: "Arise.",
      goldSpend: 0
    },
    dailyTasks: [
      {
        id: "d-starter-1",
        text: "Daily Quest: 100 Push-ups, 100 Sit-ups, 100 Squats, 10km Run",
        category: "strength",
        dueDate: todayStr,
        completed: false,
        exp: 25,
        processedMissed: false
      },
      {
        id: "d-starter-2",
        text: "Analyze code patterns & study layout guidelines",
        category: "skills",
        dueDate: yesterdayStr,
        completed: true,
        exp: 15,
        processedMissed: false
      },
      {
        id: "d-starter-3",
        text: "Read 10 pages of book for mental capacity",
        category: "willpower",
        dueDate: todayStr,
        completed: false,
        exp: 10,
        processedMissed: false
      }
    ],
    weeklyTasks: [
      { id: "w-starter-1", text: "Workout Routine", category: "strength", exp: 10 },
      { id: "w-starter-2", text: "Read 10 Pages of Book", category: "willpower", exp: 10 },
      { id: "w-starter-3", text: "Study Coding / Logic", category: "skills", exp: 15 },
      { id: "w-starter-4", text: "Meditation & Mind Control", category: "willpower", exp: 10 }
    ],
    weeklyGrid: {}, // weekId -> taskId -> dayName -> "completed" | "missed" | "incomplete"
    damageHistory: [],
    dungeonLocked: false,
    lastActiveDate: todayStr,
    templates: [
      { id: "t-starter-1", text: "Daily Workout (100 Reps)", category: "strength", exp: 10 },
      { id: "t-starter-2", text: "Study Coding (1 Hour)", category: "skills", exp: 15 },
      { id: "t-starter-3", text: "Read 10 Pages of Book", category: "willpower", exp: 10 },
      { id: "t-starter-4", text: "Meditation & Mindfulness", category: "willpower", exp: 10 }
    ]
  };
}

let cachedState = null;

// Load state from localStorage
export function loadState() {
  if (typeof window === 'undefined') {
    return getInitialState();
  }

  if (cachedState) return cachedState;

  try {
    const raw = localStorage.getItem('sl_upgrade_state');
    if (raw) {
      cachedState = JSON.parse(raw);
      // Migrate older structure if necessary
      if (!cachedState.hunterData) {
        cachedState = getInitialState();
        saveState(cachedState);
      }
      // Migrate missing templates array
      if (!cachedState.templates) {
        cachedState.templates = getInitialState().templates || [];
        saveState(cachedState);
      }
      // Migrate missing dungeonLocked
      if (cachedState.dungeonLocked === undefined) {
        cachedState.dungeonLocked = false;
        saveState(cachedState);
      }
    } else {
      cachedState = getInitialState();
      saveState(cachedState);
    }
  } catch (e) {
    console.error("Failed to load local storage state", e);
    cachedState = getInitialState();
  }

  // Run day transition checks immediately on load
  processPastUncompletedTasks(cachedState);

  return cachedState;
}

// Save state to localStorage
export function saveState(stateObj = cachedState) {
  if (typeof window === 'undefined' || !stateObj) return;
  cachedState = stateObj;
  try {
    localStorage.setItem('sl_upgrade_state', JSON.stringify(stateObj));
  } catch (e) {
    console.error("Failed to save state to localStorage", e);
  }
}

// Reset state
export function resetState() {
  cachedState = getInitialState();
  saveState(cachedState);
  return cachedState;
}

// Calculate Title dynamically based on achievements / rank
export function getHunterTitle(stateObj) {
  const analytics = getAnalytics(stateObj);
  const achievements = getAchievements(stateObj);

  if (achievements.some(a => a.id === "shadow-monarch")) {
    return "Shadow Monarch";
  }
  if (achievements.some(a => a.id === "streak-7")) {
    return "Streak Master";
  }
  if (achievements.some(a => a.id === "tasks-100")) {
    return "Demon Slayer";
  }
  if (analytics.completedTasks >= 20) {
    return "Dungeon Explorer";
  }
  if (stateObj.hunterData.level > 1) {
    return "Novice Raider";
  }
  return "None";
}

// Calculate level and stat caps
export function checkLevelUp(hunterData) {
  let levelledUp = false;
  // Level Formula: 100 XP per level
  while (hunterData.xp >= 100) {
    hunterData.xp -= 100;
    hunterData.level += 1;
    hunterData.maxHp = hunterData.level * 100;
    hunterData.hp = hunterData.maxHp; // Heal to full on level up
    levelledUp = true;
  }
  return levelledUp;
}

// HP Damage bounds and exhaustion handling
export function applyDamage(stateObj, amount, reason = "Failed task penalty") {
  const hunter = stateObj.hunterData;
  hunter.hp = Math.max(0, hunter.hp - amount);

  // Log to damage history
  stateObj.damageHistory.unshift({
    id: "dmg-" + Date.now() + "-" + Math.random(),
    taskText: reason,
    hpLost: amount,
    date: getLocalDateString(),
    timestamp: Date.now()
  });

  // Keep damage history within reasonable limit (e.g. 50 items)
  if (stateObj.damageHistory.length > 50) {
    stateObj.damageHistory.pop();
  }

  // Handle exhaustion collapse (HP reaches 0)
  if (hunter.hp <= 0) {
    hunter.hp = Math.floor(hunter.maxHp * 0.5); // Reset to 50% HP
    hunter.rankProgress = Math.max(0, hunter.rankProgress - 30); // 30% progress penalty

    stateObj.damageHistory.unshift({
      id: "dmg-collapse-" + Date.now(),
      taskText: "SYSTEM OVERLOAD: Hunter collapsed from exhaustion! Rank Progress penalized.",
      hpLost: 0,
      date: getLocalDateString(),
      timestamp: Date.now()
    });

    // Check rank down if progress went below 0
    checkRankDown(hunter);
  }
}

// Heal HP (up to max HP)
export function healHP(hunterData, amount) {
  hunterData.hp = Math.min(hunterData.maxHp, hunterData.hp + amount);
}

// Add rank progress (+5% per completion)
export function addRankProgress(hunterData, amount = 5) {
  if (hunterData.rankIndex >= RANKS.length - 1 && RANKS[hunterData.rankIndex] === "Shadow Monarch") {
    // Cap progress at 100% for top rank
    hunterData.rankProgress = 100;
    return;
  }

  hunterData.rankProgress += amount;
  if (hunterData.rankProgress >= 100) {
    hunterData.rankIndex = Math.min(RANKS.length - 1, hunterData.rankIndex + 1);
    hunterData.rankProgress = 0; // Reset progress on rank up
  }
}

// Decrease rank progress (penalties)
export function removeRankProgress(hunterData, amount = 10) {
  hunterData.rankProgress -= amount;
  checkRankDown(hunterData);
}

function checkRankDown(hunterData) {
  if (hunterData.rankProgress < 0) {
    if (hunterData.rankIndex > 0) {
      hunterData.rankIndex -= 1;
      hunterData.rankProgress = 80; // Reset to 80% on demotion
    } else {
      hunterData.rankProgress = 0; // Cap at 0% for Rank E
    }
  }
}

// Get the category damage values
export function getCategoryDamage(category) {
  const map = {
    strength: 10,
    skills: 20,
    intelligence: 15,
    willpower: 5,
    charisma: 5
  };
  return map[category] || 5;
}

// Core date logic to transition days and process penalties
export function processPastUncompletedTasks(stateObj) {
  const todayStr = getLocalDateString();
  const lastActive = stateObj.lastActiveDate || todayStr;

  if (lastActive < todayStr) {
    // A transition occurred! Process past incomplete daily tasks
    stateObj.dailyTasks.forEach(task => {
      // If task due date is before today, incomplete, and not yet processed as missed
      if (task.dueDate < todayStr && !task.completed && !task.processedMissed) {
        task.processedMissed = true;
        
        // Apply penalties
        const damageVal = getCategoryDamage(task.category);
        applyDamage(stateObj, damageVal, `Missed Daily Quest: ${task.text}`);
        removeRankProgress(stateObj.hunterData, 10);
      }
    });

    // Update last active date to today
    stateObj.lastActiveDate = todayStr;
    saveState(stateObj);
  }
}

// ==========================================
// DAILY TASKS MUTATORS
// ==========================================

export function addDailyTask(text, category, exp, dueDate = getLocalDateString()) {
  const stateObj = loadState();
  const newTask = {
    id: "d-task-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
    text,
    category,
    dueDate,
    completed: false,
    exp: parseInt(exp) || 10,
    processedMissed: false
  };

  stateObj.dailyTasks.push(newTask);
  saveState(stateObj);
  return newTask;
}

export function toggleDailyTask(id) {
  const stateObj = loadState();
  const task = stateObj.dailyTasks.find(t => t.id === id);
  if (!task) return;

  task.completed = !task.completed;

  // Apply progression changes
  if (task.completed) {
    stateObj.hunterData.xp += task.exp;
    addRankProgress(stateObj.hunterData, 5);
    healHP(stateObj.hunterData, 5);
    checkLevelUp(stateObj.hunterData);
  } else {
    // Revert completions
    stateObj.hunterData.xp = Math.max(0, stateObj.hunterData.xp - task.exp);
    removeRankProgress(stateObj.hunterData, 5);
    // Note: We don't take away HP here, but we also don't heal.
  }

  // Update Hunter dynamic title
  stateObj.hunterData.title = getHunterTitle(stateObj);

  saveState(stateObj);
  return task;
}

export function deleteDailyTask(id) {
  const stateObj = loadState();
  stateObj.dailyTasks = stateObj.dailyTasks.filter(t => t.id !== id);
  saveState(stateObj);
}

export function editDailyTask(id, text, category, exp) {
  const stateObj = loadState();
  const task = stateObj.dailyTasks.find(t => t.id === id);
  if (!task) return;

  task.text = text;
  task.category = category;
  task.exp = parseInt(exp) || 10;

  saveState(stateObj);
  return task;
}

// ==========================================
// WEEKLY RECURRING TASKS & GRID MUTATORS
// ==========================================

export function addWeeklyTask(text, category, exp) {
  const stateObj = loadState();
  const newTask = {
    id: "w-task-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
    text,
    category,
    exp: parseInt(exp) || 10
  };

  stateObj.weeklyTasks.push(newTask);
  saveState(stateObj);
  return newTask;
}

export function deleteWeeklyTask(id) {
  const stateObj = loadState();
  stateObj.weeklyTasks = stateObj.weeklyTasks.filter(t => t.id !== id);

  // Remove occurrences in weeklyGrid
  Object.keys(stateObj.weeklyGrid).forEach(weekId => {
    if (stateObj.weeklyGrid[weekId][id]) {
      delete stateObj.weeklyGrid[weekId][id];
    }
  });

  saveState(stateObj);
}

export function editWeeklyTask(id, text, category, exp) {
  const stateObj = loadState();
  const task = stateObj.weeklyTasks.find(t => t.id === id);
  if (!task) return;

  task.text = text;
  task.category = category;
  task.exp = parseInt(exp) || 10;

  saveState(stateObj);
  return task;
}

export function moveWeeklyTask(id, direction) {
  const stateObj = loadState();
  const index = stateObj.weeklyTasks.findIndex(t => t.id === id);
  if (index === -1) return;

  if (direction === 'up' && index > 0) {
    const temp = stateObj.weeklyTasks[index];
    stateObj.weeklyTasks[index] = stateObj.weeklyTasks[index - 1];
    stateObj.weeklyTasks[index - 1] = temp;
  } else if (direction === 'down' && index < stateObj.weeklyTasks.length - 1) {
    const temp = stateObj.weeklyTasks[index];
    stateObj.weeklyTasks[index] = stateObj.weeklyTasks[index + 1];
    stateObj.weeklyTasks[index + 1] = temp;
  }

  saveState(stateObj);
}

export function toggleWeeklyCell(weekId, taskId, dayName) {
  const stateObj = loadState();
  const taskObj = stateObj.weeklyTasks.find(t => t.id === taskId);
  if (!taskObj) return;

  if (!stateObj.weeklyGrid[weekId]) {
    stateObj.weeklyGrid[weekId] = {};
  }
  if (!stateObj.weeklyGrid[weekId][taskId]) {
    stateObj.weeklyGrid[weekId][taskId] = {};
  }

  const currentStatus = stateObj.weeklyGrid[weekId][taskId][dayName] || "incomplete";
  let nextStatus = "incomplete";

  if (currentStatus === "incomplete") {
    nextStatus = "completed";
  } else if (currentStatus === "completed") {
    nextStatus = "missed";
  } else {
    nextStatus = "incomplete";
  }

  stateObj.weeklyGrid[weekId][taskId][dayName] = nextStatus;

  // Apply HP/XP/Rank impact
  if (nextStatus === "completed") {
    // incomplete -> completed
    stateObj.hunterData.xp += taskObj.exp;
    addRankProgress(stateObj.hunterData, 5);
    healHP(stateObj.hunterData, 5);
    checkLevelUp(stateObj.hunterData);
  } else if (nextStatus === "missed") {
    // completed -> missed
    // First, revert the completion rewards
    stateObj.hunterData.xp = Math.max(0, stateObj.hunterData.xp - taskObj.exp);
    removeRankProgress(stateObj.hunterData, 5);

    // Apply missed task damage and rank penalty
    const dmg = getCategoryDamage(taskObj.category);
    applyDamage(stateObj, dmg, `Missed Weekly Dungeon task: ${taskObj.text}`);
    removeRankProgress(stateObj.hunterData, 10);
  } else {
    // missed -> incomplete
    // Revert the missed task penalties
    const dmg = getCategoryDamage(taskObj.category);
    stateObj.hunterData.hp = Math.min(stateObj.hunterData.maxHp, stateObj.hunterData.hp + dmg);
    addRankProgress(stateObj.hunterData, 10);
  }

  // Update dynamic title
  stateObj.hunterData.title = getHunterTitle(stateObj);

  saveState(stateObj);
  return nextStatus;
}

// ==========================================
// ANALYTICS & STREAKS CALCULATIONS
// ==========================================

export function getAnalytics(stateObj = loadState()) {
  const dailyTasks = stateObj.dailyTasks;
  const weeklyGrid = stateObj.weeklyGrid;

  let completedTasks = dailyTasks.filter(t => t.completed).length;
  let missedTasks = dailyTasks.filter(t => t.processedMissed).length;

  // Count completions and misses from weeklyGrid
  Object.keys(weeklyGrid).forEach(weekId => {
    Object.keys(weeklyGrid[weekId]).forEach(taskId => {
      Object.keys(weeklyGrid[weekId][taskId]).forEach(dayName => {
        const val = weeklyGrid[weekId][taskId][dayName];
        if (val === "completed") completedTasks++;
        else if (val === "missed") missedTasks++;
      });
    });
  });

  const totalEvaluated = completedTasks + missedTasks;
  const completionRate = totalEvaluated > 0 ? Math.round((completedTasks / totalEvaluated) * 100) : 0;

  // Calculate Streaks based on date completion records
  const completedDatesSet = new Set();
  
  // Daily completed tasks dates
  dailyTasks.forEach(t => {
    if (t.completed) {
      completedDatesSet.add(t.dueDate);
    }
  });

  // Weekly completed grid cells dates
  const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  Object.keys(weeklyGrid).forEach(weekMondayStr => {
    Object.keys(weeklyGrid[weekMondayStr]).forEach(taskId => {
      Object.keys(weeklyGrid[weekMondayStr][taskId]).forEach(dayName => {
        if (weeklyGrid[weekMondayStr][taskId][dayName] === "completed") {
          // Find actual date YYYY-MM-DD
          const mondayDate = new Date(weekMondayStr);
          const dayIndex = daysOrder.indexOf(dayName);
          if (dayIndex !== -1) {
            const cellDate = new Date(mondayDate);
            cellDate.setDate(mondayDate.getDate() + dayIndex);
            completedDatesSet.add(getLocalDateString(cellDate));
          }
        }
      });
    });
  });

  // Parse dates and sort descending
  const sortedDates = Array.from(completedDatesSet).sort((a, b) => b.localeCompare(a));
  
  let currentStreak = 0;
  let longestStreak = 0;

  if (sortedDates.length > 0) {
    const todayStr = getLocalDateString();
    const yesterdayObj = new Date();
    yesterdayObj.setDate(yesterdayObj.getDate() - 1);
    const yesterdayStr = getLocalDateString(yesterdayObj);

    // If today or yesterday is completed, start current streak calculation
    if (sortedDates[0] === todayStr || sortedDates[0] === yesterdayStr) {
      currentStreak = 1;
      let prevDate = new Date(sortedDates[0]);

      for (let i = 1; i < sortedDates.length; i++) {
        const currDate = new Date(sortedDates[i]);
        const diffTime = Math.abs(prevDate - currDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          currentStreak++;
          prevDate = currDate;
        } else if (diffDays === 0) {
          // Same day, continue
        } else {
          break;
        }
      }
    }

    // Longest streak calculation
    let tempStreak = 1;
    let prevDate = new Date(sortedDates[sortedDates.length - 1]);

    for (let i = sortedDates.length - 2; i >= 0; i--) {
      const currDate = new Date(sortedDates[i]);
      const diffTime = Math.abs(currDate - prevDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        tempStreak = 1;
      }
      prevDate = currDate;
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
  }

  // Fallback: longest streak must be at least current streak
  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  return {
    completionRate,
    currentStreak,
    longestStreak,
    completedTasks,
    missedTasks
  };
}

// ==========================================
// ACHIEVEMENTS SYSTEM
// ==========================================

export function getAchievements(stateObj = loadState()) {
  const achievementsList = [
    {
      id: "streak-7",
      title: "7 Day Streak",
      icon: "🏆",
      description: "Maintained a 7-day training streak.",
      check: (state, analytics) => analytics.longestStreak >= 7
    },
    {
      id: "lvl-up",
      title: "First Level Up",
      icon: "🏆",
      description: "Successfully advanced your level beyond level 1.",
      check: (state) => state.hunterData.level > 1
    },
    {
      id: "tasks-100",
      title: "100 Tasks Completed",
      icon: "🏆",
      description: "Cleared 100 quest log objectives.",
      check: (state, analytics) => analytics.completedTasks >= 100
    },
    {
      id: "shadow-monarch",
      title: "Shadow Monarch",
      icon: "👑",
      description: "Attained Level 20 or reached the pinnacle rank.",
      check: (state) => state.hunterData.level >= 20 || RANKS[state.hunterData.rankIndex] === "Shadow Monarch"
    },
    {
      id: "survivor",
      title: "Survivor of Death",
      icon: "💀",
      description: "Survived HP dropping below 20%.",
      check: (state) => {
        // Did the hunter take damage and drop low, or did HP reach critical?
        // True if current HP is below 20% of max HP
        return state.hunterData.hp > 0 && state.hunterData.hp <= (state.hunterData.maxHp * 0.2);
      }
    }
  ];

  const analytics = getAnalytics(stateObj);
  
  // Filter for unlocked achievements
  return achievementsList.filter(ach => ach.check(stateObj, analytics));
}

// ==========================================
// GIT HEATMAP DATA GENERATION
// ==========================================

export function getHeatmapData(stateObj = loadState()) {
  const mapData = {}; // YYYY-MM-DD -> { count, xp }

  // Daily Tasks
  stateObj.dailyTasks.forEach(t => {
    if (t.completed) {
      if (!mapData[t.dueDate]) {
        mapData[t.dueDate] = { count: 0, xp: 0 };
      }
      mapData[t.dueDate].count += 1;
      mapData[t.dueDate].xp += t.exp;
    }
  });

  // Weekly Grid Cells
  const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  Object.keys(stateObj.weeklyGrid).forEach(weekMondayStr => {
    Object.keys(stateObj.weeklyGrid[weekMondayStr]).forEach(taskId => {
      const taskObj = stateObj.weeklyTasks.find(t => t.id === taskId);
      const exp = taskObj ? taskObj.exp : 10;

      Object.keys(stateObj.weeklyGrid[weekMondayStr][taskId]).forEach(dayName => {
        if (stateObj.weeklyGrid[weekMondayStr][taskId][dayName] === "completed") {
          // Calculate actual date
          const mondayDate = new Date(weekMondayStr);
          const dayIndex = daysOrder.indexOf(dayName);
          if (dayIndex !== -1) {
            const cellDate = new Date(mondayDate);
            cellDate.setDate(mondayDate.getDate() + dayIndex);
            const dateStr = getLocalDateString(cellDate);
            
            if (!mapData[dateStr]) {
              mapData[dateStr] = { count: 0, xp: 0 };
            }
            mapData[dateStr].count += 1;
            mapData[dateStr].xp += exp;
          }
        }
      });
    });
  });

  return mapData;
}

// Helper to get Rank Name from Index
export function getRankName(index) {
  return RANKS[index] || "E";
}

// Helper to get all rank labels
export function getRanksList() {
  return RANKS;
}
