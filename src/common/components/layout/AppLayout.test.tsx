import { act, render, screen, waitFor } from '@testing-library/react';

import { AppLayout } from './AppLayout';
import { createMemoryRouter, Link, RouterProvider } from 'react-router';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';

const mockLoader = async () => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return null;
};

const TestChild = () => (
  <div>
    foo
    <Link to="load">navigate</Link>
  </div>
);
const TestChildLoading = () => <div>bar</div>;

const router = createMemoryRouter(
  [
    {
      path: '/',
      element: <AppLayout />,
      children: [
        { index: true, element: <TestChild /> },
        { path: 'load', loader: mockLoader, element: <TestChildLoading /> },
      ],
    },
  ],
  { initialEntries: ['/'] },
);

describe('AppLayout', () => {
  test('renders', async () => {
    const year = new Date().getFullYear();
    render(<RouterProvider router={router} />);

    expect(screen.getByText('foo')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText(`©${year} Mason Turner`)).toBeInTheDocument();
  });

  test('shows the loading indicator when navigating to loaded routes', async () => {
    render(<RouterProvider router={router} />);

    expect(screen.getByText('foo')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('link', { name: 'navigate' }));
    await waitFor(() => {
      expect(screen.getByTestId('message')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('bar')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('message')).not.toBeInTheDocument();
  });

  test('shows toast messages', async () => {
    render(<RouterProvider router={router} />);
    await act(async () => {
      toast('Hello world');
    });

    await waitFor(() => {
      expect(screen.getByText('Hello world')).toBeInTheDocument();
    });
  });
});
