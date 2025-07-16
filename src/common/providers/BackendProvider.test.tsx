import { render, screen } from '@testing-library/react';

import { BackendContext, BackendProvider } from './BackendProvider';
import { useContext } from 'react';
import userEvent from '@testing-library/user-event';

const TestComponent = () => {
  const { backend, setBackend } = useContext(BackendContext);
  return (
    <div>
      backend: {backend}
      <button onClick={() => (backend === 'express' ? setBackend('laravel') : setBackend('express'))}>Toggle</button>
    </div>
  );
};

describe('BackendProvider', () => {
  test('renders', async () => {
    render(
      <BackendProvider>
        <div>foo</div>
      </BackendProvider>,
    );

    expect(screen.getByText('foo')).toBeInTheDocument();
  });

  test('displays and updates the current backend', async () => {
    const mockReload = vi.fn();

    vi.stubGlobal('location', {
      ...window.location,
      reload: mockReload,
    });

    render(
      <BackendProvider>
        <TestComponent />
      </BackendProvider>,
    );

    expect(window.localStorage.getItem('backend')).toBeNull();
    expect(screen.getByText('backend: express')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(mockReload).toHaveBeenCalled();
    expect(window.localStorage.getItem('backend')).toBe('laravel');
  });
});
