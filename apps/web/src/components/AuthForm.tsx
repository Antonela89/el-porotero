import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

    const isLogin = mode === 'login';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const endpoint = mode === 'login' ? 'auth/login' : 'auth/register';
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
                {isLogin ? '¡Bienvenido de nuevo!' : 'Crea tu perfil'}
            </h2>

            {!isLogin && (
                <div className="form-group">
                    <label className="form-label">Usuario</label>
                    <input
                        className="form-input"
                        onChange={(e) => setFormData({ ...formData, username: e.target.value.toUpperCase() })}
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

            <div className="flex flex-col gap-4 mt-2">
                <button type="submit" className="btn-auth">
                    {isLogin ? 'Entrar a la Timba' : 'Registrarme'}
                </button>

                <p className="text-sm text-center text-text-muted">
                    {isLogin ? (
                        <>
                            ¿No tenés cuenta?{' '}
                            <Link to="/register" className="text-primary font-bold hover:underline">
                                Registrate acá
                            </Link>
                        </>
                    ) : (
                        <>
                            ¿Ya tenés cuenta?{' '}
                            <Link to="/login" className="text-primary font-bold hover:underline">
                                Iniciá sesión
                            </Link>
                        </>
                    )}
                </p>
            </div>
        </form>
    );
};