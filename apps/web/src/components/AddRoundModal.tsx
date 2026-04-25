import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { IMatch, IRoundScore, IRoundDetails } from '@el-porotero/shared';
import api from '@/api/axios';
import axios from 'axios';
import { X, Save, AlertCircle } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    match: IMatch;
    onSuccess: (updatedMatch: IMatch) => void;
}

export const AddRoundModal = ({ isOpen, onClose, match, onSuccess }: Props) => {
    // Inicializamos el estado con los jugadores de la partida
    const [scores, setScores] = useState<IRoundScore[]>(
        match.players.map(p => ({
            playerName: p.name,
            pointsAdded: 0,
            details: { bazas: 0, paso: false, isCerrar: false, isCorteMinus10: false }
        }))
    );

    const [loading, setLoading] = useState(false);

    // Validación para la Mosca: la suma de bazas debe ser 5
    const totalBazas = scores.reduce((acc, s) => acc + (s.details.bazas || 0), 0);
    const isMoscaValid = match.gameType === 'Mosca' ? totalBazas === 5 : true;

    const handleUpdateScore = (index: number, fields: Partial<IRoundScore>) => {
        const newScores = [...scores];
        newScores[index] = { ...newScores[index], ...fields };
        setScores(newScores);
    };

    const handleUpdateDetails = (index: number, detailFields: Partial<IRoundDetails>) => {
        const newScores = [...scores];
        newScores[index].details = { ...newScores[index].details, ...detailFields };
        setScores(newScores);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const { data } = await api.post(`/matches/${match._id}/round`, { scores });
            onSuccess(data);
            onClose();
        } catch (err: unknown) { // Cambiamos a 'err' y tipo 'unknown'
            let errorMessage = "Error al guardar la ronda";

            if (axios.isAxiosError(err)) {
                // Ahora TS nos deja acceder a response y data
                errorMessage = err.response?.data?.message || err.message;
            }

            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-md bg-surface p-6 rounded-4xl shadow-2xl z-50 border border-white/5 animate-in zoom-in-95 duration-200">

                    <div className="flex justify-between items-center mb-6">
                        <Dialog.Title className="text-xl font-display font-bold">Anotar Ronda</Dialog.Title>
                        <button onClick={onClose} className="p-2 text-text-muted hover:text-white"><X size={20} /></button>
                    </div>

                    <div className="flex flex-col gap-4 mb-8">
                        {scores.map((s, i) => {
                            const player = match.players[i];
                            if (player.isOut) return null; // No anotamos a los que ya perdieron

                            return (
                                <div key={s.playerName} className="bg-background/50 p-4 rounded-2xl border border-white/5">
                                    <p className="font-bold text-sm mb-3 text-primary">{s.playerName}</p>

                                    <div className="flex items-center gap-4">
                                        {/* INPUT DINÁMICO SEGÚN JUEGO */}
                                        {match.gameType === 'Mosca' ? (
                                            <div className="flex flex-1 items-center gap-2">
                                                <label className="text-xs text-text-muted">Bazas:</label>
                                                <input
                                                    type="number"
                                                    className="form-input py-2 text-center"
                                                    value={s.details.bazas}
                                                    disabled={s.details.paso}
                                                    onChange={(e) => handleUpdateDetails(i, { bazas: parseInt(e.target.value) || 0 })}
                                                />
                                                <button
                                                    onClick={() => handleUpdateDetails(i, { paso: !s.details.paso, bazas: 0 })}
                                                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${s.details.paso ? 'bg-warning text-background' : 'bg-surface text-text-muted'}`}
                                                >
                                                    PASO
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-1 items-center gap-3">
                                                <input
                                                    type="number"
                                                    placeholder="Puntos"
                                                    className="form-input py-2"
                                                    onChange={(e) => handleUpdateScore(i, { pointsAdded: parseInt(e.target.value) || 0 })}
                                                />
                                                {match.gameType === 'Loba' && (
                                                    <button
                                                        onClick={() => handleUpdateDetails(i, { isCerrar: !s.details.isCerrar })}
                                                        className={`px-3 py-2 rounded-lg text-xs font-bold ${s.details.isCerrar ? 'bg-primary text-background' : 'bg-surface'}`}
                                                    >
                                                        CERRÓ
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* VALIDACIÓN VISUAL PARA MOSCA */}
                    {match.gameType === 'Mosca' && !isMoscaValid && (
                        <div className="flex items-center gap-2 text-warning text-xs mb-4 justify-center animate-pulse">
                            <AlertCircle size={14} /> Sumatoria de bazas debe ser 5 (llevas {totalBazas})
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={loading || !isMoscaValid}
                        className="btn-primary w-full py-4 flex items-center justify-center gap-2"
                    >
                        <Save size={20} /> {loading ? 'Guardando...' : 'Guardar Ronda'}
                    </button>

                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};