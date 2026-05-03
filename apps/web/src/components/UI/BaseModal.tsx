import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    maxWidth?: string; // Para modales mas anchos
}

export const BaseModal = ({ isOpen, onClose, title, children, footer, maxWidth = 'max-w-md' }: BaseModalProps) => (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
        <Dialog.Portal>
            <Dialog.Overlay className="modal-overlay" />
            <Dialog.Content className={`modal-content-anotador ${maxWidth}`}>
                <header className="p-6 pb-2 flex justify-between items-center shrink-0">
                    <Dialog.Title className="text-xl font-display font-bold">
                        {title}
                    </Dialog.Title>
                    <IconButton icon={<X size={20} />} title="Cerrar" onClick={onClose} />
                </header>

                <Dialog.Description className="sr-only">{title}</Dialog.Description>

                <div className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar">
                    {children}
                </div>

                {footer && (
                    <footer className="p-6 pt-2 border-t border-white/5 bg-surface shrink-0">
                        {footer}
                    </footer>
                )}
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
);