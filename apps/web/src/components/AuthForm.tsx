
interface AuthFormProps {
    mode: 'login' | 'register';
}

export const AuthForm = ({ mode }: AuthFormProps) => {
    return (
        <div className="auth-card">
            <h1 className="auth-title">
                {mode === 'login' ? 'Bienvenido' : 'Crear Cuenta'}
            </h1>

            {mode === 'register' && (
                <div className="form-group">
                    <label className="form-label">Nombre de Usuario</label>
                    <input className="form-input" />
                </div>
            )}

            <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" />
            </div>

            {/* ... etc ... */}

            <button className="btn-auth">
                {mode === 'login' ? 'Entrar' : 'Registrarse'}
            </button>
        </div>
    );
};