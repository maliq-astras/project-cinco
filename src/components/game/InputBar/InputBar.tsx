import React, { forwardRef } from 'react';
import Autocomplete from '../Autocomplete';
import GuessProgressBar from '../GuessProgressBar';
import styles from './InputBar.module.css';
import { useInputBarOrchestrator } from './hooks';
import { InputBarHandle } from './hooks/useInputBarLogic';
import { CategoryType } from '@/types';
import { getContainerStyle, getTextareaStyle, getSubmitButtonStyle } from './helpers';

interface InputBarProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isInputDisabled: () => boolean;
  colors: { primary: string };
  hasSuggestionSelected: boolean;
  setHasSuggestionSelected: (selected: boolean) => void;
  gameState: {
    challenge: { category: CategoryType } | null;
    guesses: Array<{ guess: string }>;
  };
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
  } = useInputBarOrchestrator({
    ref,
    inputValue,
    setInputValue,
    setHasSuggestionSelected,
    setHasUserInput,
    hasSuggestionSelected,
    onSubmit
  });

  const responsiveContainerStyle = getContainerStyle(responsiveValues.spacing);

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
            previousGuesses={gameState.guesses?.map((g) => g.guess) || []}
            onSelectionChange={setHasSuggestionSelected}
          />
          <textarea
            id="game-input"
            ref={inputRef}
            className={`${styles.inputBase} ${isInputDisabled() ? styles.inputDisabled : styles.inputEnabled} ${styles.hideScrollbar} ${styles.inputPosition}`}
            style={getTextareaStyle(colors.primary)}
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
            style={getSubmitButtonStyle(colors.primary, isInputDisabled() || !inputValue.trim())}
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
