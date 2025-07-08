import { render, screen, waitFor } from '@testing-library/react';

import { LOADING_MESSAGES } from '../../utilities';
import { RouteLoadingIndicator } from './RouteLoadingIndicator';

describe('RouteLoadingIndicator', () => {
  test('renders a loading message', async () => {
    render(<RouteLoadingIndicator />);

    expect(screen.getByText('Probably waking up my eco dynos...')).toBeInTheDocument();
  });

  test('changes the loading message', async () => {
    render(<RouteLoadingIndicator />);

    const nextMessages = LOADING_MESSAGES.slice(1);

    await waitFor(
      () => {
        expect(nextMessages).toContain(screen.getByTestId('message').textContent);
      },
      { timeout: 5000 },
    );
  }, 5000);
});
