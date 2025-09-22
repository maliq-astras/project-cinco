# Game State Integrity Protection System

## Overview

Despite our best efforts in implementing controlled daily resets, state reconciliation, and careful persistence management, there will always be edge cases, unknown bugs, external factors, or unexpected scenarios that can leave the game in an **impossible state**.

We need a **last line of defense** - a comprehensive integrity protection system that detects corrupted/inconsistent game states on reload and takes appropriate action (repair or reset) to ensure the game remains playable.

## Philosophy

**"Hope for the best, prepare for the worst"**

- **Primary Defense**: Clean architecture, proper state management, tested daily resets
- **Secondary Defense**: State reconciliation, known bug fixes (like RED-005)
- **Final Defense**: **Integrity protection system** - this document

The integrity system is our **circuit breaker** - when all else fails, we detect the problem and fail gracefully rather than leaving users in a broken state.

## Categories of Corruption

### 1. Business Logic Violations
**Definition**: Game states that violate fundamental game rules

**Examples**:
- `revealedFacts: [0,1,2,3]` but `guesses: []` (impossible - user must guess after each reveal)
- `currentStreak: 50` but `weeklyCompletions: [null,null,null,null,null,null,null]` (impossible - no completions but high streak)
- `timeRemaining: -100` (impossible - time cannot be negative)
- `gameState.isGameOver: true` but `gameOutcome: null` (incomplete endgame state)
- `isFinalFiveActive: true` but `gameState.revealedFacts.length < 5` (impossible - need 5 facts for Final Five)

**Risk Level**: HIGH - These indicate fundamental logic failures

### 2. Data Type Corruption
**Definition**: Values have wrong types due to serialization issues, external interference

**Examples**:
- `currentStreak: "5"` (string instead of number)
- `weeklyCompletions: {}` (object instead of array)
- `gameState: null` (missing critical object)
- `revealedFacts: [0,"1",2]` (mixed types in array)
- `timeRemaining: NaN` (invalid number)

**Risk Level**: CRITICAL - These can crash the application

### 3. Missing Critical Data
**Definition**: Required values are null/undefined when game state suggests they should exist

**Examples**:
- `hasSeenClue: true` but `gameState.challenge: null` (impossible - no challenge but user has seen clues)
- `gameState.isGameOver: true` but `todayGameData: null` (incomplete - should have game completion data)
- `isVictoryAnimationActive: true` but `gameOutcome: null` (incomplete victory state)
- `lastCompletionDate: "2025-09-22"` but `currentStreak: null` (inconsistent streak data)

**Risk Level**: HIGH - These create user experience failures

### 4. Temporal Inconsistencies
**Definition**: Date/time related data that violates temporal logic

