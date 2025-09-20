# 🟠 ORANGE-006: Cross-Slice Dependencies and Tight Coupling

**Classification**: 🟠 PERFORMANCE & QUALITY ISSUE
**Severity**: HIGH
**Discovery Date**: 2025-09-20
**Status**: ACTIVE

---

## 📋 Executive Summary

The application's Zustand store slices are **TIGHTLY COUPLED** through direct method calls between slices, creating a web of dependencies that violates the principle of slice isolation. Store slices directly call methods on other slices using `get()`, creating interdependencies that make the codebase fragile, difficult to test, and prone to cascading failures.

**Critical Impact**: The tight coupling makes it impossible to modify or test individual slices in isolation, significantly hurting development velocity and system reliability. Changes to one slice can break seemingly unrelated functionality in other slices.

---

## 🔍 Root Cause Analysis

### The Coupling Architecture

The store architecture violates slice isolation through **direct cross-slice method calls**:

1. **Streak Slice** calls methods on Core Game Slice
2. **Core Game Slice** calls methods on Streak, Timer, and UI Slices
3. **Final Five Slice** calls methods on Streak, Core Game, Timer, and UI Slices
4. **UI Slice** calls methods on Timer Slice

**The Problem**: Instead of communicating through events or shared state, slices directly invoke each other's methods, creating tight coupling and circular dependencies.

---

## 🔬 Technical Evidence

### 1. Core Game Slice Dependencies

**Location**: `src/store/slices/coreGameSlice.ts`

**Outgoing Dependencies** (Core Game → Other Slices):
```typescript
// Line 93: Core Game → Streak Slice
get().updateMissedDays();

// Line 414: Core Game → Streak Slice
get().updateStreak();

// Line 422: Core Game → Core Game (self-reference, but complex)
get().saveTodayGameData('standard-win', guess, numberOfTries, timeSpent, gameState.challenge);

// Line 410: Core Game → Timer Slice
get().setShouldPauseTimer(true);

// Lines 483, 503: Core Game → Core Game (manual persistence)
get().saveGameData();

// Line 655: Core Game → Timer Slice
get().saveTimerData();
```

**Result**: Core Game Slice is coupled to Streak Slice, Timer Slice, and its own persistence methods.

### 2. Streak Slice Dependencies

**Location**: `src/store/slices/streakSlice.ts`

**Outgoing Dependencies** (Streak → Other Slices):
```typescript
// Line 36: Streak → Streak (self-reference)
get().updateMissedDays();

// Line 151: Streak → Core Game Slice
get().clearTodayGameData();

// Lines 101, 111, 138, 174: Streak → Streak (manual persistence)
get().saveStreakData();
```

**Incoming Dependencies** (Other Slices → Streak):
```typescript
// From Core Game Slice:
get().updateMissedDays();
get().updateStreak();

// From Final Five Slice:
get().trackFailedAttempt();
get().updateStreak();
```

**Result**: Streak Slice both calls other slices and is called by other slices, creating bidirectional coupling.

### 3. Final Five Slice Dependencies

**Location**: `src/store/slices/finalFiveSlice.ts`

**Outgoing Dependencies** (Final Five → Other Slices):
```typescript
// Lines 210, 241: Final Five → Streak Slice
get().trackFailedAttempt();

// Lines 218, 249, 298: Final Five → Core Game Slice
get().saveTodayGameData('loss-final-five-wrong', ...);

// Lines 283, 290: Final Five → Timer Slice, Streak Slice
get().setShouldPauseTimer(true);
get().updateStreak();
```

**Cross-Slice Data Access**:
```typescript
// Line 73: Direct access to other slice's data
const { gameState, hardMode } = get();

// Line 213: Complex state access across slices
const currentState = get();
const numberOfTries = currentState.gameState.guesses.length + 1;
const timeSpent = initialTime - currentState.timeRemaining;
```

**Result**: Final Five Slice is tightly coupled to Core Game, Streak, and Timer slices.

### 4. UI Slice Dependencies

**Location**: `src/store/slices/uiSlice.ts`

**Outgoing Dependencies** (UI → Other Slices):
```typescript
// Lines 79, 85: UI → Timer Slice
get().setShouldPauseTimer(isOpen);
```

**Result**: Even the UI slice is coupled to Timer slice logic.

---

## 🌍 Real-World Impact Analysis

### Development Velocity Impact

**Testing Complexity**:
- Cannot unit test individual slices in isolation
- Must mock complex inter-slice dependencies
- Changes to one slice require testing all dependent slices
- Test setup becomes exponentially complex

**Development Workflow Issues**:
- Developers must understand multiple slices to change one
- Simple changes require analyzing complex dependency chains
- Risk of breaking unrelated functionality with local changes
- Difficult to onboard new developers due to coupling complexity

### System Reliability Impact

**Cascading Failures**:
- Error in one slice method can break multiple slices
- State corruption can propagate across slice boundaries
- Debug difficulty when failures span multiple slices
- Unpredictable side effects from simple operations

