import { Outlet, useNavigation } from 'react-router';
import { Header, Footer, RouteLoadingIndicator } from '..';
import { ToastContainer } from 'react-toastify';

export const AppLayout = () => {
  const navigation = useNavigation();

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col min-h-screen">
        <Header />
        {navigation.state === 'loading' && <RouteLoadingIndicator />}
        <div className="flex w-full flex-1 max-w-screen-xl mx-auto px-6">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
};
