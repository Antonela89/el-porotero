import { IMatch, IRoundDetails, IRoundScore, TrucoFlowState } from '@el-porotero/shared';
import { MoscaInputRow, AccumulativeInputRow, BurakoPlayerInput, EscobaInputRow, TrucoInputRow } from '@/components';

interface GenericInputSwitcherProps {
    match: IMatch;
    score: IRoundScore;
    idx: number;
    anyoneClosed: boolean;
    onUpdate: (payload: Partial<IRoundScore & IRoundDetails>) => void;
    onToggleExclusive: (key: keyof IRoundDetails) => void;
    flowState: TrucoFlowState;
    onFlowChange: (newFlow: Partial<TrucoFlowState>) => void;
}


export const GenericInputSwitcher = ({ match, score, idx, anyoneClosed, onUpdate, onToggleExclusive, flowState, onFlowChange }: GenericInputSwitcherProps) => {

    switch (match.gameType) {
        case 'Truco':
            return (
                <TrucoInputRow
                    match={match}
                    score={score}
                    flowState={flowState}
                    onUpdate={onUpdate}
                    onFlowChange={onFlowChange}
                />
            );
        case 'Burako':
            return (
                <BurakoPlayerInput
                    score={score}
                    onUpdate={onUpdate}
                    isTeamGame={match.isTeamGame}
                    disableExclusives={anyoneClosed}
                />
            );
        case 'Escoba':
        case 'Barsiga':
            return (
                <EscobaInputRow
                    score={score}
                    onUpdate={onUpdate}
                    onToggleExclusive={onToggleExclusive}
                />
            );
        case 'Mosca':
            return (
                <MoscaInputRow
                    score={score}
                    isDealer={idx === match.currentDealerIndex}
                    onUpdateDetails={onUpdate}
                />
            );
        default:
            return (
                <AccumulativeInputRow
                    gameType={match.gameType}
                    score={score}
                    onUpdateScore={onUpdate}
                    onUpdateDetails={onUpdate}
                    disableExclusives={anyoneClosed}
                />
            );
    }
};