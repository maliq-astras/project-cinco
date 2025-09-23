# 🔴 RED-003: No Single Source of Truth for Daily Resets

**Classification**: SOLVED ✅
**Severity**: CRITICAL
**Discovery Date**: 2025-09-20
**Resolution Date**: 2025-09-23
**Status**: RESOLVED

---

## 📋 Executive Summary

**RESOLVED**: The application now has a **CENTRALIZED DAILY RESET SYSTEM** through `dailyResetManager.ts`. The multiple independent systems that previously caused chaos have been eliminated or consolidated. The system now uses consistent timezone calculations and atomic state updates.

**Resolution Impact**: Users now experience consistent daily transitions with preserved user data (streaks, preferences) and proper game state resets. Random timing issues have been eliminated through centralized coordination.

---

## 🔍 Root Cause Analysis

### The Fragmented Reset Architecture

The app has **5 INDEPENDENT SYSTEMS** that each handle "daily reset" logic:

1. **Zustand Persist Hydration Reset** (gameStore.ts:99)
2. **Streak System Reset** (streakSlice.ts:141-176)
3. **Game Data Staleness Reset** (localStorage.ts:65-124)
4. **Challenge Fetch Reset** (coreGameSlice.ts:92-96)
5. **Today Game Data Reset** (streakSlice.ts:149-152)

**The Problem**: Each system triggers independently, at different times, using different timezone logic, creating chaos during daily transitions.

---

## 🔬 Technical Evidence

### 1. Multiple Independent Reset Triggers

**System 1: Zustand Hydration Reset**
```typescript
// gameStore.ts:99 - Triggers on every app load
if (state.hydrated) {
  // CRITICAL: Clear stale game data BEFORE hydration
  clearStaleGameData();
}
```
**Trigger**: Every time user opens app
**Logic**: Calls `clearStaleGameData()` if `isGameDataCurrent()` returns false

**System 2: Streak Missed Days Reset**
```typescript
// streakSlice.ts:141 - Called from multiple locations
updateMissedDays: () => {
  const today = getEasternDateString();
  const { weeklyCompletions, currentStreak, todayGameData } = get();

  // Clear today's game data if it's from a previous day
  if (todayGameData && todayGameData.completionDate !== today) {
    get().clearTodayGameData();
  }

  // Mark missed days and reset streaks
  // ...complex logic...
}
```
**Trigger**: Called from `updateStreak()`, `trackFailedAttempt()`, `fetchChallenge()`, and UI components
**Logic**: Uses broken Eastern Time functions to determine "today"

**System 3: Game Data Staleness Reset**
```typescript
// localStorage.ts:65-124 - Complex migration system
export const clearStaleGameData = (): void => {
  if (!isGameDataCurrent()) {
    // 60+ lines of data migration logic
    // Clears everything, preserves some data, reconstructs storage
  }
}
```
**Trigger**: Called during hydration and potentially other locations
**Logic**: Uses `getEasternDateString()` to check staleness

**System 4: Challenge Fetch Reset**
```typescript
// coreGameSlice.ts:92-96 - Part of challenge loading
fetchChallenge: async (language: string = 'en') => {
  // Update missed days and clear stale data before checking if user has played today
  get().updateMissedDays();

  // Check if user has already played today
  const hasPlayedToday = get().hasPlayedToday();
}
```
**Trigger**: When loading challenges (app start, language change)
**Logic**: Calls other reset systems, then checks play status

**System 5: Today Game Data Reset**
```typescript
// streakSlice.ts:149-152 - Part of missed days logic
if (todayGameData && todayGameData.completionDate !== today) {
  get().clearTodayGameData();
}
```
**Trigger**: Called as part of `updateMissedDays()`
**Logic**: Clears today's game data if dates don't match

### 2. Cascading Reset Dependencies

**Reset Chain Reaction**:
```
App Load → Zustand Hydration → clearStaleGameData()
    ↓
fetchChallenge() → updateMissedDays() → clearTodayGameData()
    ↓
hasPlayedToday() → Check multiple data sources
    ↓
Potential data conflicts and race conditions
```

**Multiple Call Patterns**:
- `updateMissedDays()` called from:
  - `updateStreak()` (streakSlice.ts:36)
  - `trackFailedAttempt()` (streakSlice.ts:116)
  - `fetchChallenge()` (coreGameSlice.ts:93)
  - UI components (useStreakDisplayLogic.ts:46)

**Result**: Same reset logic runs multiple times with different timing and contexts.

### 3. Conflicting Timezone Logic

**Different Reset Triggers Use Different Timezones**:

| System | Timezone Used | Function | Issues |
|--------|---------------|----------|--------|
| clearStaleGameData | `getEasternDateString()` | Broken Eastern Time | Double conversion bug |
| updateMissedDays | `getEasternDateString()` | Broken Eastern Time | Double conversion bug |
| clearTodayGameData | Compares with `today` | Broken Eastern Time | Inconsistent dates |
| saveTodayGameData | `new Date().toISOString()` | **Local timezone!** | Different from others |
| hasPlayedToday | `getEasternDateString()` | Broken Eastern Time | Broken comparison |

