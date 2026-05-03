import { AuthProvider } from '@/context/AuthProvider';
import { AppRouter } from '@/routes/AppRouter';
import { Toaster } from 'sonner';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <Toaster position="top-center" expand={true} richColors theme="dark" />
    </AuthProvider>
  );
}

export default App;