**Examples**:
- `lastCompletionDate: "2025-12-31"` (future date - impossible)
- `timerStartTime: 1234567890` but `timeRemaining: 300` (timer data doesn't make sense)
- `todayGameData.completionDate: "2025-09-20"` but current date is `2025-09-22` (stale data not reset)

**Risk Level**: MEDIUM - These indicate daily reset failures

### 5. Version/Migration Artifacts
**Definition**: Old data structures in localStorage from previous app versions

**Examples**:
- `weeklyCompletions: [true,false,true,false,false,false,false]` (old boolean format)
- Missing new required fields from recent updates
- Deprecated field names still present
- Data structure shape mismatches

**Risk Level**: MEDIUM - These indicate migration failures

### 6. Race Condition Artifacts
**Definition**: Corrupted states from timing issues, refresh problems (like RED-005)

**Examples**:
- `hasSeenClue: true`, `revealedFacts: []`, `canMakeGuess: false`, `timeRemaining: 300` (RED-005 pattern)
- `isProcessingGuess: true` but no active API call context (stuck processing state)
- `isDrawingFromStack: true` but `viewingFact: null` (stuck animation state)

**Risk Level**: HIGH - These create deadlocks

## Integrity Check System Design

### Core Invariants (Rules That Must Always Be True)

```typescript
interface GameStateInvariants {
  // Business Logic Invariants
  revealGuessBalance: number; // revealedFacts.length - wrongGuesses.length should be 0 or 1
  streakDataConsistency: boolean; // currentStreak and weeklyCompletions must align
  gameFlowConsistency: boolean; // Timer, clues, and guesses must follow logical progression

  // Data Type Invariants
  typeIntegrity: boolean; // All values have expected types
  requiredFieldsPresent: boolean; // No null/undefined where values required

  // Temporal Invariants
  dateLogicalness: boolean; // No future dates, reasonable date ranges
  timerConsistency: boolean; // Timer state makes sense

  // Game State Coherence
  endgameConsistency: boolean; // If game over, all endgame data present
  modeConsistency: boolean; // Hard mode settings align with timer values
}
```

### Detection Strategy

**Phase 1: Type Safety Checks**
- Verify all fields have expected types
- Check for null/undefined in required fields
- Validate array structures and object shapes

**Phase 2: Business Logic Validation**
- Check reveal/guess balance rules
- Validate streak data consistency
- Verify game flow logic (timer, states, transitions)

**Phase 3: Temporal Coherence**
- Validate all dates are reasonable
- Check timer state makes sense
- Verify daily reset logic worked correctly

**Phase 4: Cross-Reference Validation**
- Ensure related fields are consistent with each other
- Validate endgame state completeness
- Check for impossible state combinations

### Response Strategy

#### Level 1: Auto-Repair (Minor Issues)
**When**: Data type issues, missing non-critical fields, minor inconsistencies
**Action**: Fix the specific issue and continue
**Examples**:
- Convert string numbers to numbers
- Set missing scaleFactor to default 1
- Fix negative timer values to 0

#### Level 2: Targeted Reset (Moderate Issues)
**When**: Game flow corruption, but user data is intact
**Action**: Reset game progress, preserve user data (streaks, preferences)
**Examples**:
- RED-005 style deadlocks
- Timer initialization failures
- Broken animation states

#### Level 3: Complete Reset (Severe Issues)
**When**: Critical corruption, data safety concerns, multiple invariant violations
**Action**: Full state reset to defaults, preserve only essential user data
**Examples**:
- Multiple type corruptions
- Impossible business logic states
- Potential security concerns

#### Level 4: Emergency Mode (Catastrophic Issues)
**When**: Even reset fails or corruption keeps recurring
**Action**: Clear all localStorage, force fresh start, log critical error
**Examples**:
- Recurring corruption patterns
- localStorage itself corrupted
- Browser environment issues

## Implementation Approach

### 1. Integrity Checker Module
```typescript
// Conceptual structure
interface IntegrityCheckResult {
  isValid: boolean;
  violations: IntegrityViolation[];
  recommendedAction: 'continue' | 'repair' | 'targetedReset' | 'fullReset' | 'emergency';
  repairActions?: RepairAction[];
}

function checkGameStateIntegrity(state: GameStore): IntegrityCheckResult
```

### 2. Integration Points
- **Zustand Hydration**: Check integrity immediately after state loads
- **State Reconciliation**: Run checks before applying any fixes
- **Daily Reset Manager**: Validate state before and after reset
- **Component Boundaries**: Check integrity before rendering critical components

### 3. Logging and Monitoring
- Log all integrity violations for debugging
- Track patterns of corruption
- Monitor repair/reset frequencies
- Alert on emergency mode activations

### 4. User Communication
- Silent repairs when possible
- Informative messages for resets ("We've refreshed your game session for optimal performance")
- Apologetic messaging for emergency resets
- Never expose technical details to users

## Benefits

### 1. User Experience Protection
- Prevents "broken game" scenarios
- Graceful degradation instead of crashes
- Maintains user trust and engagement

### 2. Development Safety Net
- Catches unknown edge cases
- Reduces support burden
- Provides data for identifying new bugs

### 3. Production Resilience
- Handles browser quirks and external interference
- Recovers from deployment issues
- Adapts to unexpected user behaviors

### 4. Data Quality Assurance
- Maintains data integrity over time
- Prevents corruption propagation
- Ensures analytics accuracy

## Future Considerations

### 1. Machine Learning Detection
- Pattern recognition for subtle corruptions
- Predictive repair strategies
- Anomaly detection for new corruption types

### 2. A/B Testing Integration
- Test different repair strategies
- Measure user impact of various approaches
- Optimize reset vs repair decisions

### 3. Real-time Monitoring
- Dashboard for corruption patterns
- Alerting for unusual corruption rates
- Performance impact monitoring

### 4. Cross-Platform Considerations
- Browser-specific corruption patterns
- Mobile vs desktop differences
- PWA and offline scenarios

## Conclusion

The integrity protection system serves as our **final safety net** - ensuring that no matter what goes wrong (known bugs, unknown edge cases, external factors), users always have a playable game.

This system acknowledges that **perfect code is impossible** but **perfect user experience is achievable** through defensive programming and graceful failure handling.

**Next Steps**:
1. Implement core invariant checking functions
2. Add integrity validation to Zustand hydration
3. Create repair strategy implementations
4. Add comprehensive logging and monitoring
5. Test with various corruption scenarios