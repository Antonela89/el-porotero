// src/components/match/MatchRoundFooter.tsx
import { Save, AlertCircle } from 'lucide-react';
import { Button } from '@/components';
import { IMatch, IRoundScore } from '@el-porotero/shared';
import { UseMutationResult } from '@tanstack/react-query';

type SaveRoundMutation = UseMutationResult<
    IMatch, 
    Error, 
    { scores: IRoundScore[]; isEdit: boolean; roundNumber?: number }
>;

interface Props {
    match: IMatch;
    isFormValid: boolean;
    scores: IRoundScore[];
    isEditMode: boolean;
    roundToEdit?: number | null;
    saveRound: SaveRoundMutation; 
    onClose: () => void;
}

export const MatchRoundFooter = ({ match, isFormValid, scores, isEditMode, roundToEdit, saveRound, onClose }: Props) => {
    
    // Lógica de mensaje de error dinámica
    const getErrorMessage = () => {
        if (isFormValid) return null;
        
        const game = match.gameType;
        if (game === 'Mosca') {
            const totalBazas = scores.reduce((acc, s) => acc + (s.details.bazas || 0), 0);
            return `Suman ${totalBazas} bazas. Deben ser exactamente 5.`;
        }
        if (['Escoba', 'Barsiga'].includes(game)) {
            return "Falta marcar quién se llevó los Velos (As, 7, 12)";
        }
        if (['Loba', 'Chinchon'].includes(game)) {
            return "Un jugador debe cerrar y el resto sumar puntos.";
        }
        return "Revisar datos de la ronda";
    };

    return (
        <div className="modal-footer-content">
            {!isFormValid && (
                <div className="form-error-banner animate-fade-in">
                    <AlertCircle size={14} />
                    <span>{getErrorMessage()}</span>
                </div>
            )}
            
            <Button
                className="w-full py-6 font-black uppercase tracking-widest"
                disabled={!isFormValid || saveRound.isPending}
                loading={saveRound.isPending}
                onClick={() => {
                    saveRound.mutate(
                        { 
                            scores, 
                            isEdit: isEditMode, 
                            roundNumber: roundToEdit ?? undefined 
                        },
                        { onSuccess: onClose }
                    );
                }}
            >
                <Save size={20} />
                {isEditMode ? 'Actualizar Ronda' : 'Confirmar Ronda'}
            </Button>
        </div>
    );
};