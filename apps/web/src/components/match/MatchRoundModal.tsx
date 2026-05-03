import { useState } from 'react';
import { IMatch, IRoundDetails, IRoundScore, TrucoFlowState } from '@el-porotero/shared';
import { Save, AlertCircle, Crown, HatGlasses } from 'lucide-react';
import { Button } from '@/components';
import { useMatchActions, useMatchRoundForm } from '@/hooks';
import { BaseModal, MoscaInputRow, AccumulativeInputRow, BurakoPlayerInput, EscobaInputRow, TrucoInputRow } from '@/components';

interface MatchRoundModalProps {
    isOpen: boolean;
    onClose: () => void;
    match: IMatch;
    roundToEdit?: number | null;
    onSuccess: () => void;
}

export const MatchRoundModal = ({ isOpen, onClose, match, roundToEdit }: MatchRoundModalProps) => {
    const isEditMode = !!roundToEdit;
    const { scores, updateScore, isFormValid, sombreroIndex } = useMatchRoundForm(match, roundToEdit);
    const { saveRound } = useMatchActions(match._id!);

    const [flowState, setFlowState] = useState<TrucoFlowState>({
        envidoLevel: 0,
        trucoLevel: 0,
        voice: null,
        envidoClaimedBy: null,
        trucoClaimedBy: null
    });

    const anyoneClosed = scores.some(s => s.details?.isCerrar || s.details?.isCorteMinus10);
    const isTeamGameActive = match.isTeamGame || match.players.some(p => p.team === 'A' || p.team === 'B');

    const handleTeamUpdate = (teamId: string, payload: Partial<IRoundDetails>) => {
        match.players.forEach((p, idx) => {
            if (p.team === teamId) updateScore(idx, payload);
        });
    };

    const renderInput = (s: IRoundScore, idx: number) => {
        const player = match.players[idx];
        const onUpdateAction = (payload: Partial<IRoundScore & IRoundDetails>) => updateScore(idx, payload);

        switch (match.gameType) {
            case 'Truco':
                return (
                    <TrucoInputRow
                        match={match}
                        score={s}
                        teamId={player.team as 'A' | 'B'}
                        flowState={flowState}
                        onUpdate={onUpdateAction}
                        onFlowChange={(newFlow) => setFlowState(prev => ({ ...prev, ...newFlow }))}
                    />
                );
            case 'Burako':
                return (
                    <BurakoPlayerInput
                        score={s}
                        onUpdate={onUpdateAction}
                        isTeamGame={isTeamGameActive}
                        disableExclusives={anyoneClosed}
                    />
                );
            case 'Escoba':
            case 'Barsiga':
                return (
                    <EscobaInputRow
                        score={s}
                        onUpdate={onUpdateAction}
                        onToggleExclusive={(key) => updateScore(idx, { [key]: !s.details?.[key as keyof IRoundDetails] })}
                    />
                );
            case 'Mosca':
                return (
                    <MoscaInputRow
                        score={s}
                        isDealer={idx === match.currentDealerIndex}
                        onUpdateDetails={onUpdateAction}
                    />
                );
            default:
                return (
                    <AccumulativeInputRow
                        gameType={match.gameType}
                        score={s}
                        onUpdateScore={onUpdateAction}
                        onUpdateDetails={onUpdateAction}
                        disableExclusives={anyoneClosed}
                    />
                );
        }
    };

    const modalFooter = (
        <div className="flex flex-col gap-3">
            {!isFormValid && (
                <div className="flex items-center justify-center gap-2 text-warning text-[10px] font-bold uppercase">
                    <AlertCircle size={14} /> Revisar datos de la ronda
                </div>
            )}
            <Button
                className="w-full"
                disabled={!isFormValid || saveRound.isPending}
                loading={saveRound.isPending}
                onClick={() => saveRound.mutate({ scores, isEdit: !!roundToEdit, roundNumber: roundToEdit ?? undefined }, { onSuccess: onClose })}
            >
                <Save size={20} /> Confirmar Ronda
            </Button>
        </div>
    );

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={roundToEdit ? `Editar Ronda ${roundToEdit}` : 'Anotar Ronda'}
            footer={modalFooter}
        >
            <div className="flex-1 overflow-y-auto p-6 pt-2 flex flex-col gap-6 custom-scrollbar">
                {(['A', 'B', 'None'] as const).map(teamId => {
                    const teamPlayers = match.players.filter(p => p.team === teamId);
                    if (teamPlayers.length === 0) return null;

                    return (
                        <section key={teamId} className={`score-group-card team-${teamId.toLowerCase()}`}>
                            <div className="flex justify-between items-center mb-3">
                                <h3 className={`text-[10px] font-black uppercase tracking-widest ${teamId === 'A' ? 'text-indigo-400' : 'text-rose-400'}`}>
                                    {teamId === 'None' ? 'Jugadores' : `Equipo ${teamId}`}
                                </h3>
                                {match.gameType === 'Burako' && teamId !== 'None' && (
                                    <button
                                        onClick={() => handleTeamUpdate(teamId, { tomoMuerto: false })}
                                        className="text-[8px] font-bold text-text-muted hover:text-white"
                                    >
                                        LIMPIAR EQUIPO
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-col gap-3">
                                {teamPlayers.map(player => {
                                    const idx = match.players.findIndex(p => p.name === player.name);
                                    const isDealer = idx === match.currentDealerIndex;
                                    const isSombrero = idx === sombreroIndex;

                                    if (player.isOut && !isEditMode) return null;

                                    return (
                                        <div key={player.name} className="p-4 rounded-2xl bg-background/40 border border-white/5">
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="font-bold text-xs">{player.name}</p>
                                                <div className="flex gap-1">
                                                    {isDealer && <Crown size={14} className="text-primary" fill="currentColor" />}
                                                    {isSombrero && <HatGlasses size={14} className="text-purple-400" />}
                                                </div>
                                            </div>
                                            {renderInput(scores[idx], idx)}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    );
                })}
            </div>

            <footer className="p-6 pt-2 border-t border-white/5 bg-surface">
                {!isFormValid && (
                    <div className="flex items-center justify-center gap-2 text-warning text-[10px] font-bold uppercase mb-3 text-center">
                        <AlertCircle size={14} /> Revisar datos de la ronda
                    </div>
                )}
                <Button
                    className="w-full"
                    disabled={!isFormValid || saveRound.isPending}
                    loading={saveRound.isPending}
                    onClick={() => saveRound.mutate(
                        { scores, isEdit: isEditMode, roundNumber: roundToEdit ?? undefined },
                        { onSuccess: onClose }
                    )}
                >
                    <Save size={20} /> Confirmar Ronda
                </Button>
            </footer>
        </BaseModal>
    );
};