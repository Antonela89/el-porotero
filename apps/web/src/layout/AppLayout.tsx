import { ReactNode } from 'react';
import { useAuth } from '@/context';
import { LogOut, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AppLayout = ({ children }: { children: ReactNode }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header Global */}
            <header className="px-6 py-4 flex justify-between items-center max-w-5xl mx-auto w-full border-b border-white/5">
                <span className="font-display font-bold text-primary tracking-tighter text-xl">
                    El Porotero
                </span>
                <div className="flex items-center gap-4">
                    {/* --- BOTÓN DE ESTADÍSTICAS --- */}
                    <button
                        onClick={() => navigate('/stats')}
                        className="p-3 bg-surface rounded-2xl text-text-muted hover:text-primary transition-all border border-white/5 active:scale-90"
                        title="Mis Estadísticas"
                    >
                        <BarChart2 size={24} />
                    </button>

                    <span className="text-xs text-text-muted">{user?.username}</span>
                    <button onClick={logout} className="text-text-muted hover:text-warning transition-colors">
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            {/* Contenedor de Contenido con Márgenes y Padding */}
            <main className="flex-1 w-full h-dvh max-w-5xl mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
};