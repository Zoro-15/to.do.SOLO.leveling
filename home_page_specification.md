# Home Page Specification

## Layout Overview

| Section | Position | Purpose |
|----------|----------|----------|
| Hunter Info | Top Left | Displays hunter information and progression |
| Rank System | Bottom Left | Shows current rank and rank progression |
| Achievement Tags | Top Center | Quick display of unlocked achievements |
| Experience Bar | Center | Displays current XP progress |
| Weekly Dungeon Preview | Center Bottom | Preview of weekly dungeon page |
| Git Heatmap | Top Right | Visual activity tracker |
| Analytics | Right Center | User performance statistics |
| Quote Box | Bottom Left | Editable motivation quote |
| Task Selection For Day | Bottom Right | Daily task assignment |

---

# Hunter Info

| Property | Description |
|------------|------------|
| Purpose | Display current hunter information |
| Position | Upper Left |
| Editable | No |
| Stores | Name, Level, Title |
| Actions | View only |

### Displays

- Hunter Name
- Current Level
- Current Title
- Current XP

Example

Shadow Monarch

Level 12

Title: Dungeon Explorer

---

# Rank System

| Property | Description |
|------------|------------|
| Purpose | Display rank progression |
| Position | Lower Left |
| Editable | No |
| Stores | Current Rank, Rank Progress |
| Actions | View only |

### Rank Order

- E
- D
- C
- B
- A
- S
- National Rank
- Shadow Monarch

### Displays

Current Rank

Rank Progress %

---

# Achievement Tags

| Property | Description |
|------------|------------|
| Purpose | Show unlocked achievements |
| Position | Top Center |
| Editable | No |
| Stores | Achievement Name |
| Actions | Hover / View |

### Examples

🏆 7 Day Streak

🏆 First Level Up

🏆 100 Tasks Completed

---

# Experience Bar

| Property | Description |
|------------|------------|
| Purpose | Show level progress |
| Position | Center |
| Editable | No |
| Stores | Current XP, Required XP |
| Actions | View only |

### Displays

Current XP

XP Needed For Next Level

Progress Percentage

---

# Weekly Dungeon Preview

| Property | Description |
|------------|------------|
| Purpose | Preview weekly progress |
| Position | Center Bottom |
| Editable | No |
| Stores | Weekly Completion %, Weekly Rank |
| Actions | Click to open Weekly Dungeon Page |

### Displays

Current Week Completion

Current Week Rank

---

# Git Heatmap

| Property | Description |
|------------|------------|
| Purpose | Visual consistency tracker |
| Position | Top Right |
| Editable | No |
| Stores | Daily Activity Values |
| Actions | Hover to inspect dates |

### Displays

Activity Heatmap

Daily Contribution Intensity

---

# Analytics

| Property | Description |
|------------|------------|
| Purpose | Performance overview |
| Position | Right Side |
| Editable | No |
| Stores | Statistics |
| Actions | View only |

### Displays

- Current Streak
- Longest Streak
- Completed Tasks
- Missed Tasks
- Completion Rate %

---

# Quote Box

| Property | Description |
|------------|------------|
| Purpose | Motivation area |
| Position | Bottom Left |
| Editable | Yes |
| Stores | Quote Text |
| Actions | Edit Quote |

### Example

"Arise."

---

# Task Selection For Day

| Property | Description |
|------------|------------|
| Purpose | Assign tasks for specific day |
| Position | Bottom Right |
| Editable | Yes |
| Stores | Daily Tasks |
| Actions | Add / Edit / Remove |

### Rules

Tasks created here:

✓ Only exist for selected day

✓ Do not repeat weekly

### Available Actions

- Add Task
- Edit Task
- Remove Task