**Evidence of Timezone Conflicts**:
```typescript
// coreGameSlice.ts:489 - Uses LOCAL timezone
const today = new Date().toISOString().split('T')[0];

// streakSlice.ts:143 - Uses broken EASTERN timezone
const today = getEasternDateString();

// These NEVER match during timezone transitions!
```

### 4. Race Conditions During Reset Windows

**Race Condition Example**:
1. User opens app at 11:59 PM Eastern
2. `clearStaleGameData()` runs, determines day is current
3. User stays on app until 12:01 AM Eastern
4. `updateMissedDays()` runs with broken timezone calc
5. Different systems now disagree about what "today" is
6. **Result**: Partial reset, corrupted state

**Multi-Tab Race Conditions**:
1. User has two tabs open
2. Midnight transition occurs
3. Both tabs trigger reset logic simultaneously
4. Each tab reads/writes localStorage at same time
5. **Result**: Data corruption, lost progress

---

## 🌍 Real-World Impact Analysis

### User Experience Failures

**Scenario 1: Midnight Transition Chaos**
- **11:58 PM EST**: User opens app, `clearStaleGameData()` says current day
- **12:01 AM EST**: User makes a guess, `updateMissedDays()` triggers
- **Broken timezone functions** calculate different "today" values
- **Result**: Streak reset, progress lost, user sees errors

**Scenario 2: Multiple Reset Calls**
- User opens app, `fetchChallenge()` calls `updateMissedDays()`
- User views streak display, UI component calls `updateMissedDays()` again
- Each call uses broken timezone math
- **Result**: Different results from same function, state corruption

**Scenario 3: Partial Reset State**
- `clearStaleGameData()` clears some data
- `clearTodayGameData()` clears different data
- App now in hybrid state with some old, some new data
- **Result**: App confusion about whether user has played today

### Development Impact

**Debugging Nightmare**:
- Reset logic scattered across 5 different files
- Each system uses different timezone calculations
- No central logging or coordination
- Race conditions difficult to reproduce

**Evidence of Ongoing Issues**:
```typescript
// From clearStaleGameData() - debugging statements suggest active problems
console.log('🗑️ CLEARING STALE GAME DATA - New day detected');
console.log('🧹 CLEARING ALL GAME DATA');
console.log('♻️ RESTORING PRESERVED USER DATA');
```

**Complex Recovery Logic**:
```typescript
// coreGameSlice.ts:522-602 - 80+ lines trying to recover from corrupted state
// DEBUG: Log the state for analysis
console.log('🔍 STATE RECOVERY DEBUG:', {
  revealsCount,
  allGuessesCount,
  wrongGuessesCount,
  hasInconsistentState
});
```

---

## 📊 Complete System Mapping

### Reset System Interactions

**Primary Reset Functions**:
1. `clearStaleGameData()` - Nuclear reset of all data
2. `updateMissedDays()` - Streak-specific reset logic
3. `clearTodayGameData()` - Game completion data reset
4. `hasPlayedToday()` - Completion status check
5. `isGameDataCurrent()` - Staleness detection

**Call Hierarchy**:
```
App Hydration
├── clearStaleGameData()
│   ├── isGameDataCurrent()
│   └── Complex data migration
│
Challenge Fetch
├── updateMissedDays()
│   ├── clearTodayGameData()
│   └── Streak reset logic
├── hasPlayedToday()
│   └── Multiple data source checks
│
UI Component Mounts
├── updateMissedDays() (again)
└── Display calculations
```

### Data Dependencies

**Reset Systems Affect These Data Sources**:
- `cinco-game-storage` (Zustand persist)
- `factfive_game_state` (manual localStorage)
- `factfive_streak_data` (manual localStorage)
- `factfive_last_challenge_date` (manual localStorage)
- `factfive_timer_data` (manual localStorage)

**Cross-System Dependencies**:
- Streak system depends on game completion data
- Game system depends on streak calculations
- Both depend on challenge fetch results
- All depend on timezone utilities

---

## 🚨 Critical Breaking Points

### Timing-Based Failures

1. **Midnight Boundary Crossings**: Reset logic fails during timezone transitions
2. **Multiple App Instances**: Race conditions when multiple tabs/windows open
3. **Slow Network/Processing**: Long-running operations cross midnight boundary
4. **Page Refresh During Reset**: Partial state corruption

### State Consistency Failures

1. **Mixed Reset States**: Some systems reset, others don't
2. **Timezone Calculation Drift**: Different systems calculate different "today"
3. **Data Migration Conflicts**: Reset systems interfere with each other
4. **Recovery Loop Issues**: Reset logic triggers more reset logic

### User Action Conflicts

1. **User Action During Reset**: User interacts while reset is processing
2. **Language Change Reset**: Language switching triggers additional resets
3. **Component Mount Reset**: UI components trigger reset logic independently

---

## 🔧 Current Reset Trigger Analysis

### When Reset Logic Executes

