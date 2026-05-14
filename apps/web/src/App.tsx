import { AuthProvider } from '@/context/AuthProvider';
import { AppRouter } from '@/routes/AppRouter';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { handleApiError } from '@/utils'
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false, // Evita re-fetchings molestos al cambiar de pestaña
      staleTime: 1000 * 60 * 5,    // La data se considera "fresca" por 5 minutos
      gcTime: 1000 * 60 * 60 * 24, // Mantener en cache por 24 horas
    },
    mutations: {
      onError: (error) => handleApiError(error, "Error de sincronización. Se guardó localmente."),
    },
  },
});

const localStoragePersister = createAsyncStoragePersister({
  storage: window.localStorage,
  throttleTime: 1000,
  serialize: (data) => JSON.stringify(data),
  deserialize: (data) => JSON.parse(data),
});

persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  maxAge: 1000 * 60 * 60 * 24, 
  buster: 'v2'
});


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
        <Toaster position="top-center" expand={true} richColors theme="dark" closeButton/>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;