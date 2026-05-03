import * as Dialog from '@radix-ui/react-dialog';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components';

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
            <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-md z-100 animate-in fade-in" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-surface p-6 rounded-3xl shadow-2xl border border-white/10 z-101">
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-12 h-12 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <Dialog.Title className="text-xl font-display font-bold text-text-main">{title}</Dialog.Title>
                        <Dialog.Description className="text-sm text-text-muted mt-2">
                            {description}
                        </Dialog.Description>
                    </div>
                    <div className="flex gap-3 w-full mt-2">
                        <Button variant="ghost" className="flex-1" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button variant="danger" className="flex-1" onClick={() => { onConfirm(); onClose(); }}>
                            Eliminar
                        </Button>
                    </div>
                </div>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
);