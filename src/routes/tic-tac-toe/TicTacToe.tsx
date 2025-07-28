import { useState } from 'react';
import { BackendToggle, ChipList, Heading } from '../../common/components';
import { CellIndex, GameBoard, GameBoardProps } from './components/GameBoard';

const TECHNOLOGIES = ['React.js', 'TypeScript', 'Node/Express', 'GraphQL', 'Tailwind'];

const INITIAL_GAME_STATE: GameBoardProps['state'] = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
];

export const TicTacToe = () => {
  const [gameState, setGameState] = useState(INITIAL_GAME_STATE);
  const handleSelectCell = (index: CellIndex) => {
    const [updatedRowIndex, updatedColumnIndex] = index;
    console.log(index);
    setGameState((prev) => {
      return prev.map((row, rowIndex) => {
        if (updatedRowIndex === rowIndex) {
          return row.map((cell, columnIndex) => {
            if (updatedColumnIndex === columnIndex) {
              return 'x';
            }
            return cell;
          });
        }
        return row;
      }) as GameBoardProps['state'];
    });
  };

  return (
    <div className="w-full">
      <Heading tag="h1" className="mb-2">
        Tic Tac Toe
      </Heading>
      <ChipList list={TECHNOLOGIES} />
      <div className="mb-4 mt-2">
        <p>TODO</p>

        <BackendToggle isSupported={false} />
      </div>
      <div className="w-full">
        <div className="mx-auto max-w-80">
          <GameBoard state={gameState} onSelectCell={handleSelectCell} />
        </div>
      </div>
    </div>
  );
};
