import { useMemo } from 'react';
import { Button } from '../../../common/components';

export interface GameOverOverlayProps {
  winner?: string;
  onRestart: () => void;
}

export const GameOverOverlay = ({ onRestart, winner }: GameOverOverlayProps) => {
  const winnerMessage = useMemo(() => {
    let message = null;
    console.log(winner);
    if (winner === 'o') {
      message = 'YOU LOST!';
    } else if (winner === 'x') {
      message = 'YOU WON!';
    } else {
      message = 'DRAW!';
    }

    return message;
  }, [winner]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/90">
      <span className="mb-4 text-5xl">{winnerMessage}</span>
      <Button autoFocus type="button" onClick={onRestart}>
        Play again?
      </Button>
    </div>
  );
};
