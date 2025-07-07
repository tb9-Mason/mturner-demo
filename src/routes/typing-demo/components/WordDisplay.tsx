import { useMemo } from 'react';

interface WordDisplayProps {
  currentWord: string;
  currentInput: string;
}

// Highlight correct/incorrect letters. Animate the word if there is an incorrect input
export const WordDisplay = ({ currentWord, currentInput }: WordDisplayProps) => {
  const characterArray = currentWord.split('');
  // Get the length of the string that has been correctly typed thus far
  const matchIndex = useMemo(() => {
    const minLength = Math.min(currentWord.length, currentInput.length);
    let i = 0;
    while (i < minLength && currentInput[i].toLowerCase() === currentWord[i].toLowerCase()) {
      i++;
    }
    return i;
  }, [currentInput, currentWord]);

  const hasError = useMemo(() => {
    // Set a boolean when the input is longer than the current match index
    return currentInput.length > 0 && currentInput.length > matchIndex;
  }, [currentInput, matchIndex]);

  // Split the current word into spans, highlight correct and incorrect letters
  return (
    <span className={`font-bold text-lg block ${hasError ? 'animate-shake' : ''}`}>
      {characterArray.map((l, i) => (
        <span
          key={`char-${l}-${i}`}
          className={`${i < matchIndex ? '!text-green-300' : ''} ${hasError && i < currentInput.length ? 'text-red-400' : ''}`}
        >
          {l}
        </span>
      ))}
    </span>
  );
};
