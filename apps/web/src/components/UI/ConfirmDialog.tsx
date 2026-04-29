import * as Dialog from '@radix-ui/react-dialog';
import { AlertTriangle } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
}

export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, description }: Props) => (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
        <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-md z-100" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-surface p-6 rounded-3xl shadow-2xl border border-white/10 z-101">
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-12 h-12 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <Dialog.Title className="text-xl font-bold text-text-main">{title}</Dialog.Title>
                        <Dialog.Description className="text-sm text-text-muted mt-2">
                            {description}
                        </Dialog.Description>
                    </div>
                    <div className="flex gap-3 w-full mt-2">
                        <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-background text-text-muted font-bold">
                            Cancelar
                        </button>
                        <button
                            onClick={() => { onConfirm(); onClose(); }}
                            className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-bold shadow-lg shadow-orange-500/20"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
);