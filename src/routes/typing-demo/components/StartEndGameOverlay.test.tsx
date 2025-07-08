import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { StartEndGameOverlay, StartEndGameOverlayProps } from './StartEndGameOverlay';

const onGameStartMock = vi.fn();

const initialProps: StartEndGameOverlayProps = {
  onGameStart: onGameStartMock,
  gameState: {
    currentState: 'clean',
    score: 0,
    timeRemaining: 0,
  },
};

describe('StartEndGameOverlay', () => {
  test('renders an initial state', async () => {
    render(<StartEndGameOverlay {...initialProps} />);

    expect(screen.getByText('THE TYPING OF THE DEMO')).toBeInTheDocument();
    expect(screen.queryByText('Play again?')).not.toBeInTheDocument();
  });

  test('renders a game over state', async () => {
    const gameOverProps: StartEndGameOverlayProps = {
      ...initialProps,
      gameState: { ...initialProps.gameState, currentState: 'completed', score: 1000 },
    };
    render(<StartEndGameOverlay {...gameOverProps} />);

    expect(screen.getByText('THE TYPING OF THE DEMO')).toBeInTheDocument();
    expect(screen.getByText('Play again?')).toBeInTheDocument();
    expect(screen.getByText(gameOverProps.gameState.score)).toBeInTheDocument();
  });

  test('passes the selected time to the onGameStart function', async () => {
    render(<StartEndGameOverlay {...initialProps} />);

    const button = screen.getByRole('button', { name: 'Start Game' });
    const select = screen.getByRole('combobox');

    await userEvent.selectOptions(select, '120 sec.');
    await userEvent.click(button);

    expect(onGameStartMock).toHaveBeenCalledWith(120);
  });
});
