import { ReactNode } from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: ReactNode;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'warning' | 'success';
    className?: string;
    title: string;
}

export const IconButton = ({ icon, onClick, variant = 'ghost', className = '', title, ...props }: IconButtonProps) => {

    return (
        <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className={`btn-${variant} btn-icon-sz ${className}`}
            title={title}
            {...props}
        >
            {icon}
        </button>
    );
};