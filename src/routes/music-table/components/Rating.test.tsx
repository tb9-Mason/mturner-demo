import { render, screen } from '@testing-library/react';

import { Rating } from './Rating';
import { useState } from 'react';
import userEvent from '@testing-library/user-event';

const handleClickMock = vi.fn();

const staticProps = {
  id: 'abc123',
  loading: false,
  value: 0,
};

const interactiveProps = {
  id: 'abc123',
  loading: false,
  value: 0,
  handleClick: handleClickMock,
};

const TestComponent = () => {
  const [props, setProps] = useState(staticProps);

  return (
    <div>
      <Rating {...props} />
      <button onClick={() => setProps((prev) => ({ ...prev, value: prev.value + 0.5 }))}>Increment</button>
    </div>
  );
};

describe('Rating', () => {
  test('renders in static mode', async () => {
    render(<TestComponent />);

    // No interactivity
    expect(Screen.ratingButton).not.toBeInTheDocument();

    // All empty
    expect(screen.getAllByText('empty').length).toBe(5);
    expect(screen.queryAllByText('full').length).toBe(0);

    // Half star - really 5 empty and one full due to how HalfStar is composed
    await userEvent.click(Screen.incrementButton);
    expect(screen.getAllByText('empty').length).toBe(5);
    expect(screen.getAllByText('full').length).toBe(1);

    // One Full Star
    await userEvent.click(Screen.incrementButton);
    expect(screen.getAllByText('empty').length).toBe(4);
    expect(screen.getAllByText('full').length).toBe(1);
  });

  test('renders in interactive mode', async () => {
    render(<Rating {...interactiveProps} />);

    expect(Screen.ratingButton).toBeInTheDocument();
  });

  test('handles click actions', async () => {
    render(<Rating {...interactiveProps} />);

    await userEvent.click(Screen.ratingButton!);

    expect(handleClickMock).toHaveBeenCalledWith(0);
  });

  test('is disabled when loading', async () => {
    const loadingProps = { ...interactiveProps, loading: true };
    render(<Rating {...loadingProps} />);

    expect(Screen.ratingButton).toBeDisabled();
  });
});

const Screen = {
  get incrementButton() {
    return screen.getByRole('button', { name: 'Increment' });
  },
  get ratingButton() {
    return screen.queryByRole('button', { name: 'empty Rate 1 stars' });
  },
};

vi.mock('@heroicons/react/24/solid', () => ({
  StarIcon: () => <div>full</div>,
}));

vi.mock('@heroicons/react/24/outline', () => ({
  StarIcon: () => <div>empty</div>,
}));
