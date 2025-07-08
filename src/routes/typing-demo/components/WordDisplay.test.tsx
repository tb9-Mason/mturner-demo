import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { WordDisplay } from './WordDisplay';
import { useState } from 'react';

const currentWord = 'foo';

const TestComponent = () => {
  const [currentInput, setCurrentInput] = useState('');
  return (
    <div>
      <WordDisplay currentWord={currentWord} currentInput={currentInput} />
      <input type="text" value={currentInput} onChange={(e) => setCurrentInput(e.target.value)} />
    </div>
  );
};

describe('WordDisplay', () => {
  test('renders the current word', async () => {
    const { container } = render(<TestComponent />);

    const characters = container.querySelectorAll('.block span');
    expect(characters.length).toEqual(currentWord.length);

    const word = Array.from(characters)
      .map((el) => el.textContent)
      .join('');

    expect(word).toEqual(currentWord);
  });

  test('highlights correct and incorrect characters', async () => {
    const { container } = render(<TestComponent />);

    const input = screen.getByRole('textbox');

    await userEvent.type(input, 'f');

    const correctHighlight = container.querySelectorAll('.\\!text-green-300');
    expect(correctHighlight.length).toEqual(1);

    await userEvent.clear(input);
    await userEvent.type(input, 'b');

    const incorrectHighlight = container.querySelectorAll('.text-red-400');
    expect(incorrectHighlight.length).toEqual(1);
  });
});
