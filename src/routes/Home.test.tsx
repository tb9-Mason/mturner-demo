import { render, screen } from '@testing-library/react';

import { Home } from './Home';

describe('Home', () => {
  test('renders', async () => {
    render(<Home />);

    expect(screen.getByText("Mason's Demos")).toBeInTheDocument();
  });
});
