import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { IMatch, IRoundScore, IRoundDetails } from '@el-porotero/shared';
import { useMoscaLogic } from '@/hooks/useMoscaLogic';
import { MoscaInputRow, AccumulativeInputRow } from './Score-Inputs';
import api from '@/api/axios';
import axios from 'axios';
import { X, Save, AlertCircle, HatGlasses } from 'lucide-react';


interface Props {
    isOpen: boolean;
    onClose: () => void;
    match: IMatch;
    onSuccess: (updatedMatch: IMatch) => void;
}

export const AddRoundModal = ({ isOpen, onClose, match, onSuccess }: Props) => {
    const { validateRound, sombreroIndex } = useMoscaLogic(match);

    // Estado inicial de los jugadores de la partida
    const [scores, setScores] = useState<IRoundScore[]>(
        match.players.map(p => ({
            playerName: p.name,
            pointsAdded: 0,
            details: { bazas: 0, paso: false, isCerrar: false, isCorteMinus10: false }
        }))
    );

    // Estado para manejar la carga al guardar la ronda
    const [loading, setLoading] = useState(false);

    // Lógica de exclusividad (Un solo ganador de ronda)
    const winnersCount = scores.filter(s => s.details.isCerrar || s.details.isCorteMinus10).length;

    const nonWinnersValid = scores.every(s => {
        const player = match.players.find(p => p.name === s.playerName);
        if (player?.isOut) return true; // Si está fuera, no cuenta

        const isWinner = s.details.isCerrar || s.details.isCorteMinus10;
        if (isWinner) return true; // El ganador está ok con 0 puntos

        return s.pointsAdded > 0; // El resto DEBE tener más de 0
    });

    const { isValid: isMoscaValid, totalBazas } = validateRound(scores);

    const isLobaRuleMet = winnersCount === 1 && nonWinnersValid;

    const isFormValid = match.gameType === 'Loba' || match.gameType === 'Chinchon'
        ? isLobaRuleMet
        : (match.gameType === 'Mosca' ? isMoscaValid : true);

    type UpdatePayload = Partial<IRoundScore> & Partial<IRoundDetails>;

    const updateScoreState = (index: number, payload: UpdatePayload) => {
        setScores(prev => {
            const next = [...prev];
            const currentDetails = next[index].details || {};

            const EXCLUSIVE_KEYS: (keyof IRoundDetails)[] = ['isCerrar', 'isCorteMinus10'];
            const isActivatingExclusive = Object.entries(payload).some(
                ([key, value]) => EXCLUSIVE_KEYS.includes(key as keyof IRoundDetails) && value === true
            );

            if (isActivatingExclusive) {
                next.forEach((s, idx) => {
                    if (idx !== index) {
                        s.details = { ...s.details, isCerrar: false, isCorteMinus10: false };
                    }
                });
            }

            // Actualizamos pointsAdded si viene en el payload, si no, mantenemos el anterior
            if (payload.pointsAdded !== undefined) {
                next[index].pointsAdded = payload.pointsAdded;
            }

            // Actualizamos los detalles
            next[index].details = { ...currentDetails, ...payload };

            return next;
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const { data } = await api.post(`/matches/${match._id}/round`, { scores });

            setScores(match.players.map(p => ({
                playerName: p.name,
                pointsAdded: 0,
                details: { bazas: 0, paso: false, isCerrar: false, isCorteMinus10: false }
            })));

            onSuccess(data);
            onClose();
        } catch (err: unknown) {
            let errorMessage = "Error al guardar la ronda";

            if (axios.isAxiosError(err)) {
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
                            // MOSCA
                            const isSombrero = i === sombreroIndex;
                            const isDealer = i === match.currentDealerIndex;
                            const player = match.players[i];
                            if (player.isOut) return null; // No anotamos a los que ya perdieron

                            return (
                                <div key={s.playerName} className="bg-background/50 p-4 rounded-2xl border border-white/5">
                                    <p className="font-bold text-sm mb-3 text-primary">{s.playerName}</p>

                                    {isSombrero && (
                                        <span className="flex items-center gap-1 text-[10px] bg-primary text-background px-2 py-0.5 rounded-full font-bold animate-pulse">
                                            <HatGlasses size={12} /> SOMBRERO
                                        </span>
                                    )}

                                    {!isSombrero && (
                                        <div className="flex items-center gap-4">
                                            {match.gameType === 'Mosca' ? (
                                                <MoscaInputRow
                                                    score={s}
                                                    isDealer={isDealer}
                                                    onUpdateDetails={(d: Partial<IRoundDetails>) => updateScoreState(i, d)}
                                                />
                                            ) : (
                                                <AccumulativeInputRow
                                                    score={s}
                                                    disableExclusives={match.gameType === 'Loba' && winnersCount > 0 && !s.details?.isCerrar && !s.details?.isCorteMinus10}
                                                    onUpdateScore={(f: Partial<IRoundDetails>) => updateScoreState(i, f)}
                                                    onUpdateDetails={(d: Partial<IRoundDetails>) => updateScoreState(i, d)}
                                                />
                                            )}
                                        </div>
                                    )}
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
                        disabled={loading || !isFormValid}
                        className="btn-primary w-full py-4 flex items-center justify-center gap-2"
                    >
                        <Save size={20} />
                        {loading ? 'Guardando...' : !isFormValid ? 'Faltan datos' : 'Confirmar Ronda'}

                    </button>

                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root >
    );
};