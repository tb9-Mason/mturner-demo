import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Home } from './routes';
import { GqlProvider } from './common/providers';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { MusicTableWrapper } from './routes/music-table/MusicTable';
import { preloadQuery } from './common/utilities';
import { GET_ALBUMS } from './routes/music-table/queries/albums.queries';
import { AppLayout } from './common/components';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <GqlProvider>
        <AppLayout />
      </GqlProvider>
    ),
    children: [
      { element: <Home />, index: true },
      {
        path: 'albums',
        element: <MusicTableWrapper />,
        loader: async () => {
          return preloadQuery(GET_ALBUMS, { fetchPolicy: 'network-only' });
        },
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
