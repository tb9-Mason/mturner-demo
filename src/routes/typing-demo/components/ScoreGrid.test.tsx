import { render, screen } from '@testing-library/react';

import { ScoreGrid, ScoreGridProps } from './ScoreGrid';

const initialProps: ScoreGridProps = {
  correctCount: 5,
  gameState: {
    currentState: 'started',
    score: 1000,
    timeRemaining: 55,
  },
};

describe('ScoreGrid', () => {
  test('renders completed blocks', async () => {
    const { container } = render(<ScoreGrid {...initialProps} />);

    const completedBlocks = container.querySelectorAll('.bg-white');

    expect(completedBlocks.length).toBe(initialProps.correctCount);
  });

  test('renders score and time remaining', async () => {
    render(<ScoreGrid {...initialProps} />);

    expect(
      screen.getByText((_, element) => element?.textContent === `Time Left: ${initialProps.gameState.timeRemaining}`),
    ).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => element?.textContent === `Score: ${initialProps.gameState.score}`),
    ).toBeInTheDocument();
  });
});
