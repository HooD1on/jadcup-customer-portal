import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { HomePage } from '../features/home/HomePage';
import { LoginPage } from '../features/auth/LoginPage';
import { ApplyPage } from '../features/apply/ApplyPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { CatalogPage } from '../features/catalog/CatalogPage';  
import { ProductDetailsPage } from '../features/catalog/ProductDetailsPage';
import { OrderListPage } from '../features/orders/OrderListPage';
import { OrderDetailPage } from '../features/orders/OrderDetailPage';
import { DemoPage } from '../features/demo/DemoPage';
import { NotFoundPage } from '../features/NotFoundPage';
import { ApplicationStatusPage } from '../features/auth/ApplicationStatusPage';
import { RequireApprovedAccount, RequirePortalSession } from '../features/auth/RouteGuards';
import { PackagingFinderPage } from '../features/start/PackagingFinderPage';
import { ProductExplorerPage } from '../features/products/ProductExplorerPage';
import { SampleRequestPage } from '../features/sample/SampleRequestPage';
import { HelpPage } from '../features/help/HelpPage';
import { QuotationPage } from '../features/quotation/QuotationPage';

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/start', element: <PackagingFinderPage /> },
      { path: '/products', element: <ProductExplorerPage /> },
      { path: '/sample', element: <SampleRequestPage /> },
      { path: '/help', element: <HelpPage /> },
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
      { path: '/catalog/products/:baseProductId', element: <ProductDetailsPage /> },
      { path: '/quotations', element: <QuotationPage /> },
    ],
  },
  {
    element: <PublicLayout />,
    children: [
      { path: '*', element: <NotFoundPage /> },
      
    ],
  },
]);
