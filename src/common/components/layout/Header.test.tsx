import { render, screen } from '@testing-library/react';

import { Header } from './Header';
import { LinkProps } from 'react-router';

describe('Header', () => {
  test('renders', async () => {
    render(<Header />);

    expect(screen.getAllByRole('link').length).toBeGreaterThan(1);
  });
});

vi.mock('react-router', () => ({
  Link: (props: LinkProps) => <a href={props.to as string}>{props.children}</a>,
}));
