import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { AuthLayout } from '../components/layout/AuthLayout';
import { HomePage } from '../features/home/HomePage';
import { LoginPage } from '../features/auth/LoginPage';
import { ApplyPage } from '../features/apply/ApplyPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { OrderListPage } from '../features/orders/OrderListPage';
import { OrderDetailPage } from '../features/orders/OrderDetailPage';
import { DemoPage } from '../features/demo/DemoPage';
import { NotFoundPage } from '../features/NotFoundPage';

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/apply', element: <ApplyPage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/orders', element: <OrderListPage /> },
      { path: '/orders/:orderId', element: <OrderDetailPage /> },
      { path: '/_demo', element: <DemoPage /> },
    ],
  },
  {
    element: <PublicLayout />,
    children: [
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
