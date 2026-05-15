import { ReactNode } from 'react';
import { useAuth } from '@/context';
import { LogOut, BarChart2, Home } from 'lucide-react'; // Importamos Home
import { useNavigate, useLocation } from 'react-router-dom';
import { IconButton } from '@/components';

export const AppLayout = ({ children }: { children: ReactNode }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isActionPage = location.pathname.startsWith('/match/') || location.pathname.startsWith('/new-match');
    const isStatsPage = location.pathname === '/stats';


    return (
        <div className="layout-root">
            {/* HEADER GLOBAL */}
            {!isActionPage && (
                <header className="layout-header">
                    <div className="header-left">
                        <span className="brand-logo">El Porotero</span>
                    </div>
                    <div className="header-right">
                        <span className="user-tag">{user?.username}</span>

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
            )}

            <main className={`layout-main ${isActionPage ? 'is-action-mode' : ''}`}>
                {isActionPage ? (
                    children
                ) : (
                    <div className="main-scroller">
                        {children}
                    </div>
                )}
            </main>
        </div>
    );
};