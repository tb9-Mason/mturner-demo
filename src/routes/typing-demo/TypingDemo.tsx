import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Heading, Input, Select } from '../../common/components';
import { words, WordsByDifficulty } from './typing-data';

const GRID_MAX = 100;
const DEFAULT_COMPLETED_WORDS = { easy: {}, medium: {}, hard: {} };
const TIME_OPTIONS_SEC = [60, 90, 120];
const SCORE_BY_DIFFICULTY = {
  easy: 5,
  medium: 10,
  hard: 20,
};

interface GameState {
  currentState: 'clean' | 'started' | 'completed';
  score: number;
  timeRemaining: number;
}

export const TypingDemo = () => {
  const [completedWords, setCompletedWords] = useState<{
    [key in keyof WordsByDifficulty]: Record<number, boolean>;
  }>(DEFAULT_COMPLETED_WORDS);
  const [gameState, setGameState] = useState<GameState>({ currentState: 'clean', score: 0, timeRemaining: 0 });
  const [inputValue, setInputValue] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState<{
    difficulty: keyof WordsByDifficulty;
    index: number;
  }>({ difficulty: 'easy', index: Math.floor(Math.random() * words.easy.length) });

  const inputRef = useRef<HTMLInputElement>(null);

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
    } else if (correctCount === 100) {
      // If the player has reached 100 phrases, the game is over
      setGameState((prev) => ({ ...prev, currentState: 'completed', timeRemaining: 0 }));
    } else {
      setCurrentWordIndex((prev) => ({ ...prev, index: getRandomWordIndex(prev.difficulty) }));
    }
  }, [correctCount, getRandomWordIndex]);

  useEffect(() => {
    let timeInterval: NodeJS.Timeout;
    if (gameState.currentState === 'started') {
      timeInterval = setInterval(() => {
        setGameState((prev) => {
          if (prev.timeRemaining <= 0) {
            clearInterval(timeInterval);
            // When the timer runs out, the game is over
            return { ...prev, timeRemaining: 0, currentState: 'completed' };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    }

    return () => clearInterval(timeInterval);
  }, [gameState.currentState]);

  useEffect(() => {
    if (gameState.currentState === 'started' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState.currentState]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const { difficulty, index } = currentWordIndex;
      // On enter press, check that the downcased strings match
      if (e.key === 'Enter' && inputValue.trim().toLowerCase() === words[difficulty][index].toLowerCase()) {
        // Clear the input
        setInputValue('');
        // Set the word at the current index and difficulty as being completed
        setCompletedWords((prev) => {
          // Note that this score update will happen twice in development due to strict mode
          setGameState((prevState) => {
            return { ...prevState, score: prevState.score + SCORE_BY_DIFFICULTY[difficulty] };
          });
          return { ...prev, [difficulty]: { ...prev[difficulty], [index]: true } };
        });
        // increment the correct counter without going over the grid max
        setCorrectCount((prev) => Math.min(prev + 1, GRID_MAX));
      }
    },
    [currentWordIndex, inputValue],
  );

  const handleStartGame = (time: number) => {
    setCorrectCount(0);
    setGameState({
      currentState: 'started',
      timeRemaining: time,
      score: 0,
    });
    setInputValue('');
    setCompletedWords(DEFAULT_COMPLETED_WORDS);
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
      <div className="flex flex-col items-center mb-4 relative py-4 max-w-2xl mx-auto">
        {gameState.currentState !== 'started' && (
          <StartEndGameOverlay gameState={gameState} onGameStart={handleStartGame} />
        )}
        <div>
          <div className="flex w-full justify-between">
            <div>
              Time Left: <span className="font-bold">{gameState.timeRemaining}</span>
            </div>
            <div>
              Score: <span className="font-bold">{gameState.score}</span>
            </div>
          </div>
          <ScoreGrid correctCount={correctCount} />
        </div>
        <div className="mb-4 text-center">
          <WordDisplay
            currentInput={inputValue}
            currentWord={words[currentWordIndex.difficulty][currentWordIndex.index]}
          />
        </div>
        <div className="text-center">
          <Input
            type="text"
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            disabled={gameState.currentState !== 'started'}
            className="border px-2 py-1"
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
          className={`size-5 border border-gray-400 ${i < correctCount ? 'animate-ping-once' : ''}`}
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
          key={`char-${l}-${i}`}
          className={`${i < matchIndex ? '!text-green-300' : ''} ${hasError && i < currentInput.length ? 'text-red-400' : ''}`}
        >
          {l}
        </span>
      ))}
    </span>
  );
};

interface StartEndGameOverlayProps {
  onGameStart: (time: number) => void;
  gameState: GameState;
}

const StartEndGameOverlay = ({ gameState, onGameStart }: StartEndGameOverlayProps) => {
  const [timeOption, setTimeOption] = useState(TIME_OPTIONS_SEC[1]);
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/90">
      <h2 className="mb-4">THE TYPING OF THE DEMO</h2>
      {gameState.currentState === 'completed' && (
        <div className="flex flex-col items-center gap-2 mb-4">
          <span className="font-bold text-xl">Final Score</span>
          <span className="font-bold text-4xl">{gameState.score}</span>
          <span>Play again?</span>
        </div>
      )}
      <div className="min-w-36">
        <Select className="mb-4" onChange={(e) => setTimeOption(parseInt(e.target.value))}>
          {TIME_OPTIONS_SEC.map((x) => (
            <option value={x} key={`time-option-${x}`}>
              {x} sec.
            </option>
          ))}
        </Select>
      </div>
      <Button autoFocus type="button" onClick={() => onGameStart(timeOption)}>
        Start Game
      </Button>
    </div>
  );
};
