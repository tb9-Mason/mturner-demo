import { XMarkIcon, MinusIcon } from '@heroicons/react/24/solid';
import { CircleIcon } from '@sidekickicons/react/24/outline';
import { Button } from '../../../common/components';
import { CellValueEnum } from '../../../gql/graphql';

type Row = [CellValueEnum, CellValueEnum, CellValueEnum];

export type Board = [Row, Row, Row];

export interface GameBoardProps {
  state: Board;
  isDisabled: boolean;
  onSelectCell: (index: CellIndex) => void;
}

export const GameBoard = ({ isDisabled, state, onSelectCell }: GameBoardProps) => {
  return (
    <div className="game-board">
      {state.map((row, rowIndex) => (
        <div key={rowIndex} className="game-row">
          {row.map((_cell, colIndex) => (
            <div key={colIndex} className="game-cell">
              <GameButton
                cellValue={state[rowIndex][colIndex]}
                cellIndex={[rowIndex, colIndex]}
                isDisabled={isDisabled}
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
  cellValue: CellValueEnum;
  cellIndex: CellIndex;
  isDisabled: boolean;
  onSelectCell: (index: CellIndex) => void;
}

export const GameButton = ({ cellValue, cellIndex, isDisabled, onSelectCell }: GameButtonProps) => {
  switch (cellValue) {
    case CellValueEnum.Empty:
      return (
        <Button
          disabled={isDisabled}
          onClick={() => {
            onSelectCell(cellIndex);
          }}
        >
          <MinusIcon className="size-12" />
        </Button>
      );
    case CellValueEnum.X:
      return <XMarkIcon className="size-20" />;

    case CellValueEnum.O:
      return <CircleIcon className="size-20" />;
    default:
      return <MinusIcon className="size-12" />;
  }
};
