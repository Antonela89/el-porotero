import { ReactNode } from 'react';
import { Bean } from 'lucide-react';

export const AuthLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="auth-page">
            <div className="auth-container">
                <header className="auth-header">
                    <div className="flex items-center gap-2 p-2">
                        <div className="p-4 bg-primary/10 rounded-full mb-2 shadow-primary-glow">
                            <Bean size={48} className="text-primary" strokeWidth={2.5} />
                        </div>
                        <div className='flex flex-col items-center'>
                            <h1>El Porotero</h1>
                            <p >Anotador de timba profesional</p>
                        </div>
                    </div>
                </header>
                {children}
            </div>
        </div>
    );
};