# Weekly Dungeon Page Specification

## Layout Overview

| Section | Position | Purpose |
|----------|----------|----------|
| Task List | Left Side | Contains recurring weekly tasks |
| Add Task Button | Below Task List | Creates new recurring task |
| Weekly Grid | Center/Right | Tracks task completion |
| Completion Row | Bottom | Daily completion percentage |
| Daily Rank Row | Bottom | Daily performance rank |

---

# Task List

| Property | Description |
|------------|------------|
| Purpose | Store recurring weekly tasks |
| Position | Left Side |
| Editable | Yes |
| Stores | Task Names |
| Actions | Add / Edit / Delete |

### Example Tasks

- Workout
- Study Coding
- Read Book
- Meditation

### Rules

Tasks created here automatically appear for:

- Monday
- Tuesday
- Wednesday
- Thursday
- Friday
- Saturday
- Sunday

---

# Add Task Button

| Property | Description |
|------------|------------|
| Purpose | Create recurring task |
| Position | Bottom of Task List |
| Editable | Yes |
| Stores | New Weekly Task |
| Actions | Add Task |

### Behaviour

When clicked:

1. Enter task name

2. Save task

3. Generate task row

4. Populate entire week

---

# Weekly Grid

| Property | Description |
|------------|------------|
| Purpose | Track task completion |
| Position | Main Content Area |
| Editable | Yes |
| Stores | Completion Status |
| Actions | Toggle Complete / Missed |

### Columns

- Monday
- Tuesday
- Wednesday
- Thursday
- Friday
- Saturday
- Sunday

### Cell States

| Symbol | Meaning |
|----------|----------|
| ✓ | Completed |
| ✗ | Missed |

### Behaviour

User clicks cell:

Incomplete → Complete

Complete → Missed

---

# Completion Row

| Property | Description |
|------------|------------|
| Purpose | Daily completion calculation |
| Position | Bottom Row |
| Editable | No |
| Stores | Completion Percentage |
| Actions | View only |

### Formula

Completion %

=

Completed Tasks

÷

Total Tasks

×

100

### Example

| Day | Completion |
|------|------|
| Monday | 49% |
| Tuesday | 40% |
| Wednesday | 79% |
| Thursday | 86% |
| Friday | 95% |

---

# Daily Rank Row

| Property | Description |
|------------|------------|
| Purpose | Daily performance grading |
| Position | Lowest Row |
| Editable | No |
| Stores | Daily Rank |
| Actions | View only |

### Rank Rules

| Completion % | Rank |
|--------------|------|
| 90-100 | S |
| 80-89 | A |
| 70-79 | B |
| 60-69 | C |
| 40-59 | D |
| 0-39 | E |

### Example

| Day | Rank |
|------|------|
| Monday | D |
| Tuesday | E |
| Wednesday | B |
| Thursday | A |
| Friday | S |

---

# Damage System

| Property | Description |
|------------|------------|
| Purpose | Penalize missed tasks |
| Trigger | Task Missed |
| Result | HP Loss |

### Example

Workout Missed

-10 HP

Study Coding Missed

-20 HP

Read Book Missed

-5 HP

### Rules

Every missed task applies damage automatically.

Damage contributes to overall performance tracking.

---

# Weekly Dungeon Goal

The Weekly Dungeon exists to measure consistency.

The objective is:

- Complete tasks
- Maximize completion %
- Achieve S Rank days
- Avoid damage penalties
- Build streaks