import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export const Input = ({ label, ...props }: InputProps) => (
    <div className="form-group">
        <label className="form-label">{label}</label>
        <input className="form-input" {...props} />
    </div>
);