**App Load/Hydration**:
- `clearStaleGameData()` - Always
- `fetchChallenge()` → `updateMissedDays()` - Always
- `loadGameData()` - If data exists

**User Actions**:
- Guess submission → `updateStreak()` → `updateMissedDays()`
- Failed attempt → `trackFailedAttempt()` → `updateMissedDays()`
- Language change → `fetchChallenge()` → `updateMissedDays()`

**Component Lifecycle**:
- Streak display mount → `updateMissedDays()`
- Various UI components → Multiple reset checks

**Time-Based**:
- No automatic time-based resets
- All resets are action-triggered with timezone checks

### Reset Decision Logic

**Current Staleness Detection**:
```typescript
export const isGameDataCurrent = (): boolean => {
  const storedDate = storage.get(STORAGE_KEYS.LAST_CHALLENGE_DATE, '');
  const currentDate = getEasternDateString(); // BROKEN timezone function
  return storedDate === currentDate;
};
```

**Problems**:
- Uses broken `getEasternDateString()` function
- Simple string comparison vulnerable to timezone bugs
- No validation of date format or validity
- No handling of timezone transition edge cases

---

## 🎯 Solution Architecture Requirements

### Fundamental Decisions Needed

**Option 1: Centralized Reset Manager**
- Single function that coordinates all reset operations
- Atomic reset transaction that updates all systems
- Single timezone calculation used by all systems

**Option 2: Event-Based Reset System**
- Reset events triggered by single source of truth
- All systems subscribe to reset events
- Coordinated state updates

**Option 3: Lazy Reset Pattern**
- No proactive reset logic
- Each system checks freshness when accessed
- Consistent timestamp comparison strategy

### Implementation Scope

**Complete architectural redesign required**:

1. **Single Reset Coordinator** - One function that orchestrates all reset logic
2. **Fix Timezone Calculations** - Consistent timezone strategy across all systems
3. **Atomic State Updates** - Either all systems reset or none do
4. **Remove Duplicate Logic** - Eliminate multiple independent reset systems
5. **Centralized Reset Logging** - Single source of truth for reset events
6. **Race Condition Prevention** - Locking mechanism for reset operations

---

## 🔍 Evidence Summary

### Smoking Gun Evidence

1. **5 Independent Reset Systems**: Each with its own logic and timing
2. **Mixed Timezone Calculations**: Some use Eastern, some use local time
3. **Multiple Reset Triggers**: Same function called from different contexts
4. **Complex Recovery Logic**: 80+ lines trying to fix corrupted state
5. **Debug Console Logs**: Evidence of ongoing reset-related problems

### User Impact Evidence

- Complex state recovery in `coreGameSlice.ts` suggests frequent corruption
- Multiple "inconsistent state" checks indicate reliability problems
- Console logging suggests developers actively debugging reset issues
- Race condition potential during midnight transitions

### Architecture Evidence

- No central reset coordination
- Reset logic scattered across multiple files
- Dependencies between reset systems create cascading failures
- Mixed persistence systems compound the coordination problem

---

## 📝 Risk Assessment

**Immediate Risks**:
- **High**: Data corruption during daily transitions
- **High**: Random progress loss during normal use
- **Medium**: Race conditions with multiple app instances
- **Medium**: Performance impact from excessive reset calls

**Long-term Risks**:
- **High**: Cannot reliably handle timezone edge cases
- **High**: Reset logic becomes increasingly complex and brittle
- **Medium**: User trust erosion from unpredictable behavior
- **Low**: Security risks (minimal, primarily availability issues)

### Business Impact

**User Experience**:
- Random progress loss causes user abandonment
- Unpredictable reset behavior frustrates users
- Broken streaks eliminate primary engagement mechanic

**Development Velocity**:
- Debugging reset issues consumes significant development time
- Adding new features requires understanding complex reset interactions
- State corruption bugs are difficult to reproduce and fix

---

## 📋 Dependencies and Connections

### Relationship to Other Issues

**RED-001 (Timezone Architecture)**:
- Reset systems depend on broken timezone functions
- Cannot fix reset coordination without fixing timezone calculations

**RED-002 (Dual Persistence)**:
- Reset systems must coordinate between Zustand and manual localStorage
- Data migration complexity stems from dual system coordination

**Combined Effect**: All three RED issues interact to create system-wide instability during daily transitions.

---

## 🔧 Solution Strategy Requirements

### Pre-Requisites

1. **Fix timezone architecture** (RED-001) - Reset systems need reliable date calculations
2. **Choose single persistence strategy** (RED-002) - Reset coordination requires single data model
3. **Design reset coordination model** - Centralized vs. distributed reset strategy

### Success Criteria

1. **Single Reset Event**: One coordinated reset per day at designated time
2. **Atomic State Updates**: All systems update consistently or none do
3. **Race Condition Prevention**: Multiple app instances don't interfere
4. **Predictable Behavior**: Users experience consistent daily transitions
5. **Debugging Clarity**: Central logging for all reset operations

---

**Next Action**: Architectural design meeting to choose reset coordination strategy and eliminate fragmented reset systems. This requires coordination with RED-001 and RED-002 fixes.