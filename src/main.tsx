import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Home } from './routes';
import { GqlProvider } from './common/providers';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { MusicTableWrapper } from './routes/music-table/MusicTable';
import { createPreloadQueryFor } from './common/utilities';
import { GET_ALBUMS } from './routes/music-table/queries/albums.queries';
import { AppLayout } from './common/components';
import { TypingDemo } from './routes/typing-demo/TypingDemo';
import { Backend, BackendProvider } from './common/providers/BackendProvider';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <BackendProvider>
        <GqlProvider>
          <AppLayout />
        </GqlProvider>
      </BackendProvider>
    ),
    children: [
      { element: <Home />, index: true },
      {
        path: 'albums',
        element: <MusicTableWrapper />,
        loader: async () => {
          const backend = (localStorage.getItem('backend') as Backend) ?? 'express';
          // Normally this would be exported from the gql file. For this example, it's being dynamically created
          const preloadQuery = createPreloadQueryFor(backend);
          return preloadQuery(GET_ALBUMS, { fetchPolicy: 'network-only' });
        },
      },
      {
        path: 'totd',
        element: <TypingDemo />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
