import { createContext, PropsWithChildren, useState } from 'react';

const BACKEND_LOCAL_STORAGE_KEY = 'backend';

export type Backend = 'express' | 'laravel';

interface BackendContextValues {
  backend: Backend;
  setBackend: (backend: Backend) => void;
}

const DEFAULT_BACKEND_CONTEXT: BackendContextValues = {
  backend: 'express',
  setBackend: () => {},
};

// eslint-disable-next-line react-refresh/only-export-components
export const BackendContext = createContext<BackendContextValues>(DEFAULT_BACKEND_CONTEXT);

export const BackendProvider = ({ children }: PropsWithChildren) => {
  const [backend] = useState<Backend>(() => {
    return (localStorage.getItem(BACKEND_LOCAL_STORAGE_KEY) as Backend) || 'express';
  });

  const setBackend = (nextBackend: Backend) => {
    localStorage.setItem(BACKEND_LOCAL_STORAGE_KEY, nextBackend);
    // Reload the application to demonstrate the route loader using the new backend
    window.location.reload();
  };

  return <BackendContext.Provider value={{ backend, setBackend }}>{children}</BackendContext.Provider>;
};
