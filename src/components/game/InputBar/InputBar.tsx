import React, { forwardRef, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Autocomplete from '../Autocomplete';
import GuessProgressBar from '../GuessProgressBar';
import { useAutoGrowTextarea } from './useAutoGrowTextarea';
import { inputBarStyles } from './InputBar.styles';
import { useInputBar, InputBarHandle } from './useInputBar';
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
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);
  const textareaShellRef = useRef<HTMLDivElement>(null);
  
  const {
    inputRef,
    handleSuggestionClick
  } = useInputBar({
    ref,
    setInputValue,
    setHasSuggestionSelected
  });

  // Auto-grow textarea functionality
  useAutoGrowTextarea(
    inputRef as unknown as React.RefObject<HTMLTextAreaElement>,
    textareaShellRef as unknown as React.RefObject<HTMLDivElement>,
    inputValue,
    { maxHeightPx: 120 }
  );

  return (
    <div className={inputBarStyles.container}>
      <div ref={textareaShellRef} className={inputBarStyles.inputShell}>
        <form ref={formRef} onSubmit={(e) => {
          // Prevent submission if a suggestion is selected
          if (hasSuggestionSelected) {
            e.preventDefault();
            return;
          }
          onSubmit(e);
        }}>
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
            className={`${inputBarStyles.input(isInputDisabled())} ${inputBarStyles.inputPosition} hide-scrollbar`}
            style={inputBarStyles.inputWithTheme(colors.primary)}
            disabled={isInputDisabled()}
            autoComplete="off"
            value={inputValue}
            onChange={(e) => {
              const val = e.target.value;
              setInputValue(val);
              setHasUserInput(val.trim().length > 0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !hasSuggestionSelected) {
                e.preventDefault();
                // Submit the form programmatically
                formRef.current?.requestSubmit();
              }
            }}
            rows={1}
            maxLength={200}
          />
          <button
            type="submit"
            className={inputBarStyles.submitButton}
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
      
      <div className={inputBarStyles.progressContainer}>
        <div id="game-progress">
          <GuessProgressBar />
        </div>
      </div>
    </div>
  );
});

InputBar.displayName = 'InputBar';

export default InputBar;
