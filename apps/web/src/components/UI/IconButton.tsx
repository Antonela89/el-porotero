interface IconButtonProps {
    icon: React.ReactNode;
    onClick: () => void;
    variant?: 'primary' | 'danger' | 'warning' | 'ghost';
    className?: string;
}

export const IconButton = ({ icon, onClick, variant = 'ghost', className = '' }: IconButtonProps) => {
    const variants = {
        ghost: 'bg-surface text-text-muted hover:text-white',
        primary: 'bg-primary text-background hover:bg-primary-dark',
        danger: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white',
        warning: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-white'
    };

    return (
        <button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className={`p-3 rounded-full transition-all active:scale-90 ${variants[variant]} ${className}`}
        >
            {icon}
        </button>
    );
};