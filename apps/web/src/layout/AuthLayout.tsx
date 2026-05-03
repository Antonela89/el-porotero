import { ReactNode } from 'react';

export const AuthLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="auth-page">
            <div className="auth-container">
                <header className="auth-header">
                    <h1>El Porotero</h1>
                    <p >Anotador de timba profesional</p>
                </header>
                {children}
            </div>
        </div>
    );
};