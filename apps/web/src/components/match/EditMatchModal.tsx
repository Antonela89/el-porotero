import { useState } from 'react';
import { IMatch, IPlayer } from '@el-porotero/shared';
import { Save, X } from 'lucide-react';
import { BaseModal, Button, Input } from '@/components';
import { useMatchActions } from '@/hooks';

interface EditMatchModalProps {
    match: IMatch;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (updatedMatch: IMatch) => void;
}

export const EditMatchModal = ({ match, isOpen, onClose, onSuccess }: EditMatchModalProps) => {
    const { updateMatch } = useMatchActions(match._id!);

    const [players, setPlayers] = useState<IPlayer[]>([...match.players]);
    const [status, setStatus] = useState(match.status);

    const handleSave = () => {
        updateMatch.mutate(
            { players, status },
            {
                onSuccess: (data) => {
                    onSuccess(data);
                    onClose();
                }
            }
        );
    };

    const modalFooter = (
        <div className="edit-match-footer">
            <Button
                variant="ghost"
                className="btn-footer-confirm"
                onClick={onClose}
            >
                <X size={20} /> Cancelar
            </Button>
            <Button
                variant="primary"
                className="btn-footer-confirm"
                onClick={handleSave}
                loading={updateMatch.isPending}
                disabled={updateMatch.isPending}
            >
                <Save size={20} /> Guardar
            </Button>
        </div>
    );

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Ajustes de la Mesa"
            footer={modalFooter}
            maxWidth="max-w-sm"
        >
            <div className="edit-match-form">
                <label className="label-caps">Nombres de Jugadores</label>
                <div className="flex flex-col gap-3">
                    {players.map((p, i) => (
                        <Input
                            key={i}
                            value={p.name}
                            onChange={(e) => {
                                const newP = [...players];
                                newP[i] = { ...newP[i], name: e.target.value.toUpperCase() };
                                setPlayers(newP);
                            }}
                            placeholder={`Jugador ${i + 1}`}
                        />
                    ))}
                </div>

                <label className="label-caps mt-4">Estado de la Partida</label>
                <select
                    className="w-full"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as IMatch['status'])}
                >
                    <option value="active">En curso (Abierta)</option>
                    <option value="finished">Finalizada (Hay ganador)</option>
                    <option value="cancelled">Cancelada (Anulada)</option>
                </select>
            </div>
        </BaseModal>
    );
};