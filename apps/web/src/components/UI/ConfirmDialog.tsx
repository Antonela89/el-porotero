import { AlertTriangle } from 'lucide-react';
import { Button, BaseModal } from '@/components';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
}

export const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description
}: ConfirmDialogProps) => {

    const modalFooter = (
        <div className="confirm-dialog-footer">
            <Button
                variant="ghost"
                className="flex-1"
                onClick={onClose}
            >
                Cancelar
            </Button>
            <Button
                variant="danger"
                className="flex-1"
                onClick={() => {
                    onConfirm();
                    onClose();
                }}
            >
                Eliminar
            </Button>
        </div>
    );

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            footer={modalFooter}
            maxWidth="max-w-sm"
        >
            <div className="confirm-dialog-content">
                <div className="confirm-dialog-icon-wrapper">
                    <AlertTriangle size={24} />
                </div>
                <p className="confirm-dialog-description">
                    {description}
                </p>
            </div>
        </BaseModal>
    );
};