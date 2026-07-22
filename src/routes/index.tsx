import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { AuthLayout } from '../components/layout/AuthLayout';
import { HomePage } from '../features/home/HomePage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { OrderListPage } from '../features/orders/OrderListPage';
import { OrderDetailPage } from '../features/orders/OrderDetailPage';
import { NotFoundPage } from '../features/NotFoundPage';

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/orders', element: <OrderListPage /> },
      { path: '/orders/:orderId', element: <OrderDetailPage /> },
    ],
  },
  {
    // Catch-all 404 — uses public layout
    element: <PublicLayout />,
    children: [
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
