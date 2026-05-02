// apps/web/src/components/AddCantoModal.tsx
import * as Dialog from '@radix-ui/react-dialog';
import { X, Megaphone } from 'lucide-react';
import { useBarsigaLogic } from '@/hooks/useBarsigaLogic';
import api from '@/api/axios';
import axios from 'axios';
import { IMatch } from '@el-porotero/shared';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    match: IMatch;
    playerName: string | null;
    onSuccess: (updatedMatch: IMatch) => void;
}

export const AddCantoModal = ({ isOpen, onClose, match, playerName, onSuccess }: Props) => {
    const { CANTOS } = useBarsigaLogic();

    const handleCanto = async (points: number) => {
        if (!playerName) return;
        try {
            const { data } = await api.post(`/matches/${match._id}/round/canto`, {
                playerName,
                points
            });
            onSuccess(data);
            onClose();
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                alert("No se pudo registrar el canto");
            }
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-surface p-6 rounded-4xl shadow-2xl border border-white/10 z-50">
                    <div className="flex justify-between items-center mb-6">
                        <Dialog.Title className="text-xl font-display font-bold text-primary flex items-center gap-2">
                            <Megaphone size={20} /> Canto de {playerName}
                        </Dialog.Title>
                        <button onClick={onClose} className="p-2 text-text-muted"><X size={20} /></button>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {CANTOS.map((canto) => (
                            <button
                                key={canto.id}
                                onClick={() => handleCanto(canto.points)}
                                className="flex items-center justify-between p-4 bg-background/40 hover:bg-primary/10 border border-white/5 rounded-2xl transition-all group active:scale-95"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-surface rounded-xl flex items-center justify-center p-0-5 border border-white/5 group-hover:border-primary/30">
                                        <img
                                            src={canto.icon}
                                            alt={canto.label}
                                            className="w-full h-full object-contain filter invertBrightness"
                                            style={{ filter: 'invert(1) brightness(1.5)' }}
                                        />
                                    </div>
                                    <span className="font-bold text-text-main group-hover:text-primary">{canto.label}</span>
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