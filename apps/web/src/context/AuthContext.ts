import { createContext, useContext } from 'react';
import type { UserDTO } from '@el-porotero/shared';

export interface AuthUser extends Omit<UserDTO, 'password'> {
    id: string;
}

interface AuthContextType {
    user: AuthUser | null;
    login: (token: string, userData: AuthUser) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};