import { IMatch, IRoundScore, IRoundDetails, TrucoFlowState } from '@el-porotero/shared';
import { TeamInputGroup, PlayerInputGroup } from '@/components';

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
    const anyoneClosed = formProps.scores.some(
        s => s.details?.isCerrar || s.details?.isCorteMinus10
    );

    return (
        <div className="anotador-content">
            {(['A', 'B', 'None'] as const).map(teamId => {
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
                        {...formProps} />
                ) : (
                    <PlayerInputGroup
                        key={teamId}
                        teamId={teamId}
                        players={teamPlayers}
                        match={match}
                        anyoneClosed={anyoneClosed}
                        {...formProps} />
                );
            })}
        </div>
    );
};