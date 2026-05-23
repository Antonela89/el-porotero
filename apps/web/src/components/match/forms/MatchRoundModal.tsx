import { useState } from 'react';
import { IMatch, TrucoFlowState } from '@el-porotero/shared';
import { useMatchActions, useMatchRoundForm } from '@/hooks';
import { BaseModal, MatchRoundInputs, MatchRoundFooter } from '@/components';

interface MatchRoundModalProps {
    isOpen: boolean;
    onClose: () => void;
    match: IMatch;
    roundToEdit?: number | null;
    onSuccess: () => void;
}

export const MatchRoundModal = ({ isOpen, onClose, match, roundToEdit }: MatchRoundModalProps) => {
    const isEditMode = !!roundToEdit;
    const formProps = useMatchRoundForm(match, roundToEdit);
    const { saveRound } = useMatchActions(match._id!);

    const [flowState, setFlowState] = useState<TrucoFlowState>({
        envidoLevel: 0,
        trucoLevel: 0,
        voice: null,
        envidoClaimedBy: null,
        trucoClaimedBy: null
    });

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? `Editar Ronda ${roundToEdit}` : 'Anotar Ronda'}
            footer={
                <MatchRoundFooter
                    match={match}
                    isFormValid={formProps.isFormValid}
                    saveRound={saveRound}
                    scores={formProps.scores}
                    isEditMode={isEditMode}
                    roundToEdit={roundToEdit}
                    onClose={onClose}
                />
            }
        >
            <MatchRoundInputs
                {...formProps} 
                match={match} 
                isEditMode={isEditMode} 
                flowState={flowState}
                onFlowChange={(newFlow: Partial<TrucoFlowState>) => setFlowState(prev => ({ ...prev, ...newFlow }))} />
        </BaseModal>
    );
};