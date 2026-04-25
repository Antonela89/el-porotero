import { ReactNode } from 'react';

export const AuthLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="auth-page">
            <div className="flex flex-col items-center gap-8 w-full max-w-md">
                <header className="text-center">
                    <h1 className="text-5xl text-primary mb-2">El Porotero</h1>
                    <p className="text-text-muted">Anotador de timba profesional</p>
                </header>
                {children}
            </div>
        </div>
    );
};