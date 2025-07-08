import { render, screen } from '@testing-library/react';

import { ChipList } from './ChipList';

const LIST = ['foo', 'bar'];

describe('ChipList', () => {
  test('renders chips', async () => {
    const { container } = render(<ChipList list={LIST} />);

    const chips = container.querySelectorAll('.chip');

    expect(chips.length).toBe(2);

    expect(screen.getByText('foo')).toBeInTheDocument();
    expect(screen.getByText('bar')).toBeInTheDocument();
    expect(screen.queryByText('baz')).not.toBeInTheDocument();
  });
});
