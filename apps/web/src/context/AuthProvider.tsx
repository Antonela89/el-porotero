import React, { useState } from 'react';
import { AuthContext, AuthUser } from './AuthContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(() => {
        const savedUser = localStorage.getItem('user');
        // Si existe, lo parseamos y este será el valor inicial real (sin doble render)
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = (token: string, userData: AuthUser) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};