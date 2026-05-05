import { useState } from 'react';
import { IMatch, IRoundDetails, IRoundScore, TrucoFlowState } from '@el-porotero/shared';
import { Save, AlertCircle, Crown, HatGlasses, Minus, Plus } from 'lucide-react';
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
    const { scores, updateScore, isFormValid, sombreroIndex, handleTeamUpdate } = useMatchRoundForm(match, roundToEdit);
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
        </div>
    );


    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? `Editar Ronda ${roundToEdit}` : 'Anotar Ronda'}
            footer={modalFooter} // modalFooter ya definido en tu código
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
                    const isEscoba = ['Escoba', 'Barsiga'].includes(game);
                    const isBurako = game === 'Burako';

                    // Referencia al primer jugador para puntos de bando (Escoba/Burako)
                    const firstPlayerIdx = match.players.indexOf(teamPlayers[0]);
                    const teamDetails = scores[firstPlayerIdx]?.details;

                    return (
                        <section key={teamId} className={`score-group-card team-${teamId.toLowerCase()}`}>
                            {/* --- 1. CABECERA DE GRUPO --- */}
                            <div className="score-group-header">
                                <h3 className="score-group-title">
                                    {teamId === 'None' ? 'Jugadores' : `Equipo ${teamId}`}
                                </h3>

                                {/* Burako: Botones de equipo (Cerró/Muerto) */}
                                {isBurako && isTeamGame && isTeam && (
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
                                    </div>
                                )}
                            </div>

                            {/* --- 2. PUNTOS DE MESA COMPARTIDOS (Solo Escoba/Bársiga en EQUIPO) --- */}
                            {isEscoba && isTeamGame && isTeam && (
                                <MesaPointsSelector
                                    details={teamDetails}
                                    onToggle={(key, val) => handleTeamUpdate(teamId, { [key]: val })}
                                />
                            )}

                            {/* --- 3. LISTA DE INPUTS (Jugador o Bando) --- */}
                            <div className="player-list">
                                {isTruco && isTeamGame && isTeam ? (
                                    /* CASO A: TRUCO POR EQUIPOS (Un solo bando de botones) */
                                    <div className="player-card">
                                        {renderInput(scores[firstPlayerIdx], firstPlayerIdx)}
                                    </div>
                                ) : (
                                    /* CASO B: TODOS LOS DEMÁS JUEGOS (Mapeo por jugador) */
                                    teamPlayers.map(player => {
                                        const idx = match.players.indexOf(player);
                                        const s = scores[idx];
                                        if (player.isOut && !isEditMode) return null;

                                        return (
                                            <div key={player.name} className="player-card">
                                                <div className="player-card-header">
                                                    <p className="player-name-label">{player.name}</p>
                                                    <div className="icon-group">
                                                        {idx === match.currentDealerIndex && <Crown size={12} className="text-primary" fill="currentColor" />}
                                                        {idx === sombreroIndex && <HatGlasses size={12} className="text-purple-400" />}
                                                    </div>
                                                </div>

                                                {isEscoba ? (
                                                    <div className="flex flex-col gap-4">
                                                        {/* Si es individual, los puntos de mesa van acá adentro */}
                                                        {!isTeamGame && (
                                                            <MesaPointsSelector
                                                                details={s.details}
                                                                onToggle={(key, val) => updateScore(idx, { [key]: val })}
                                                            />
                                                        )}
                                                        {/* Contador de escobas (Siempre individual) */}
                                                        <div className="individual-counter-row">
                                                            <span className="label-mini">Escobas</span>
                                                            <div className="flex items-center gap-2">
                                                                <IconButton title="Menos" icon={<Minus size={14} />} onClick={() => updateScore(idx, { escobas: Math.max(0, (s.details?.escobas || 0) - 1) })} />
                                                                <span className="escoba-count-display">{s.details?.escobas || 0}</span>
                                                                <IconButton title="Más" icon={<Plus size={14} />} variant="primary" onClick={() => updateScore(idx, { escobas: (s.details?.escobas || 0) + 1 })} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    /* Loba, Mosca, Burako individual, etc. */
                                                    renderInput(s, idx)
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </section>
                    );
                })}
            </div>
        </BaseModal>
    );
};