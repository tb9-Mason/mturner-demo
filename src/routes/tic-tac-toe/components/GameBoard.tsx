import { XMarkIcon, MinusIcon } from '@heroicons/react/24/solid';
import { CircleIcon } from '@sidekickicons/react/24/outline';
import { Button } from '../../../common/components';

type CellValue = '' | 'x' | 'o';

type Row = [CellValue, CellValue, CellValue];

export type Board = [Row, Row, Row];

export interface GameBoardProps {
  state: Board;
  onSelectCell: (index: CellIndex) => void;
}

export const GameBoard = ({ state, onSelectCell }: GameBoardProps) => {
  return (
    <div className="game-board">
      {state.map((row, rowIndex) => (
        <div key={rowIndex} className="game-row">
          {row.map((_cell, colIndex) => (
            <div key={colIndex} className="game-cell">
              <GameButton
                cellValue={state[rowIndex][colIndex]}
                cellIndex={[rowIndex, colIndex]}
                onSelectCell={onSelectCell}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export type CellIndex = [number, number];

interface GameButtonProps {
  cellValue: CellValue;
  cellIndex: CellIndex;
  onSelectCell: (index: CellIndex) => void;
}

export const GameButton = ({ cellValue, cellIndex, onSelectCell }: GameButtonProps) => {
  switch (cellValue) {
    case '':
      return (
        <Button
          onClick={() => {
            onSelectCell(cellIndex);
          }}
        >
          <MinusIcon className="size-12" />
        </Button>
      );
    case 'x':
      return <XMarkIcon className="size-20" />;

    case 'o':
      return <CircleIcon className="size-20" />;
    default:
      return <MinusIcon className="size-12" />;
  }
};
