import { GenericInputSwitcher } from "./GenericInputSwitcher";
import { Crown, HatGlasses } from 'lucide-react';
import { IMatch, IPlayer, IRoundScore, TrucoFlowState, IRoundDetails } from '@el-porotero/shared';

interface PlayerInputGroupProps {
    players: IPlayer[];
    match: IMatch;
    scores: IRoundScore[];
    isEditMode: boolean;
    sombreroIndex: number;
    updateScore: (index: number, payload: Partial<IRoundScore & IRoundDetails>) => void;
    updateScoreWithExclusivity: (index: number, payload: Partial<IRoundDetails>) => void;
    flowState: TrucoFlowState;
    onFlowChange: (newFlow: Partial<TrucoFlowState>) => void;
    anyoneClosed: boolean;
    teamId?: 'A' | 'B' | 'None';
}

export const PlayerInputGroup = ({ players, match, scores, isEditMode, sombreroIndex, ...props }: PlayerInputGroupProps) => {
    return (
        <section className="score-group-card team-none">
            <div className="player-list">
                {players.map(player => {
                    const idx = match.players.indexOf(player);
                    if (player.isOut && !isEditMode) return null;

                    return (
                        <div key={player.name} className={`player-input-card ${idx === sombreroIndex ? 'is-sombrero' : ''}`}>
                            <div className="player-input-header">
                                <span className="player-input-name">{player.name}</span>
                                <div className="flex gap-1">
                                    {idx === match.currentDealerIndex && <Crown size={14} className="text-primary" />}
                                    {idx === sombreroIndex && <HatGlasses size={14} className="text-purple-400" />}
                                </div>
                            </div>

                            {match.gameType === 'Mosca' && idx === sombreroIndex ? (
                                <div className="sombrero-message">Mira de afuera 🎩</div>
                            ) : (
                                <GenericInputSwitcher
                                    match={match}
                                    score={scores[idx]}
                                    idx={idx}
                                    anyoneClosed={props.anyoneClosed}
                                    onUpdate={(payload) => props.updateScore(idx, payload)}
                                    onToggleExclusive={(key) => props.updateScoreWithExclusivity(idx, { [key]: true })}
                                    flowState={props.flowState}
                                    onFlowChange={props.onFlowChange}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};