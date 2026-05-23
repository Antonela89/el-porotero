import { IMatch, IRoundScore, IRoundDetails, TrucoFlowState } from '@el-porotero/shared';
import { TeamInputGroup, PlayerInputGroup, Button } from '@/components';
import { useTrucoLogic } from '@/hooks';
import { RotateCcw } from 'lucide-react';

export interface MatchRoundInputsProps {
    match: IMatch;
    scores: IRoundScore[];
    updateScore: (index: number, payload: Partial<IRoundScore & IRoundDetails>) => void;
    updateScoreWithExclusivity: (index: number, payload: Partial<IRoundDetails>) => void;
    handleTeamUpdate: (teamId: string, payload: Partial<IRoundDetails>) => void;
    isEditMode: boolean;
    sombreroIndex: number;
    flowState: TrucoFlowState;
    onFlowChange: (newFlow: Partial<TrucoFlowState>) => void;
}

export const MatchRoundInputs = ({ match, ...formProps }: MatchRoundInputsProps) => {
    const {
        scores, updateScore,
    } = formProps;

    const anyoneClosed = scores.some(s => s.details?.isCerrar || s.details?.isCorteMinus10);
    const { currentMode, phMatchups } = useTrucoLogic(match);
    const isPuntaYHacha = match.gameType === 'Truco' && currentMode === 'Punta y Hacha';

    const totalA = match.players.filter(p => p.team === 'A').reduce((acc, p) => acc + (scores[match.players.indexOf(p)].pointsAdded || 0), 0);
    const totalB = match.players.filter(p => p.team === 'B').reduce((acc, p) => acc + (scores[match.players.indexOf(p)].pointsAdded || 0), 0);

    return (
        <div className="anotador-content">
            {isPuntaYHacha ? (
                /* --- CASO A: VISTA PUNTA Y HACHA --- */
                <div className="flex flex-col gap-3 animate-fade-in">
                    <div className="info-banner-mini mb-2">
                        MODO PUNTA Y HACHA (1 VS 1)
                    </div>

                    {phMatchups.map((duel, idx) => {
                        const idxP1 = match.players.indexOf(duel.p1);
                        const idxP2 = match.players.indexOf(duel.p2);
                        const scoreP1 = scores[idxP1].pointsAdded || 0;
                        const scoreP2 = scores[idxP2].pointsAdded || 0;
                        return (
                            <div key={idx} className="matchup-duel-card">
                                <div className="duel-grid">
                                    {/* JUGADOR 1 */}
                                    <div className="duel-side">
                                        <span className="duel-name team-a-text">{duel.p1.name}</span>
                                        <div className="duel-controls">
                                            <button
                                                className={`btn-ph-circle ${scoreP1 > 0 ? 'active-a' : ''}`}
                                                onClick={() => updateScore(idxP1, { pointsAdded: scoreP1 + 1 })}
                                            >
                                                {scoreP1}
                                            </button>
                                            {scoreP1 > 0 && (
                                                <Button className="btn-ph-reset" onClick={() => updateScore(idxP1, { pointsAdded: 0 })}>
                                                    <RotateCcw size={10} />
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="duel-vs-mini">VS</div>

                                    {/* JUGADOR 2 */}
                                    <div className="duel-side">
                                        <span className="duel-name team-b-text text-right">{duel.p2.name}</span>
                                        <div className="duel-controls flex-row-reverse">
                                            <button
                                                className={`btn-ph-circle ${scoreP2 > 0 ? 'active-b' : ''}`}
                                                onClick={() => updateScore(idxP2, { pointsAdded: scoreP2 + 1 })}
                                            >
                                                {scoreP2}
                                            </button>
                                            {scoreP2 > 0 && (
                                                <Button className="btn-ph-reset" onClick={() => updateScore(idxP2, { pointsAdded: 0 })}>
                                                    <RotateCcw size={10} />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* RESUMEN DE EQUIPO (Visual) - Igual que antes pero más ajustado */}
                    <div className="ph-summary-footer">
                        <div className="summary-pills">
                            <div className="team-total-pill">
                                <span className="team-a-text">EQUIPO A</span>
                                <strong>+{totalA}</strong>
                            </div>
                            <div className="team-total-pill items-end">
                                <span className="team-b-text text-right">EQUIPO B</span>
                                <strong>+{totalB}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* --- CASO B: VISTA NORMAL (REDONDA O INDIVIDUAL) --- */
                (['A', 'B', 'None'] as const).map(teamId => {
                    const teamPlayers = match.players.filter(p => p.team === teamId);
                    if (teamPlayers.length === 0) return null;

                    const isTeamGroup = match.isTeamGame && teamId !== 'None';

                    return isTeamGroup ? (
                        <TeamInputGroup
                            key={teamId}
                            teamId={teamId}
                            players={teamPlayers}
                            match={match}
                            anyoneClosed={anyoneClosed}
                            {...formProps}
                        />
                    ) : (
                        <PlayerInputGroup
                            key={teamId}
                            teamId={teamId}
                            players={teamPlayers}
                            match={match}
                            anyoneClosed={anyoneClosed}
                            {...formProps}
                        />
                    );
                })
            )}
        </div>
    );
};