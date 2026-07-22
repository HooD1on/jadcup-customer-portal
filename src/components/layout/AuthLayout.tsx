import { Outlet } from 'react-router-dom';
import { AuthHeader } from './AuthHeader';
import { Footer } from './Footer';

export function AuthLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <AuthHeader />
      <Outlet />
      <Footer />
    </div>
  );
}