**Race Conditions**:
- Multiple slices calling each other's methods simultaneously
- Order-dependent operations across slice boundaries
- State inconsistencies during complex cross-slice operations
- Timing-sensitive bugs that are hard to reproduce

---

## 📊 Dependency Mapping

### Complete Cross-Slice Call Analysis

**Method Calls by Source Slice**:

| Source Slice | Target Slice | Method Called | Count | Lines |
|--------------|--------------|---------------|-------|-------|
| **coreGame** | streak | `updateMissedDays()` | 1 | 93 |
| **coreGame** | streak | `updateStreak()` | 1 | 414 |
| **coreGame** | timer | `setShouldPauseTimer()` | 1 | 410 |
| **coreGame** | timer | `saveTimerData()` | 1 | 655 |
| **coreGame** | coreGame | `saveGameData()` | 2 | 483, 503 |
| **coreGame** | coreGame | `saveTodayGameData()` | 1 | 422 |
| **streak** | streak | `updateMissedDays()` | 1 | 36 |
| **streak** | streak | `saveStreakData()` | 4 | 101, 111, 138, 174 |
| **streak** | coreGame | `clearTodayGameData()` | 1 | 151 |
| **finalFive** | streak | `trackFailedAttempt()` | 2 | 210, 241 |
| **finalFive** | streak | `updateStreak()` | 1 | 290 |
| **finalFive** | coreGame | `saveTodayGameData()` | 3 | 218, 249, 298 |
| **finalFive** | timer | `setShouldPauseTimer()` | 1 | 283 |
| **ui** | timer | `setShouldPauseTimer()` | 2 | 79, 85 |

**Total Cross-Slice Calls**: **21 direct method calls** between slices

### Dependency Graph

```
┌─────────────┐    calls    ┌─────────────┐
│ coreGame    │────────────▶│ streak      │
│             │             │             │
│             │◀────────────│             │
└─────────────┘             └─────────────┘
       │                           ▲
       │ calls                     │ calls
       ▼                           │
┌─────────────┐                    │
│ timer       │                    │
│             │                    │
└─────────────┘                    │
       ▲                           │
       │ calls                     │
       │                           │
┌─────────────┐                    │
│ ui          │                    │
│             │                    │
└─────────────┘                    │
                                   │
┌─────────────┐    calls           │
│ finalFive   │────────────────────┘
│             │
│             │────────────────────┐
└─────────────┘                    │
                                   ▼
                            ┌─────────────┐
                            │ coreGame    │
                            │             │
                            └─────────────┘
```

**Analysis**: Complex web of bidirectional dependencies with no clear hierarchy.

---

## 🚨 Architectural Anti-Patterns

### Anti-Pattern 1: Method Chaining Across Slices

**Pattern**:
```typescript
// finalFiveSlice.ts:290
get().trackFailedAttempt(); // Calls streak slice
get().updateStreak();       // Also calls streak slice
```

**Problem**: One user action triggers multiple cross-slice method calls, creating complex execution chains.

### Anti-Pattern 2: State Access Across Slice Boundaries

**Pattern**:
```typescript
// finalFiveSlice.ts:213-217
const currentState = get();
const numberOfTries = currentState.gameState.guesses.length + 1;
const timeSpent = initialTime - currentState.timeRemaining;
```

**Problem**: One slice directly accessing and manipulating data from multiple other slices.

### Anti-Pattern 3: Bidirectional Dependencies

**Pattern**:
```typescript
// coreGame calls streak methods:
get().updateMissedDays();
get().updateStreak();

// streak calls coreGame methods:
get().clearTodayGameData();
```

**Problem**: Circular dependencies make it impossible to understand data flow or test slices independently.

### Anti-Pattern 4: Manual Persistence in Multiple Slices

**Pattern**:
```typescript
// Each slice manually saves its own data:
get().saveStreakData();   // in streak slice
get().saveGameData();     // in coreGame slice
get().saveTimerData();    // called from coreGame slice
```

**Problem**: No coordination between save operations, potential for race conditions and data inconsistency.

---

## 🔧 Coupling Severity Analysis

### Tight Coupling Indicators

**High Coupling Metrics**:
- **21 cross-slice method calls** throughout codebase
- **Bidirectional dependencies** between core slices
- **State access across boundaries** without clear interfaces
- **Method chaining** creating complex execution paths

**Coupling Consequences**:
1. **Impossible Unit Testing**: Cannot test slices in isolation
2. **Fragile Changes**: Modifications break unrelated functionality
3. **Complex Debugging**: Failures span multiple slice boundaries
4. **Poor Maintainability**: Developers must understand entire system to change one part

### Specific Coupling Examples

**Example 1: Guess Submission Coupling**
```typescript
// When user submits guess in coreGameSlice:
get().setShouldPauseTimer(true);    // Couples to timer slice
get().updateStreak();               // Couples to streak slice
get().saveTodayGameData(...);       // Couples to persistence system
```

**Analysis**: Simple user action requires coordination across 3 different slices.

