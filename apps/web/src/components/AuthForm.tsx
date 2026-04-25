import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context';
import api from '@/api/axios';
import axios from 'axios';

interface AuthFormProps {
    mode: 'login' | 'register';
}

export const AuthForm = ({ mode }: AuthFormProps) => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const endpoint = mode === 'login' ? 'api/auth/login' : 'api/auth/register';
            const { data } = await api.post(endpoint, formData);

            if (mode === 'login') {
                login(data.token, data.user);
                navigate('/'); // Al dashboard
            } else {
                alert("Registro exitoso, ahora inicia sesión");
                navigate('/login');
            }
        } catch (error) {
            let msg = "Error en la operación";
            if (axios.isAxiosError(error)) msg = error.response?.data?.message || error.message;
            alert(msg);
        }
    };

    return (
        <form className="auth-card" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-center">
                {mode === 'login' ? '¡Bienvenido de nuevo!' : 'Crea tu perfil'}
            </h2>

            {mode === 'register' && (
                <div className="form-group">
                    <label className="form-label">Usuario</label>
                    <input
                        className="form-input"
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                    />
                </div>
            )}

            <div className="form-group">
                <label className="form-label">Email</label>
                <input
                    type="email"
                    className="form-input"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
            </div>

            <div className="form-group">
                <label className="form-label">Contraseña</label>
                <input
                    type="password"
                    className="form-input"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />
            </div>

            <button type="submit" className="btn-auth">
                {mode === 'login' ? 'Entrar a la Timba' : 'Registrarme'}
            </button>
        </form>
    );
};