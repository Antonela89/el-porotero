import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context';
import { Input, Button } from '@/components';
import { notify, handleApiError } from '@/utils';
import api from '@/api/axios';

interface AuthFormProps {
    mode: 'login' | 'register';
}

export const AuthForm = ({ mode }: AuthFormProps) => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const isLogin = mode === 'login';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'username' ? value.toUpperCase() : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const endpoint = isLogin ? 'auth/login' : 'auth/register';
            const { data } = await api.post(endpoint, formData);

            if (isLogin) {
                login(data.token, data.user);
                notify.success(`¡Hola de nuevo, ${data.user.username}!`);
                navigate('/');
            } else {
                notify.info("Registro exitoso. ¡Ya podés loguearte!");
                navigate('/login');
            }
        } catch (error) {
            handleApiError(error, "No pudimos completar la autenticación");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="auth-card" onSubmit={handleSubmit}>
            <h2 className="auth-title">
                {isLogin ? '¡Bienvenido!' : 'Crea tu perfil'}
            </h2>

            {!isLogin && (
                <Input
                    label="Usuario"
                    name="username"
                    placeholder="EJ: JUAN_PÉREZ"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
            )}

            <Input
                label="Email"
                type="email"
                name="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
            />

            <Input
                label="Contraseña"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
            />

            <div className="flex flex-col gap-4 mt-2">
                <Button
                    type="submit"
                    size="lg"
                    loading={loading}
                >
                    {loading ? 'Cargando...' : isLogin ? 'Entrar a la Timba' : 'Registrarme'}
                </Button>

                <p className="auth-link">
                    {isLogin ? (
                        <>
                            ¿No tenés cuenta?{' '}
                            <Link to="/register"><span>Registrate acá</span></Link>
                        </>
                    ) : (
                        <>
                            ¿Ya tenés cuenta?{' '}
                            <Link to="/login"><span>Iniciá sesión</span></Link>
                        </>
                    )}
                </p>
            </div>
        </form>
    );
};