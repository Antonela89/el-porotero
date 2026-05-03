// apps/web/src/layout/AppLayout.tsx
import { ReactNode } from 'react';
import { useAuth } from '@/context';
import { LogOut, ArrowLeft, BarChart2, Home } from 'lucide-react'; // Importamos Home
import { useNavigate, useLocation } from 'react-router-dom';
import { IconButton } from '@/components';

export const AppLayout = ({ children }: { children: ReactNode }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Detectamos en qué página estamos
    const isDashboard = location.pathname === '/';
    const isStatsPage = location.pathname === '/stats';
    const showBack = !isDashboard; // Mostramos flecha de volver si no es el home

    return (
        <div className="layout-root">
            {/* HEADER GLOBAL */}
            <header className="layout-header">
                <div className="actions-container">
                    {showBack && (
                        <IconButton
                            icon={<ArrowLeft />}
                            onClick={() => navigate(-1)}
                            title={isStatsPage ? "Inicio" : "Estadísticas"}
                        />

                    )}
                    <span className="brand-logo">
                        El Porotero
                    </span>
                </div>

                <div className="actions-container">
                    <span className='text-text-muted'>{user?.username}</span>
                    {/* --- BOTÓN DINÁMICO: STATS o HOME --- */}

                    <IconButton
                        icon={isStatsPage ? <Home /> : <BarChart2 />}
                        onClick={() => navigate(isStatsPage ? '/' : '/stats')}
                        title={isStatsPage ? "Inicio" : "Estadísticas"}
                    />

                    <IconButton
                        icon={<LogOut />}
                        variant="warning"
                        onClick={logout}
                        title="Cerrar Sesión"
                    />
                </div>
            </header>

            <main className="layout-main">
                {children}
            </main>
        </div>
    );
};