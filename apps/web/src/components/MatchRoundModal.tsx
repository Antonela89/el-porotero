import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { IMatch, IRoundScore, IRoundDetails } from '@el-porotero/shared';
import { useMoscaLogic } from '@/hooks/useMoscaLogic';
import { MoscaInputRow, AccumulativeInputRow, BurakoInputRow } from './Score-Inputs';
import api from '@/api/axios';
import axios from 'axios';
import { X, Save, AlertCircle, HatGlasses, Crown } from 'lucide-react';

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

    const [scores, setScores] = useState<IRoundScore[]>(() => {
        if (isEditMode) {
            const roundData = match.rounds.find(r => r.roundNumber === roundToEdit);
            return roundData ? JSON.parse(JSON.stringify(roundData.scores)) : [];
        } else {
            return match.players.map(p => ({
                playerName: p.name,
                pointsAdded: 0,
                details: { bazas: 0, paso: false, isCerrar: false, isCorteMinus10: false, hizoBatida: false, tomoMuerto: true }
            }));
        }
    });

    const [loading, setLoading] = useState(false);

    // --- LÓGICA DE ACTUALIZACIÓN INDIVIDUAL ---
    const updateScoreState = (index: number, payload: Partial<IRoundScore> & Partial<IRoundDetails>) => {
        setScores(prev => {
            const next = [...prev];
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
                next[index].pointsAdded = 0;
            }

            if (payload.pointsAdded !== undefined) next[index].pointsAdded = payload.pointsAdded;
            next[index].details = { ...next[index].details, ...payload };
            return next;
        });
    };

    // --- LÓGICA DE ACTUALIZACIÓN POR EQUIPO (Clave para Burako) ---
    const handleTeamUpdate = (teamId: string, payload: Partial<IRoundDetails>) => {
        setScores(prev => {
            const next = [...prev];
            // Buscamos los índices de los jugadores que pertenecen a este equipo
            const teamIndices = match.players
                .map((p, idx) => (p.team === teamId ? idx : -1))
                .filter(idx => idx !== -1);

            teamIndices.forEach(idx => {
                next[idx].details = { ...next[idx].details, ...payload };
                // Si el equipo cierra, los puntos de fichas de todos en el equipo se consideran aparte, 
                // pero el 'isCerrar' lo marcamos en todos para consistencia visual.
            });

            // Exclusividad de cierre entre equipos
            if (payload.isCerrar) {
                next.forEach((s, idx) => {
                    if (!teamIndices.includes(idx)) {
                        s.details = { ...s.details, isCerrar: false };
                    }
                });
            }
            return next;
        });
    };

    // --- VALIDACIONES ---
    const anyoneClosed = scores.some(s => s.details?.isCerrar || s.details?.isCorteMinus10 || s.details?.hizoBatida);
    const { isValid: isMoscaValid, totalBazas } = validateRound(scores);

    const validateLoba = () => {
        const winners = scores.filter(s => s.details?.isCerrar || s.details?.isCorteMinus10);
        if (winners.length !== 1) return false;
        return scores.every(s => {
            const p = match.players.find(player => player.name === s.playerName);
            if (p?.isOut || s.details?.isCerrar || s.details?.isCorteMinus10) return true;
            return (s.pointsAdded || 0) > 0;
        });
    };

    const isFormValid = match.gameType === 'Mosca' ? isMoscaValid :
        (['Loba', 'Chinchon'].includes(match.gameType)) ? validateLoba() : anyoneClosed;

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const url = isEditMode ? `/matches/${match._id}/round/${roundToEdit}` : `/matches/${match._id}/round`;
            const method = isEditMode ? 'patch' : 'post';
            const { data } = await api[method](url, { scores });
            onSuccess(isEditMode ? data.match : data);
            onClose();
        } catch (err: unknown) {
            let msg = "Error al guardar";
            if (axios.isAxiosError(err)) msg = err.response?.data?.message || err.message;
            alert(msg);
        } finally { setLoading(false); }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-md bg-surface rounded-4xl shadow-2xl z-50 border border-white/5 flex flex-col max-h-[90dvh] overflow-hidden animate-in zoom-in-95 duration-200">

                    {/* HEADER FIJO */}
                    <div className="p-6 pb-2 flex justify-between items-center shrink-0">
                        <Dialog.Title className="text-xl font-display font-bold">
                            {isEditMode ? `Editar Ronda ${roundToEdit}` : 'Anotar Ronda'}
                        </Dialog.Title>
                        <button onClick={onClose} className="p-2 text-text-muted hover:text-white transition-colors"><X size={20} /></button>
                    </div>

                    <Dialog.Description className="sr-only">Formulario de anotación</Dialog.Description>

                    {/* CUERPO CON SCROLL */}
                    <div className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar flex flex-col gap-6">
                        {['A', 'B', 'None'].map((teamId) => {
                            const teamPlayers = match.players.filter(p => p.team === teamId);
                            if (teamPlayers.length === 0) return null;

                            const teamScores = scores.filter(s => teamPlayers.some(p => p.name === s.playerName));

                            return (
                                <div key={teamId} className={`p-4 rounded-3xl border bg-background/20 transition-all
                                    ${teamId === 'A' ? 'border-l-4 border-indigo-500/50' : teamId === 'B' ? 'border-l-4 border-rose-500/50' : 'border-white/5'}`}>

                                    {teamId !== 'None' && (
                                        <h3 className={`text-[10px] font-black mb-4 uppercase tracking-widest ${teamId === 'A' ? 'text-indigo-400' : 'text-rose-400'}`}>
                                            Equipo {teamId}
                                        </h3>
                                    )}

                                    {/* ACCIONES DE EQUIPO (Solo Burako) */}
                                    {match.gameType === 'Burako' && (
                                        <div className="flex gap-2 mb-4 px-2">
                                            <button
                                                onClick={() => handleTeamUpdate(teamId, { isCerrar: !teamScores[0].details.isCerrar })}
                                                className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold transition-all 
                        ${teamScores.some(s => s.details.isCerrar) ? 'bg-emerald-500 text-white' : 'bg-surface text-text-muted opacity-40'}`}
                                            >
                                                EQUIPO CERRÓ
                                            </button>
                                            <button
                                                onClick={() => handleTeamUpdate(teamId, { tomoMuerto: !teamScores[0].details.tomoMuerto })}
                                                className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold transition-all
                        ${teamScores[0].details.tomoMuerto !== false ? 'bg-indigo-500 text-white' : 'bg-orange-500 text-white'}`}
                                            >
                                                {teamScores[0].details.tomoMuerto !== false ? 'CON MUERTO' : 'SIN MUERTO'}
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-3">
                                        {teamScores.map((s) => {
                                            const originalIndex = match.players.findIndex(p => p.name === s.playerName);
                                            const player = match.players[originalIndex];
                                            const isDealer = originalIndex === (isEditMode ? match.rounds.find(r => r.roundNumber === roundToEdit)?.dealerIndex : match.currentDealerIndex);
                                            const isSombrero = originalIndex === sombreroIndex;

                                            if (player.isOut && !isEditMode) return null;

                                            return (
                                                <div key={s.playerName} className={`p-4 rounded-2xl bg-background/40 border border-white/5 ${isSombrero ? 'opacity-30 border-dashed' : ''}`}>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="font-bold text-xs">{s.playerName}</span>
                                                        <div className="flex gap-1">
                                                            {isDealer && <span className="text-[8px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold uppercase"><Crown /></span>}
                                                            {isSombrero && <span className="text-[8px] bg-white/10 text-text-muted px-2 py-0.5 rounded-full font-bold uppercase"><HatGlasses /></span>}
                                                        </div>
                                                    </div>

                                                    {!isSombrero && (
                                                        <div className="flex items-center gap-2">
                                                            {match.gameType === 'Burako' ? (
                                                                <BurakoInputRow
                                                                    disableExclusives={anyoneClosed}
                                                                    score={s}
                                                                    onUpdateScore={(f) => updateScoreState(originalIndex, f)}
                                                                    onUpdateDetails={(d) => updateScoreState(originalIndex, d)}
                                                                />
                                                            ) : match.gameType === 'Mosca' ? (
                                                                <MoscaInputRow
                                                                    score={s}
                                                                    isDealer={isDealer}
                                                                    onUpdateDetails={(d) => updateScoreState(originalIndex, d)}
                                                                />
                                                            ) : (
                                                                <AccumulativeInputRow
                                                                    score={s}
                                                                    disableExclusives={anyoneClosed}
                                                                    onUpdateScore={(f) => updateScoreState(originalIndex, f)}
                                                                    onUpdateDetails={(d) => updateScoreState(originalIndex, d)}
                                                                />
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* FOOTER FIJO */}
                    <div className="p-6 pt-2 bg-surface shrink-0 border-t border-white/5">
                        {match.gameType === 'Mosca' && !isMoscaValid && (
                            <p className="text-warning text-[10px] text-center mb-3 font-bold uppercase">
                                <AlertCircle size={14} />
                                Faltan bazas ({totalBazas}/5)</p>
                        )}
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !isFormValid}
                            className="btn-primary w-full py-4 flex items-center justify-center gap-2 shadow-xl disabled:opacity-30"
                        >
                            <Save size={20} />
                            {loading ? 'Procesando...' : !isFormValid ? 'Revisar datos' : 'Confirmar Ronda'}
                        </button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};