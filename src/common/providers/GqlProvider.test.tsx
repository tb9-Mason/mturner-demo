import { render, screen } from '@testing-library/react';

import { GqlProvider } from './GqlProvider';

describe('GqlProvider', () => {
  test('renders', async () => {
    render(
      <GqlProvider>
        <div>foo</div>
      </GqlProvider>,
    );

    expect(screen.getByText('foo')).toBeInTheDocument();
  });
});
