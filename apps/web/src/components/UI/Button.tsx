interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'ghost' | 'danger' | 'warning';
    size?: 'md' | 'lg';
    loading?: boolean;
}

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    loading,
    className = '',
    ...props
}: ButtonProps) => {
    return (
        <button
            className={`btn-${variant} btn-${size} ${className}`}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading ? "Cargando..." : children}
        </button>
    );
};