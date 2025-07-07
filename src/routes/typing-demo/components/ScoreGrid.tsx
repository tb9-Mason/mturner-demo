import { GRID_MAX } from '../constants';
import { GameState } from '../interfaces';

interface ScoreGridProps {
  correctCount: number;
  gameState: GameState;
}

// Fill in grid items as the correct count goes up. Display score and timing data
export const ScoreGrid = ({ correctCount, gameState }: ScoreGridProps) => {
  return (
    <div>
      <div className="flex w-full justify-between">
        <div>
          Time Left: <span className="font-bold">{gameState.timeRemaining}</span>
        </div>
        <div>
          Score: <span className="font-bold">{gameState.score}</span>
        </div>
      </div>
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
    </div>
  );
};
