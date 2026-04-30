import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { IMatch } from '@el-porotero/shared';
import api from '@/api/axios';
import axios from 'axios';
import { X, Save } from 'lucide-react';

export const EditMatchModal = ({ match, isOpen, onClose, onSuccess }: { match: IMatch, isOpen: boolean, onClose: () => void, onSuccess: (m: IMatch) => void }) => {
    const [players, setPlayers] = useState([...match.players]);
    const [status, setStatus] = useState(match.status);

    const handleSave = async () => {
        try {
            const { data } = await api.put(`/matches/${match._id}`, { players, status });
            onSuccess(data);
            onClose();
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                alert("No se pudo actualizar la partida");
            }
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
                <Dialog.Description className="sr-only">
                    Formulario para editar los detalles de la partida.
                </Dialog.Description>
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-surface p-6 rounded-3xl shadow-2xl border border-white/10 z-50">
                    <Dialog.Title className="text-xl font-bold mb-4">Editar Partida</Dialog.Title>

                    <div className="flex flex-col gap-4 mb-6">
                        <label className="text-xs text-text-muted font-bold uppercase">Jugadores</label>
                        {players.map((p, i) => (
                            <input
                                key={i}
                                className="form-input py-2"
                                value={p.name}
                                onChange={(e) => {
                                    const newP = [...players];
                                    newP[i].name = e.target.value.toUpperCase();
                                    setPlayers(newP);
                                }}
                            />
                        ))}

                        <label className="text-xs text-text-muted font-bold uppercase mt-2">Estado</label>
                        <select
                            className="form-input py-2 bg-background"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as "active" | "finished" | "cancelled")} >
                            <option value="active">En curso</option>
                            <option value="finished">Finalizada</option>
                            <option value="cancelled">Cancelada</option>
                        </select>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={onClose} className="flex gap-2 items-center justify-center flex-1 py-3 rounded-xl bg-white/5 text-text-muted font-bold">
                            <X />
                            Cancelar</button>
                        <button onClick={handleSave} className="flex gap-2 items-center justify-center flex-1 py-3 rounded-xl bg-primary text-background font-bold">
                            <Save />
                            Guardar</button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};