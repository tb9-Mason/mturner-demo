import { useCallback, useEffect, useRef, useState } from 'react';
import { Heading, Input, ChipList } from '../../common/components';
import { words, WordsByDifficulty } from './typing-data';
import { GameState } from './interfaces';
import { ScoreGrid, StartEndGameOverlay, WordDisplay } from './components';
import { GRID_MAX } from './constants';

const DEFAULT_COMPLETED_WORDS = { easy: {}, medium: {}, hard: {} };

const SCORE_BY_DIFFICULTY = {
  easy: 5,
  medium: 10,
  hard: 20,
};

const TECHNOLOGIES = ['React.js', 'TypeScript', 'Tailwind', 'HeadlessUI'];

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
    setCurrentWordIndex(() => ({ difficulty: 'easy', index: getRandomWordIndex('easy') }));
  };

  return (
    <div className="w-full">
      <Heading tag="h1" className="mb-2">
        The Typing of the Demo
      </Heading>
      <ChipList list={TECHNOLOGIES} />
      <div className="mt-2 mb-4">
        <p>
          Inspired by the incredible and bizarre SEGA typing game, "The Typing of the Dead", released in 1999 to
          Japanese arcades, getting a US release for the Dreamcast in 2001.
        </p>
        <p>
          Half of the fun of this game is just being surprised by the insane phrases that you're prompted with, so I
          wanted to do a small recreation of that part of the game.
        </p>
        <p>
          Phrases sourced from{' '}
          <a href="https://jonathansoma.com/projects/typing-of-the-dead/" target="_blank" rel="noreferrer">
            Jonathan Soma's amazing Typing of the Dead phrase list.
          </a>{' '}
        </p>
        <p>
          I've pared the list down, as some of the phrases in this 1990's game may not be suitable for everyone. That
          being said, let me know if you find another questionable phrase in the game.
        </p>
        <p>
          Inputs are not case-sensitive, and the difficulty ramps up at 33 and 66 completions. It should go without
          saying, but this is best played on a keyboard.
        </p>
      </div>
      <div className="flex flex-col items-center mb-4 relative py-4 max-w-2xl mx-auto">
        {gameState.currentState !== 'started' && (
          <StartEndGameOverlay gameState={gameState} onGameStart={handleStartGame} />
        )}
        <ScoreGrid correctCount={correctCount} gameState={gameState} />
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
