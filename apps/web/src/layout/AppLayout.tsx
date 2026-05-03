// apps/web/src/layout/AppLayout.tsx
import { ReactNode } from 'react';
import { useAuth } from '@/context';
import { LogOut, ArrowLeft, BarChart2, Home } from 'lucide-react'; // Importamos Home
import { useNavigate, useLocation } from 'react-router-dom';

export const AppLayout = ({ children }: { children: ReactNode }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Detectamos en qué página estamos
    const isDashboard = location.pathname === '/';
    const isStatsPage = location.pathname === '/stats';
    const showBack = !isDashboard; // Mostramos flecha de volver si no es el home

    return (
        <div className="flex flex-col h-dvh bg-background text-text-main overflow-hidden font-body">
            {/* HEADER GLOBAL */}
            <header className="px-6 py-4 flex justify-between items-center border-b border-white/5 bg-surface/20 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-4">
                    {showBack && (
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 -ml-2 text-text-muted hover:text-white transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <span className="font-display font-bold text-primary tracking-tighter text-xl">
                        El Porotero
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <span className='text-text-muted'>{user?.username}</span>
                    {/* --- BOTÓN DINÁMICO: STATS o HOME --- */}
                    {isStatsPage ? (
                        <button
                            onClick={() => navigate('/')}
                            className="p-3 bg-surface rounded-2xl text-text-muted hover:text-primary transition-all border border-white/5 active:scale-90"
                            title="Volver al Dashboard"
                        >
                            <Home size={24} />
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/stats')}
                            className="p-3 bg-surface rounded-2xl text-text-muted hover:text-primary transition-all border border-white/5 active:scale-90"
                            title="Ver Mis Estadísticas"
                        >
                            <BarChart2 size={24} />
                        </button>
                    )}

                    <button
                        onClick={logout}
                        className="p-3 bg-surface rounded-2xl text-text-muted hover:text-warning transition-all border border-white/5 active:scale-90"
                        title="Cerrar Sesión"
                    >
                        <LogOut size={24} />
                    </button>
                </div>
            </header>

            <main className="flex-1 flex flex-col overflow-hidden relative px-6 py-4">
                {children}
            </main>
        </div>
    );
};