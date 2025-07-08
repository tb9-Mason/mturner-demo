import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TypingDemo } from './TypingDemo';
import { ScoreGridProps, StartEndGameOverlayProps } from './components';
import { words } from './typing-data';

const enterCorrectWord = async (container: HTMLElement, times = 1) => {
  while (times > 0) {
    const wordValue = Screen.currentWord(container);
    fireEvent.input(Screen.input, { target: { value: wordValue } });
    fireEvent.keyDown(Screen.input, { key: 'Enter', code: 'Enter' });
    times--;
  }
};

describe('TypingDemo', () => {
  test('renders an initial state', async () => {
    render(<TypingDemo />);
    expect(Screen.startEndOverlay).toBeInTheDocument();
    expect(Screen.input).toBeDisabled();
  });

  test('starts the game on interaction', async () => {
    render(<TypingDemo />);
    await userEvent.click(Screen.startButtonLong);
    expect(Screen.startEndOverlay).not.toBeInTheDocument();
    expect(Screen.input).toBeEnabled();
    expect(Screen.input).toHaveFocus();
  });

  test('increments the correct count when the correct string is entered', async () => {
    const { container } = render(<TypingDemo />);
    await userEvent.click(Screen.startButtonLong);

    expect(Screen.correctCount).toHaveTextContent('0');

    await act(async () => {
      await enterCorrectWord(container);
    });

    expect(Screen.correctCount).toHaveTextContent('1');
  });

  test('updates difficulty after 33 and 66 correct completions', async () => {
    const { container } = render(<TypingDemo />);
    await userEvent.click(Screen.startButtonLong);

    const easyWord = Screen.currentWord(container);
    expect(words['easy']).toContain(easyWord);

    await act(async () => {
      await enterCorrectWord(container, 33);
    });
    expect(Screen.correctCount).toHaveTextContent('33');

    const mediumWord = Screen.currentWord(container);
    expect(words['medium']).toContain(mediumWord);

    await act(async () => {
      await enterCorrectWord(container, 33);
    });
    expect(Screen.correctCount).toHaveTextContent('66');

    const hardWord = Screen.currentWord(container);
    expect(words['hard']).toContain(hardWord);
  });

  test('ends the game after 100 correct completions', async () => {
    const { container } = render(<TypingDemo />);
    expect(Screen.startEndOverlay).toBeInTheDocument();

    await userEvent.click(Screen.startButtonLong);
    expect(Screen.startEndOverlay).not.toBeInTheDocument();

    await act(async () => {
      await enterCorrectWord(container, 100);
    });

    expect(Screen.startEndOverlay).toBeInTheDocument();
  });

  test('ends the game when the timer is up', async () => {
    render(<TypingDemo />);
    expect(Screen.startEndOverlay).toBeInTheDocument();

    await userEvent.click(Screen.startButtonShort);
    expect(Screen.startEndOverlay).not.toBeInTheDocument();

    await waitFor(
      () => {
        expect(Screen.startEndOverlay).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });
});

const Screen = {
  currentWord(container: HTMLElement) {
    return container.getElementsByClassName('current-word')[0].textContent;
  },

  get correctCount() {
    return screen.getByTestId('correct-count');
  },

  get input() {
    return screen.getByRole('textbox');
  },

  get startEndOverlay() {
    return screen.queryByTestId('start-end-game-overlay');
  },
  get startButtonLong() {
    return screen.getByRole('button', { name: 'Start Long' });
  },

  get startButtonShort() {
    return screen.getByRole('button', { name: 'Start Short' });
  },
};

vi.mock('./components', () => ({
  ScoreGrid: (props: ScoreGridProps) => (
    <div data-testid="score-grid">
      Score Grid
      <span data-testid="correct-count">{props.correctCount}</span>
    </div>
  ),
  StartEndGameOverlay: (props: StartEndGameOverlayProps) => (
    <div data-testid="start-end-game-overlay">
      Start End Game Overlay
      <button onClick={() => props.onGameStart(120)}>Start Long</button>
      <button onClick={() => props.onGameStart(1)}>Start Short</button>
    </div>
  ),
  WordDisplay: (props: { currentWord: string; currentInput: string }) => (
    <div data-testid="word-display">
      Word Display
      <span data-testid="current-word" className="current-word">
        {props.currentWord}
      </span>
      <span data-testid="current-input">{props.currentInput}</span>
    </div>
  ),
}));
