import { useCallback, useEffect, useMemo, useState } from 'react';
import { BackendToggle, ChipList, Heading, Select } from '../../common/components';
import { Board, CellIndex, GameBoard, GameBoardProps } from './components/GameBoard';
import { MAKE_MOVE } from './queries/game.queries';
import { useMutation } from '@apollo/client';
import { CellValueEnum } from '../../gql/graphql';
import { Field, Fieldset, Label } from '@headlessui/react';
import { GameOverOverlay } from './components/GameOverOverlay';

const TECHNOLOGIES = ['React.js', 'TypeScript', 'Node/Express', 'GraphQL', 'Tailwind'];

const INITIAL_GAME_STATE: GameBoardProps['state'] = [
  [CellValueEnum.Empty, CellValueEnum.Empty, CellValueEnum.Empty],
  [CellValueEnum.Empty, CellValueEnum.Empty, CellValueEnum.Empty],
  [CellValueEnum.Empty, CellValueEnum.Empty, CellValueEnum.Empty],
];

export const TicTacToe = () => {
  const [gameState, setGameState] = useState(INITIAL_GAME_STATE);
  const [difficulty, setDifficulty] = useState('easy');
  const [makeMoveMutation, { loading }] = useMutation(MAKE_MOVE);
  const [isActive, setIsActive] = useState(true);
  const [winner, setWinner] = useState<CellValueEnum>();

  const handleMakeMove = useCallback(async () => {
    const response = await makeMoveMutation({
      variables: { data: { board: gameState, difficulty } },
    });

    if (response.data) {
      setGameState(response.data.makeMove.board as Board);
      setIsActive(!response.data.makeMove.gameOver);
      if (response.data.makeMove.winner) {
        setWinner(response.data.makeMove.winner as CellValueEnum);
      }
    }
  }, [gameState, difficulty, makeMoveMutation]);

  useEffect(() => {
    const localMovesCount = gameState.flat().filter((x) => x === CellValueEnum.X).length;
    const serverMovesCount = gameState.flat().filter((x) => x === CellValueEnum.O).length;
    if (localMovesCount === serverMovesCount + 1 && isActive) {
      handleMakeMove();
    }
  }, [gameState, handleMakeMove, isActive]);

  const disableBoard = useMemo(() => {
    return loading || !isActive;
  }, [loading, isActive]);

  const handleSelectCell = (index: CellIndex) => {
    const [updatedRowIndex, updatedColumnIndex] = index;
    setGameState((prev) => {
      return prev.map((row, rowIndex) => {
        if (updatedRowIndex === rowIndex) {
          return row.map((cell, columnIndex) => {
            if (updatedColumnIndex === columnIndex) {
              return CellValueEnum.X;
            }
            return cell;
          });
        }
        return row;
      }) as GameBoardProps['state'];
    });
  };

  const handleRestartGame = () => {
    setGameState(INITIAL_GAME_STATE);
    setIsActive(true);
    setWinner(undefined);
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
        <div className="relative max-w-2xl mx-auto">
          <div className="mx-auto max-w-92">
            <div>
              <Fieldset>
                <Field>
                  <Label htmlFor="difficulty">Select Difficulty</Label>
                  <Select
                    id="difficulty"
                    name="difficulty"
                    className={!isActive ? 'opacity-50' : ''}
                    onChange={(e) => setDifficulty(e.target.value)}
                    disabled={!isActive}
                  >
                    <option value="easy">Easy</option>
                    <option value="hard">Hard</option>
                  </Select>
                </Field>
              </Fieldset>
            </div>
            {!isActive && <GameOverOverlay winner={winner} onRestart={handleRestartGame} />}
          </div>
          <div className="mx-auto max-w-80">
            <GameBoard state={gameState} onSelectCell={handleSelectCell} isDisabled={disableBoard} />
          </div>
        </div>
      </div>
    </div>
  );
};
