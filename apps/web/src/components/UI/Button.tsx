interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'warning' | 'success' | 'info';
    size?: 'sx' | 'md' | 'lg' | 'icon';
    loading?: boolean;
}

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    loading,
    className = '',
    disabled = false,
    ...props
}: ButtonProps) => {

    const variantClass = `btn-${variant}`;
    const sizeClass = size === 'icon' ? 'btn-icon-sz' : `btn-${size}`;

    return (
        <button
            type="button"
            className={`${variantClass} ${sizeClass} ${className}`}
            disabled={loading || disabled}
            {...props}
        >
            {loading ? "Cargando..." : children}
        </button>
    );
};