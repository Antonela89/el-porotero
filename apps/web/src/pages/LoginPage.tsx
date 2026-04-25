import React, { useState } from 'react';
import { useAuth } from '@/context';
import api from '@/api/axios';
import axios from 'axios';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/login', { email, password });
            login(data.token, data.user);
        } catch (error: unknown) {
            let message = "Ocurrió un error inesperado";

            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || error.message;
            } else if (error instanceof Error) {
                message = error.message;
            }

            alert(`Error al iniciar sesión: ${message}`);
        }
    }

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h1 className="auth-title">El Porotero</h1>

                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-input"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-input"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn-auth">
                    Entrar a la Timba
                </button>

                <p className="auth-link">
                    ¿No tenés cuenta? <span>Registrate acá</span>
                </p>
            </form>
        </div>
    );
};