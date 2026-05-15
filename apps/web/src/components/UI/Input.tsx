import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string; // Ahora es opcional
    containerClassName?: string;
    className?: string
}

export const Input = ({ label, containerClassName = "form-group", className, ...props }: InputProps) => (
    <div className={containerClassName}>
        {label && <label className="form-label">{label}</label>}
        <input className={`form-input ${className}`} {...props} />
    </div>
);