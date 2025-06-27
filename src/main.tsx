import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Home } from './routes';
import { Footer, Header } from './common/components';
import { GqlProvider } from './common/providers';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router';
import { MusicTable } from './routes/music-table/MusicTable';
import { preloadQuery } from './common/utilities';
import { GET_ALBUMS } from './routes/music-table/queries/albums.queries';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <GqlProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className="flex w-full flex-1 max-w-screen-xl mx-auto px-6">
            <Outlet />
          </div>
          <Footer />
        </div>
      </GqlProvider>
    ),
    children: [
      { element: <Home />, index: true },
      {
        path: 'albums',
        element: <MusicTable />,
        loader: async () => {
          return { albums: preloadQuery(GET_ALBUMS, { fetchPolicy: 'network-only' }) };
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
