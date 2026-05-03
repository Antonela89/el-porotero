import * as Dialog from '@radix-ui/react-dialog';
import { X, Megaphone } from 'lucide-react';
import { useBarsigaLogic } from '@/hooks';
import { IconButton } from '@/components';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    playerName: string | null;
    onConfirm: (points: number) => void;
}

export const AddCantoModal = ({ isOpen, onClose, playerName, onConfirm }: Props) => {
    const { CANTOS } = useBarsigaLogic();

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-surface p-6 rounded-4xl shadow-2xl border border-white/10 z-50">

                    <div className="flex justify-between items-center mb-6">
                        <Dialog.Title className="text-xl font-display font-bold text-primary flex items-center gap-2">
                            <Megaphone size={20} /> Canto de {playerName}
                        </Dialog.Title>
                        <IconButton
                            icon={<X size={20} />}
                            title="Cerrar"
                            onClick={onClose}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {CANTOS.map((canto) => (
                            <button
                                key={canto.id}
                                onClick={() => {
                                    onConfirm(canto.points);
                                    onClose();
                                }}
                                className="flex items-center justify-between p-4 bg-background/40 hover:bg-primary/10 border border-white/5 rounded-2xl transition-all group active:scale-95"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-surface rounded-xl flex items-center justify-center p-1 border border-white/5 group-hover:border-primary/30 transition-colors">
                                        <img
                                            src={canto.icon}
                                            alt={canto.label}
                                            className="w-full h-full object-contain card-icon-filter"
                                        />
                                    </div>
                                    <span className="font-bold text-text-main group-hover:text-primary transition-colors">
                                        {canto.label}
                                    </span>
                                </div>
                                <span className="bg-primary text-background font-black px-3 py-1 rounded-lg text-xs">
                                    +{canto.points}
                                </span>
                            </button>
                        ))}
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};