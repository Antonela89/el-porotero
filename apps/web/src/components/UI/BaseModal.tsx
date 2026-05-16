import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    maxWidth?: string; 
}

export const BaseModal = ({ isOpen, onClose, title, children, footer, maxWidth = '' }: BaseModalProps) => (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
        <Dialog.Portal>
            <Dialog.Overlay className="modal-overlay" />
            <Dialog.Content className={`modal-panel ${maxWidth}`}>
                <header className="modal-header">
                    <Dialog.Title className="text-lg font-display font-bold uppercase tracking-tight">
                        {title}
                    </Dialog.Title>
                    <IconButton icon={<X size={20} />} title="Cerrar" onClick={onClose} />
                </header>

                <Dialog.Description className="sr-only">{title}</Dialog.Description>

                <div className="modal-body">
                    {children}
                </div>

                {footer && (
                    <footer className="modal-footer">
                        {footer}
                    </footer>
                )}
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
);