import { IMatch, IRoundScore, IRoundDetails } from '@el-porotero/shared';

export const useEscobaLogic = (match: IMatch) => {
    
    // Validar que los velos tengan dueño
    const validateRound = (scores: IRoundScore[]) => {
        // En ambos juegos pedimos los 3 velos (según tus reglas)
        const requiredVelos = ['hasVeloAs', 'hasVelo7', 'hasVelo12'];
        
        const allVelosAssigned = requiredVelos.every(key => 
            scores.some(s => s.details[key as keyof IRoundDetails] === true)
        );

        return {
            isValid: allVelosAssigned,
            error: !allVelosAssigned ? "Todos los Velos deben tener un dueño" : null
        };
    };

    return { validateRound };
};