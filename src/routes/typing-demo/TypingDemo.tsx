import { useCallback, useEffect, useMemo, useState } from 'react';
import { Heading } from '../../common/components';
import { words, WordsByDifficulty } from './typing-data';

const GRID_MAX = 100;

export const TypingDemo = () => {
  const [completedWords, setCompletedWords] = useState<{
    [key in keyof WordsByDifficulty]: Record<number, boolean>;
  }>({ easy: {}, medium: {}, hard: {} });
  const [inputValue, setInputValue] = useState('');
  const [correctCount, setCorrectCount] = useState(0);

  const [currentWordIndex, setCurrentWordIndex] = useState<{
    difficulty: keyof WordsByDifficulty;
    index: number;
  }>({ difficulty: 'easy', index: Math.floor(Math.random() * words.easy.length) });

  const getRandomWordIndex = useCallback(
    (difficulty: keyof WordsByDifficulty) => {
      const currentLength = words[difficulty].length;

      let newIndex = Math.floor(Math.random() * currentLength);

      while (completedWords[difficulty][newIndex]) {
        // if the index is already complete, get a new one
        newIndex = Math.floor(Math.random() * currentLength);
      }

      return newIndex;
    },
    [completedWords],
  );

  useEffect(() => {
    // Increment the difficulty over time and set a new random word from the desired difficulty
    if (correctCount === 33) {
      setCurrentWordIndex(() => ({ difficulty: 'medium', index: getRandomWordIndex('medium') }));
    } else if (correctCount === 66) {
      setCurrentWordIndex(() => ({ difficulty: 'hard', index: getRandomWordIndex('hard') }));
    } else {
      setCurrentWordIndex((prev) => ({ ...prev, index: getRandomWordIndex(prev.difficulty) }));
    }
  }, [correctCount, getRandomWordIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { difficulty, index } = currentWordIndex;
    // On enter press, check that the downcased strings match
    if (e.key === 'Enter' && inputValue.trim().toLowerCase() === words[difficulty][index].toLowerCase()) {
      // Clear the input
      setInputValue('');
      // Set the word at the current index and difficulty as being completed
      setCompletedWords((prev) => {
        return { ...prev, [difficulty]: { ...prev[difficulty], [index]: true } };
      });
      // increment the correct counter without going over the grid max
      setCorrectCount((prev) => Math.min(prev + 1, GRID_MAX));
    }
  };

  return (
    <div className="w-full">
      <Heading tag="h1">The Typing of the Demo</Heading>
      <div className="mb-4">
        <p>
          Phrases sourced from{' '}
          <a href="https://jonathansoma.com/projects/typing-of-the-dead/" target="_blank" rel="noreferrer">
            Jonathan Soma's amazing Typing of the Dead phrase list.
          </a>
        </p>
      </div>
      <div className="flex flex-col items-center mb-4 relative">
        <ScoreGrid correctCount={correctCount} />
        <div className="mb-4 text-center">
          <WordDisplay
            currentInput={inputValue}
            currentWord={words[currentWordIndex.difficulty][currentWordIndex.index]}
          />
        </div>
        <div className="text-center">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className="border px-2 py-1"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

interface ScoreGridProps {
  correctCount: number;
}

const ScoreGrid = ({ correctCount }: ScoreGridProps) => {
  return (
    <div className="grid grid-cols-10 gap-1 mb-6 w-56">
      {Array.from({ length: GRID_MAX }).map((_, i) => (
        <div
          key={`grid-${i}`}
          className="size-5 border border-gray-400"
          style={{
            background: i < correctCount ? 'white' : 'transparent',
          }}
        />
      ))}
    </div>
  );
};

interface WordAreaProps {
  currentWord: string;
  currentInput: string;
}

const WordDisplay = ({ currentWord, currentInput }: WordAreaProps) => {
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
          className={`${i < matchIndex ? '!text-green-300' : ''} ${hasError && i < currentInput.length ? 'text-red-400' : ''}`}
        >
          {l}
        </span>
      ))}
    </span>
  );
};
