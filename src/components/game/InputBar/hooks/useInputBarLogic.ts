import { useImperativeHandle, Ref } from 'react';

export interface InputBarHandle {
  focusInput: () => void;
}

interface UseInputBarLogicProps {
  ref: Ref<InputBarHandle>;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}

export const useInputBarLogic = ({
  ref,
  inputRef
}: UseInputBarLogicProps) => {
  // Expose the focusInput method to parent components
  useImperativeHandle(ref, () => ({
    focusInput: () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }));
};