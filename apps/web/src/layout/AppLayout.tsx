import { ReactNode } from 'react';
import { useAuth } from '@/context';
import { LogOut } from 'lucide-react';

export const AppLayout = ({ children }: { children: ReactNode }) => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header Global */}
            <header className="px-6 py-4 flex justify-between items-center max-w-5xl mx-auto w-full border-b border-white/5">
                <span className="font-display font-bold text-primary tracking-tighter text-xl">
                    El Porotero
                </span>
                <div className="flex items-center gap-4">
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