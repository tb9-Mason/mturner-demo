import { useState } from 'react';
import { GameState } from '../interfaces';
import { Button, Select } from '../../../common/components';

interface StartEndGameOverlayProps {
  onGameStart: (time: number) => void;
  gameState: GameState;
}

const TIME_OPTIONS_SEC = [60, 90, 120];

// Show the final score if the game is over, expose a button for starting the game
export const StartEndGameOverlay = ({ gameState, onGameStart }: StartEndGameOverlayProps) => {
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
