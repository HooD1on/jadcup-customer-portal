import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider } from './features/auth/AuthContext';
import { LanguageProvider } from './features/language/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
