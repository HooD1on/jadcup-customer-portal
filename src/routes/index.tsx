import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { HomePage } from '../features/home/HomePage';
import { LoginPage } from '../features/auth/LoginPage';
import { ApplyPage } from '../features/apply/ApplyPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { CatalogPage } from '../features/catalog/CatalogPage';  
import { OrderListPage } from '../features/orders/OrderListPage';
import { OrderDetailPage } from '../features/orders/OrderDetailPage';
import { DemoPage } from '../features/demo/DemoPage';
import { NotFoundPage } from '../features/NotFoundPage';
import { ApplicationStatusPage } from '../features/auth/ApplicationStatusPage';
import { RequireApprovedAccount, RequirePortalSession } from '../features/auth/RouteGuards';

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/apply', element: <ApplyPage /> },
      {
        path: '/application-status',
        element: (
          <RequirePortalSession>
            <ApplicationStatusPage />
          </RequirePortalSession>
        ),
      },
    ],
  },
  {
    element: <RequireApprovedAccount />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      
      { path: '/orders', element: <OrderListPage /> },
      { path: '/orders/:orderId', element: <OrderDetailPage /> },
      { path: '/_demo', element: <DemoPage /> },
      { path: '/catalog', element: <CatalogPage />},
    ],
  },
  {
    element: <PublicLayout />,
    children: [
      { path: '*', element: <NotFoundPage /> },
      
    ],
  },
]);
