import { useState } from 'react';
import { IMatch, IPlayer } from '@el-porotero/shared';
import { Save } from 'lucide-react';
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

    const EditFooter = (
        <>
            <Button className="flex-1" variant="ghost" size="sx" onClick={onClose}>
                Cancelar
            </Button>
            <Button
                variant="primary"
                size="sx"
                className="flex-1"
                onClick={handleSave}
                loading={updateMatch.isPending}
            >
                <Save size={18} /> Guardar
            </Button>
        </>
    );

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Ajustes de la Mesa"
            maxWidth="max-w-sm"
            footer={EditFooter}
        >
            <div className="edit-form-container">
                {/* LISTA DE JUGADORES COMPACTA */}
                <section className="edit-section">
                    <label className="label-mini">Jugadores</label>
                    <div className="edit-players-grid">
                        {players.map((p, i) => (
                            <div key={i} className="edit-player-row">
                                <span className="player-index-mini">{i + 1}</span>
                                <Input
                                    value={p.name}
                                    onChange={(e) => {
                                        const newP = [...players];
                                        newP[i] = { ...newP[i], name: e.target.value.toUpperCase() };
                                        setPlayers(newP);
                                    }}
                                    className="input-compact"
                                    placeholder={`Jugador ${i + 1}`}
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* ESTADO DE PARTIDA */}
                <section className="edit-section mt-2">
                    <label className="label-mini">Estado actual</label>
                    <select
                        className="select-custom"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as IMatch['status'])}
                    >
                        <option value="active">En curso (Abierta)</option>
                        <option value="finished">Finalizada (Hay ganador)</option>
                        <option value="cancelled">Cancelada (Anulada)</option>
                    </select>
                </section>
            </div>
        </BaseModal>
    );
};