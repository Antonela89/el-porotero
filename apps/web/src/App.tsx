import { AuthProvider } from '@/context/AuthProvider';
import { AppRouter } from '@/routes/AppRouter';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;