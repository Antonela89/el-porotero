
import { IMatch } from '@el-porotero/shared';
import { useMatchActions, useMatchRoundForm } from '@/hooks';
import { BaseModal} from '@/components';
import { MatchRoundInputs } from './MatchRoundInputs';
import { MatchRoundFooter } from './MatchRoundFooter';

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
            <MatchRoundInputs {...formProps} match={match} isEditMode={isEditMode} />
        </BaseModal>
    );
};