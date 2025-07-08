import { render, screen } from '@testing-library/react';

import { Footer } from './Footer';

describe('Footer', () => {
  test('renders', async () => {
    render(<Footer />);

    const year = new Date().getFullYear();

    expect(screen.getByText(`©${year} Mason Turner`)).toBeInTheDocument();
    expect(screen.getAllByRole('link').length).toBe(1);
  });
});
