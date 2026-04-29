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
    roundToEdit?: number | null;
    onSuccess: (updatedMatch: IMatch) => void;
}

export const MatchRoundModal = ({ isOpen, onClose, match, roundToEdit, onSuccess }: Props) => {
    const isEditMode = !!roundToEdit;
    const { validateRound, sombreroIndex } = useMoscaLogic(match);

    // Estado inicial de los jugadores de la partida
    const [scores, setScores] = useState<IRoundScore[]>(() => {
        // Esta función solo corre UNA VEZ cuando el componente se monta
        if (isEditMode) {
            const roundData = match.rounds.find(r => r.roundNumber === roundToEdit);
            return roundData ? JSON.parse(JSON.stringify(roundData.scores)) : [];
        } else {
            return match.players.map(p => ({
                playerName: p.name,
                pointsAdded: 0,
                details: { bazas: 0, paso: false, isCerrar: false, isCorteMinus10: false }
            }));
        }
    });

    const [loading, setLoading] = useState(false);

    const updateScoreState = (index: number, payload: Partial<IRoundScore> & Partial<IRoundDetails>) => {
        setScores(prev => {
            const next = [...prev];
            const EXCLUSIVE_KEYS: (keyof IRoundDetails)[] = ['isCerrar', 'isCorteMinus10'];

            const isActivatingExclusive = Object.entries(payload).some(
                ([key, value]) => EXCLUSIVE_KEYS.includes(key as keyof IRoundDetails) && value === true
            );

            if (isActivatingExclusive) {
                // Limpiamos acciones exclusivas de los demás
                next.forEach((s, idx) => {
                    if (idx !== index) {
                        s.details = { ...s.details, isCerrar: false, isCorteMinus10: false };
                    }
                });
                // Forzamos puntos a 0 si cerró o cortó
                next[index].pointsAdded = 0;
            }

            // Actualizamos puntos si vienen en el payload
            if (payload.pointsAdded !== undefined) {
                next[index].pointsAdded = payload.pointsAdded;
            }

            // Actualizamos detalles
            next[index].details = { ...next[index].details, ...payload };
            return next;
        });
    };

    // 3. VALIDACIONES DE REGLAS DE NEGOCIO

    // Lógica Loba/Chinchon: Exactamente 1 ganador y el resto > 0 puntos
    const validateLoba = () => {
        const winners = scores.filter(s => s.details?.isCerrar || s.details?.isCorteMinus10);
        if (winners.length !== 1) return false;

        const othersValid = scores.every(s => {
            const player = match.players.find(p => p.name === s.playerName);
            if (player?.isOut) return true; // Ignorar eliminados

            const isWinner = s.details?.isCerrar || s.details?.isCorteMinus10;
            if (isWinner) return true;

            return (s.pointsAdded || 0) > 0; // Obligatorio sumar puntos si no ganaste
        });

        return othersValid;
    };

    const { isValid: isMoscaValid, totalBazas } = validateRound(scores);

    const isFormValid = match.gameType === 'Mosca'
        ? isMoscaValid
        : (['Loba', 'Chinchon'].includes(match.gameType))
            ? validateLoba()
            : true;

    // 4. ENVÍO DE DATOS
    const handleSubmit = async () => {
        setLoading(true);
        try {
            const url = isEditMode ? `/matches/${match._id}/rounds/${roundToEdit}` : `/matches/${match._id}/round`;
            const method = isEditMode ? 'patch' : 'post';
            const { data } = await api[method](url, { scores });

            onSuccess(data);
            onClose();
        } catch (err: unknown) {
            let msg = "Error al guardar";
            if (axios.isAxiosError(err)) msg = err.response?.data?.message || err.message;
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
                <Dialog.Description className="sr-only">
                    Formulario para ingresar los puntos o bazas obtenidos en la ronda actual.
                </Dialog.Description>
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-md bg-surface p-6 rounded-4xl shadow-2xl z-50 border border-white/5 animate-in zoom-in-95 duration-200">

                    <div className="flex justify-between items-center mb-6">
                        <Dialog.Title className="text-xl font-display font-bold"> {isEditMode ? `Editar Ronda ${roundToEdit}` : 'Anotar Ronda'}</Dialog.Title>
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
                                                    disableExclusives={validateLoba() && !(s.details?.isCerrar || s.details?.isCorteMinus10)}
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