**Example 2: Final Five Completion Coupling**
```typescript
// When Final Five completes:
get().trackFailedAttempt();         // Couples to streak slice
get().setShouldPauseTimer(true);    // Couples to timer slice
get().updateStreak();               // Couples to streak slice again
get().saveTodayGameData(...);       // Couples to coreGame slice
```

**Analysis**: One game event triggers calls to 3 different slices with 4 separate method calls.

**Example 3: Missed Days Update Coupling**
```typescript
// When checking missed days in streakSlice:
get().clearTodayGameData();         // Couples to coreGame slice
```

**Analysis**: Streak management requires modifying game state, creating circular dependency.

---

## 🔍 Root Cause Analysis

### Why Cross-Slice Coupling Occurred

**Contributing Factors**:
1. **No Clear Architecture Pattern**: Slices evolved organically without design guidelines
2. **Convenience Over Design**: Direct method calls are easier than proper event/state communication
3. **Shared Responsibility**: Multiple slices trying to manage the same concerns
4. **Legacy Growth**: New features added dependencies instead of refactoring architecture

### Design Principle Violations

**Violated Principles**:
1. **Single Responsibility**: Slices handle multiple concerns
2. **Separation of Concerns**: Business logic scattered across slices
3. **Dependency Inversion**: High-level slices depend on low-level details
4. **Interface Segregation**: No clear interfaces between slices

---

## 📝 Risk Assessment

**Development Productivity Risks**:
- **High**: Cannot test or modify slices independently
- **High**: Complex change impact analysis required for simple modifications
- **Medium**: New developer onboarding complexity significantly increased
- **Medium**: Debugging difficulty when issues span multiple slices

**System Reliability Risks**:
- **High**: Cascading failures across slice boundaries
- **Medium**: Race conditions from concurrent cross-slice calls
- **Medium**: State corruption propagation across slices
- **Low**: Performance overhead from complex method call chains

**Maintainability Risks**:
- **High**: Exponential complexity growth with new features
- **High**: Refactoring one slice requires understanding all dependent slices
- **Medium**: Technical debt accumulation from workaround solutions
- **Medium**: Code review complexity due to cross-slice interactions

---

## 🔧 Solution Strategy Requirements

### Decoupling Approaches

**Option 1: Event-Based Communication**
- Slices emit events instead of calling methods directly
- Central event bus coordinates slice interactions
- Loose coupling through event subscriptions

**Option 2: State-Based Communication**
- Slices communicate only through shared state changes
- Derived state and selectors for cross-slice data access
- No direct method calls between slices

**Option 3: Command Pattern**
- Commands encapsulate cross-slice operations
- Central command dispatcher coordinates complex operations
- Clear separation between slice logic and coordination logic

**Option 4: Service Layer**
- External services handle cross-slice coordination
- Slices remain pure state containers
- Business logic moved to service layer

### Implementation Priorities

**Phase 1: Document Dependencies**
- Map all current cross-slice calls
- Identify which calls are necessary vs. convenience
- Prioritize most problematic couplings

**Phase 2: Introduce Interfaces**
- Define clear interfaces between slices
- Replace direct method calls with interface calls
- Add proper error handling and validation

**Phase 3: Implement Communication Pattern**
- Choose event-based, state-based, or command pattern
- Refactor highest-priority couplings first
- Gradually decouple remaining dependencies

### Success Criteria

1. **Independent Unit Testing**: Each slice can be tested in isolation
2. **Clear Data Flow**: Unidirectional data flow with no circular dependencies
3. **Interface-Based Communication**: Slices communicate through well-defined interfaces
4. **Single Responsibility**: Each slice handles one clear concern
5. **Change Impact Containment**: Changes to one slice don't require changes to others

---

## 📋 Dependencies and Connections

### Relationship to Other Issues

**ORANGE-005 (Complex State Recovery)**:
- Cross-slice coupling contributes to state corruption
- Recovery system needs to understand all slice interactions
- Tight coupling makes recovery logic more complex

**RED-002 (Dual Persistence)**:
- Multiple slices calling save methods creates race conditions
- Coupling makes it harder to coordinate persistence strategies
- Cross-slice calls during persistence can cause data corruption

**RED-003 (Daily Reset)**:
- Reset coordination requires understanding all slice dependencies
- Cross-slice calls during reset can create partial state updates
- Tight coupling makes atomic reset operations difficult

### Technical Dependencies

**Must Be Fixed After**:
- RED-002: Dual persistence issues compound coupling problems
- RED-003: Reset coordination issues make decoupling harder

**Enables Fixes For**:
- ORANGE-005: Simpler state management reduces need for recovery systems
- Better testing enables more confident refactoring
- Cleaner architecture supports future feature development

---

**Next Action**: Cross-slice decoupling should be addressed after fixing the core RED issues, as the current coupling problems are partially caused by the dual persistence and reset coordination issues. Once those are resolved, implement event-based or state-based communication to eliminate direct method calls between slices.**