import { useState } from 'react';
import { IMatch, IRoundDetails, IRoundScore, TrucoFlowState } from '@el-porotero/shared';
import { Save, AlertCircle, Minus, Plus } from 'lucide-react';
import { useMatchActions, useMatchRoundForm } from '@/hooks';
import { MesaPointsSelector, IconButton, BaseModal, MoscaInputRow, AccumulativeInputRow, BurakoPlayerInput, EscobaInputRow, TrucoInputRow, Button } from '@/components';

interface MatchRoundModalProps {
    isOpen: boolean;
    onClose: () => void;
    match: IMatch;
    roundToEdit?: number | null;
    onSuccess: () => void;
}

export const MatchRoundModal = ({ isOpen, onClose, match, roundToEdit }: MatchRoundModalProps) => {
    const isEditMode = !!roundToEdit;
    const { scores, updateScore, isFormValid, handleTeamUpdate } = useMatchRoundForm(match, roundToEdit);
    const { saveRound } = useMatchActions(match._id!);

    const [flowState, setFlowState] = useState<TrucoFlowState>({
        envidoLevel: 0,
        trucoLevel: 0,
        voice: null,
        envidoClaimedBy: null,
        trucoClaimedBy: null
    });

    // --- LÓGICA DE EXCLUSIVIDAD (Escoba/Bársiga) ---
    const toggleExclusivePoint = (teamId: string, key: keyof IRoundDetails) => {
        const isCurrentlyActive = match.players.some((p, idx) => p.team === teamId && scores[idx].details[key]);

        // Quitamos ese punto de TODOS los jugadores/equipos
        match.players.forEach((_, idx) => updateScore(idx, { [key]: false }));

        // Si no estaba activo, lo activamos para el bando solicitante
        if (!isCurrentlyActive) {
            handleTeamUpdate(teamId as 'A' | 'B', { [key]: true });
        }
    };

    const anyoneClosed = scores.some(s => s.details?.isCerrar || s.details?.isCorteMinus10);
    const isTeamGameActive = match.isTeamGame || match.players.some(p => p.team === 'A' || p.team === 'B');

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
        <div className="modal-footer-content">
            {!isFormValid && (
                <div className="form-error-banner">
                    <AlertCircle size={14} />
                    {['Escoba', 'Barsiga'].includes(match.gameType)
                        ? "Falta marcar quién se llevó los Velos (As, 7, 12)"
                        : "Revisar datos de la ronda"}
                </div>
            )}
            <Button
                className="w-full flex-1"
                disabled={!isFormValid || saveRound.isPending}
                loading={saveRound.isPending}
                onClick={() => saveRound.mutate(
                    { scores, isEdit: isEditMode, roundNumber: roundToEdit ?? undefined },
                    { onSuccess: onClose }
                )}
            >
                <Save size={20} /> Confirmar Ronda
            </Button>
        </div>
    );

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? `Editar Ronda ${roundToEdit}` : 'Anotar Ronda'}
            footer={modalFooter}
        >
            <div className="anotador-content">
                {(['A', 'B', 'None'] as const).map(teamId => {
                    const teamPlayers = match.players.filter(p => p.team === teamId);
                    if (teamPlayers.length === 0) return null;

                    // FLAGS DE LÓGICA
                    const isTeam = teamId !== 'None';
                    const isTeamGame = match.isTeamGame;
                    const game = match.gameType;
                    const isTruco = game === 'Truco';
                    const isBurako = game === 'Burako';
                    const isEscoba = ['Escoba', 'Barsiga'].includes(game);
                    const firstPlayerIdx = match.players.indexOf(teamPlayers[0]);
                    const teamDetails = scores[firstPlayerIdx]?.details;

                    return (
                        <section key={teamId} className={`score-group-card team-${teamId.toLowerCase()}`}>
                            {/* --- CABECERA DE GRUPO --- */}
                            <div className="score-group-header">
                                <h3 className="score-group-title">
                                    {teamId === 'None' ? 'Jugadores' : `Equipo ${teamId}`}
                                </h3>
                            </div>

                            {isTeamGame && isTeam ? (
                                <div className="team-scoring-area">
                                    {/* Burako */}
                                    {isBurako && (
                                        <div className="flex gap-2">
                                            <Button
                                                variant={teamDetails?.isCerrar ? 'success' : 'ghost'}
                                                className="btn-team-action"
                                                onClick={() => handleTeamUpdate(teamId, { isCerrar: !teamDetails?.isCerrar })}
                                            >
                                                {teamDetails?.isCerrar ? 'CERRÓ' : '¿CERRÓ?'}
                                            </Button>
                                            <Button
                                                variant={teamDetails?.tomoMuerto !== false ? 'primary' : 'danger'}
                                                className="btn-team-action"
                                                onClick={() => handleTeamUpdate(teamId, { tomoMuerto: !teamDetails?.tomoMuerto })}
                                            >
                                                {teamDetails?.tomoMuerto !== false ? 'CON MUERTO' : 'SIN MUERTO'}
                                            </Button>
                                        </div>)}

                                    {/*  Escoba */}
                                    {isEscoba && (
                                        <>
                                            <MesaPointsSelector
                                                details={teamDetails}
                                                onToggle={(key) => toggleExclusivePoint(teamId, key)}
                                            />

                                            <div className="team-escoba-row">
                                                <span className="label-mini">Escobas</span>
                                                <div className="counter-control">
                                                    <IconButton
                                                        title='Menos'
                                                        icon={<Minus size={14} />}
                                                        onClick={() => handleTeamUpdate(teamId, { escobas: Math.max(0, (teamDetails?.escobas || 0) - 1) })}
                                                    />
                                                    <span className="counter-val">{teamDetails?.escobas || 0}</span>
                                                    <IconButton
                                                        title='Más'
                                                        variant="primary"
                                                        icon={<Plus size={14} />}
                                                        onClick={() => handleTeamUpdate(teamId, { escobas: (teamDetails?.escobas || 0) + 1 })}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {/* TRUCO POR EQUIPOS (Un solo bando de botones) */}
                                    {isTruco && isTeamGame && isTeam && (
                                        <div className="player-card">
                                            {renderInput(scores[firstPlayerIdx], firstPlayerIdx)}
                                        </div>
                                    )}
                                </div>) : (

                                <div className="player-list">
                                    {match.players.map(player => {
                                        const idx = match.players.indexOf(player);
                                        const s = scores[idx];
                                        if (player.isOut && !isEditMode) return null;

                                        return (
                                            <div key={player.name} className="player-input-card">
                                                <p className="player-input-name">{player.name}</p>
                                                {/* Loba, Mosca, Burako individual, etc. */}
                                                {renderInput(s, idx)}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </section>
                    );
                })}
            </div>
        </BaseModal >
    );
};