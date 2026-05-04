interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'warning' | 'success';
    size?: 'md' | 'lg' | 'icon';
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

    const variantClass = `btn-${variant}`;
    const sizeClass = size === 'icon' ? 'btn-icon-sz' : `btn-${size}`;

    return (
        <button
            className={`${variantClass} ${sizeClass} ${className}`}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading ? "Cargando..." : children}
        </button>
    );
};