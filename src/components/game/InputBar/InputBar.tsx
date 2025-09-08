import React, { forwardRef } from 'react';
import Autocomplete from '../Autocomplete';
import GuessProgressBar from '../GuessProgressBar';
import { useAutoGrowTextarea } from './hooks/useAutoGrowTextarea';
import styles from './InputBar.module.css';
import { useInputBar, InputBarHandle } from './hooks/useInputBar';
import { CategoryType } from '@/types';

interface InputBarProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isInputDisabled: () => boolean;
  colors: { primary: string };
  hasSuggestionSelected: boolean;
  setHasSuggestionSelected: (selected: boolean) => void;
  gameState: any;
  isAutocompleteEnabled: boolean;
  setHasUserInput: (hasInput: boolean) => void;
}

/**
 * Input bar component containing textarea, submit button, and autocomplete
 */
const InputBar = forwardRef<InputBarHandle, InputBarProps>(({
  inputValue,
  setInputValue,
  onSubmit,
  isInputDisabled,
  colors,
  hasSuggestionSelected,
  setHasSuggestionSelected,
  gameState,
  isAutocompleteEnabled,
  setHasUserInput
}, ref) => {
  const {
    inputRef,
    progressRef,
    formRef,
    textareaShellRef,
    handleSuggestionClick,
    handleFormSubmit,
    handleInputChange,
    handleKeyDown,
    responsiveValues
  } = useInputBar({
    ref,
    setInputValue,
    setHasSuggestionSelected,
    setHasUserInput,
    hasSuggestionSelected,
    onSubmit
  });

  // Auto-grow textarea functionality with responsive max height
  const maxHeight = responsiveValues.inputBarHeight * 2; // Allow input to grow to 2x the base height
  useAutoGrowTextarea(
    inputRef as unknown as React.RefObject<HTMLTextAreaElement>,
    textareaShellRef,
    inputValue,
    { maxHeightPx: maxHeight }
  );

  const responsiveContainerStyle = {
    gap: `${responsiveValues.spacing * 0.5}px`
  };

  return (
    <div className={styles.container} style={responsiveContainerStyle}>
      <div ref={textareaShellRef} className={styles.inputShell}>
        <form ref={formRef} onSubmit={handleFormSubmit}>
          {/* Autocomplete suggestions */}
          <Autocomplete
            category={gameState.challenge?.category || CategoryType.COUNTRIES}
            query={inputValue}
            onSuggestionClick={handleSuggestionClick}
            primaryColor={colors.primary}
            isVisible={isAutocompleteEnabled && !isInputDisabled() && inputValue.length >= 2}
            inputRef={inputRef}
            previousGuesses={gameState.guesses?.map((g: any) => g.guess) || []}
            onSelectionChange={setHasSuggestionSelected}
          />
          <textarea
            id="game-input"
            ref={inputRef}
            className={`${styles.inputBase} ${isInputDisabled() ? styles.inputDisabled : styles.inputEnabled} ${styles.hideScrollbar} ${styles.inputPosition}`}
            style={{
              "--theme-color": `var(--color-${colors.primary})`,
              transitionProperty: "height, transform",
              transitionDuration: "200ms", 
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              willChange: "height, transform",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "translateY(0)",
              overflowY: "hidden"
            }}
            disabled={isInputDisabled()}
            autoComplete="off"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={1}
            maxLength={200}
          />
          <button
            type="submit"
            className={styles.submitButton}
            style={{
              color: `var(--color-${colors.primary})`,
              backgroundColor: `var(--color-${colors.primary}10)`,
              opacity: isInputDisabled() || !inputValue.trim() ? 0.5 : 1
            }}
            disabled={isInputDisabled() || !inputValue.trim()}
          >
            ENTER
          </button>
        </form>
      </div>
      
      <div className={styles.progressContainer}>
        <div ref={progressRef} id="game-progress">
          <GuessProgressBar />
        </div>
      </div>
    </div>
  );
});

InputBar.displayName = 'InputBar';

export default InputBar;
