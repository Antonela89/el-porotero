import { AuthProvider } from '@/context/AuthProvider';
import { AppRouter } from '@/routes/AppRouter';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { handleApiError } from '@/utils'
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false, // Evita re-fetchings molestos al cambiar de pestaña
      staleTime: 1000 * 60 * 5,    // La data se considera "fresca" por 5 minutos
    },
    mutations: {
      onError: (error) => handleApiError(error, "Ocurrió un error inesperado"),
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
        <Toaster position="top-center" expand={true} richColors theme="dark" />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;