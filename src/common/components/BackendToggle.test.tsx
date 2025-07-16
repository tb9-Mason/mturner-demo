import { render, screen } from '@testing-library/react';

import { BackendToggle } from './BackendToggle';
import { BackendContext } from '../providers/BackendProvider';
import userEvent from '@testing-library/user-event';

const mockSetBackend = vi.fn();
describe('BackendToggle', () => {
  test('renders', async () => {
    render(
      <BackendContext.Provider value={{ backend: 'express', setBackend: mockSetBackend }}>
        <BackendToggle isSupported />
      </BackendContext.Provider>,
    );

    expect(Screen.getTextWithBackend('express')).toBeInTheDocument();
  });

  test('calls setBackend on button click', async () => {
    render(
      <BackendContext.Provider value={{ backend: 'laravel', setBackend: mockSetBackend }}>
        <BackendToggle isSupported />
      </BackendContext.Provider>,
    );
    expect(Screen.getTextWithBackend('laravel')).toBeInTheDocument();

    await userEvent.click(Screen.button);
    expect(mockSetBackend).toHaveBeenCalledWith('express');
  });
});

const Screen = {
  get button() {
    return screen.getByRole('button', { name: 'Toggle Backend' });
  },
  getTextWithBackend(backend: string) {
    return screen.getByText(
      `You are currently using the ${backend} backend. Use the button below to see this feature using a different server.`,
    );
  },
};
