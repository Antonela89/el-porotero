import { RotateCcw, Check } from "lucide-react";
import { IRoundScore, IRoundDetails, IMatch, TrucoFlowState } from '@el-porotero/shared';
import { TRUCO_ACTIONS } from '@/constants';
import { useState } from "react";
import { useTrucoLogic } from '@/hooks';
import { Button, IconButton } from '@/components'

interface ITrucoAction {
    id: string;
    label: string;
    level: number;
    q: number | string;
    nq: number;
}

interface TrucoProps {
    match: IMatch;
    score: IRoundScore;
    teamId: 'A' | 'B';
    flowState: TrucoFlowState;
    onUpdate: (payload: Partial<IRoundScore & IRoundDetails>) => void;
    onFlowChange: (newFlow: Partial<TrucoFlowState>) => void;
}

export const TrucoInputRow = ({ match, score, teamId, flowState, onUpdate, onFlowChange }: TrucoProps) => {
    const { faltaValue } = useTrucoLogic(match);
    const [selections, setSelections] = useState<Record<string, 'q' | 'nq' | null>>({});

    const handleToggle = (action: ITrucoAction, type: 'q' | 'nq') => {
        const isTrucoGroup = action.id.includes('truco') || action.id.includes('retruco') || action.id.includes('vale');
        const categoryKey = isTrucoGroup ? 'trucoClaimedBy' : 'envidoClaimedBy';

        // Bloqueo: si el otro equipo ya anotó acá, no hacemos nada
        if (flowState[categoryKey] && flowState[categoryKey] !== teamId) return;

        const label = action.label;
        const isCurrent = selections[label] === type;
        const getPoints = (val: string | number) => val === 'Falta' ? faltaValue : Number(val);
        const points = type === 'q' ? getPoints(action.q) : Number(action.nq);

        let newPoints = score.pointsAdded || 0;

        if (isTrucoGroup) {
            const groupActions = TRUCO_ACTIONS.truco;
            const currentSelectionKey = Object.keys(selections).find(k =>
                selections[k] !== null && groupActions.some(a => a.label === k)
            );


            if (currentSelectionKey) {
                const oldAction = groupActions.find(a => a.label === currentSelectionKey);
                const oldType = selections[currentSelectionKey]!;
                const oldPoints = oldType === 'q' ? getPoints(oldAction!.q) : Number(oldAction!.nq);
                newPoints -= oldPoints;
            }

            if (isCurrent) {
                // DES-SELECCIONAR
                setSelections(prev => ({ ...prev, [label]: null }));
                onFlowChange({ [categoryKey]: null });
            } else {

                const nextSelections = { ...selections };
                groupActions.forEach(a => nextSelections[a.label] = null); // Limpiamos el grupo
                nextSelections[label] = type;

                setSelections(nextSelections);
                newPoints += points;
                onFlowChange({ [categoryKey]: teamId });
            }
        } else {
            if (isCurrent) {
                setSelections(prev => ({ ...prev, [label]: null }));
                newPoints -= points;
                const hasOtherEnvidos = Object.keys(selections).some(k =>
                    k !== label && selections[k] !== null && TRUCO_ACTIONS.envido.some(a => a.label === k)
                );
                if (!hasOtherEnvidos) onFlowChange({ [categoryKey]: null });
            } else {
                if (selections[label]) {
                    const oldPoints = selections[label] === 'q' ? getPoints(action.q) : Number(action.nq);
                    newPoints -= oldPoints;
                }
                setSelections(prev => ({ ...prev, [label]: type }));
                newPoints += points;
                onFlowChange({ [categoryKey]: teamId });
            }
        }

        onUpdate({ pointsAdded: newPoints });
    };

    return (
        <div className="score-input-stack">
            {[
                { title: 'Envido', actions: TRUCO_ACTIONS.envido as ITrucoAction[], key: 'envidoClaimedBy' as const, color: 'text-indigo-400' },
                { title: 'Truco', actions: TRUCO_ACTIONS.truco as ITrucoAction[], key: 'trucoClaimedBy' as const, color: 'text-primary' }
            ].map(group => {
                const isBlocked = flowState[group.key] !== null && flowState[group.key] !== teamId;
                const isClaimedByMe = flowState[group.key] === teamId;

                return (
                    <div key={group.title} className={`counter-group ${isBlocked ? 'opacity-10 grayscale pointer-events-none' : ''}`}>
                        <div className="flex justify-between items-center p-1">
                            <span className={`label-mini ${group.color}`}>{group.title}</span>
                            {isClaimedByMe && (
                                <span className="text-[10px] bg-emerald-400 text-background p-0.5 rounded-full font-bold flex items-center gap-1">
                                    <Check size={10} /> ANOTADO
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            {group.actions.map((action) => {
                                const status = selections[action.label];
                                const isOtherActiveInGroup = TRUCO_ACTIONS.truco && status === null && Object.keys(selections).some(k =>
                                    selections[k] !== null && group.actions.some(a => a.label === k)
                                );

                                return (
                                    <div key={action.id} className={`flex items-center p-1 bg-background/60 rounded-xl border border-white/5 ${isOtherActiveInGroup ? 'opacity-30' : ''}`}>
                                        <span className="flex-1 p-1 text-xs font-bold text-text-main">
                                            {action.label}
                                        </span>

                                        <div className="flex gap-0.5">
                                            <Button
                                                variant={selections[action.label] === 'q' ? 'success' : 'ghost'}
                                                className="truco-btn-split"
                                                size="sx"
                                                onClick={() => handleToggle(action, 'q')}
                                            >
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[7px] uppercase opacity-70">Quiero</span>
                                                    <span className="text-sm font-display">+{action.q === 'Falta' ? faltaValue : action.q}</span>
                                                </div>
                                            </Button>

                                            <Button
                                                variant={selections[action.label] === 'nq' ? 'danger' : 'ghost'}
                                                className="truco-btn-split"
                                                onClick={() => handleToggle(action, 'nq')}
                                            >
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[7px] uppercase opacity-70">No Q.</span>
                                                    <span className="text-sm font-display">+{action.nq}</span>
                                                </div>
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                );
            })}

            {/* TOTAL ACUMULADO */}
            <div className="truco-total-footer">
                <span className="text-[10px] text-text-muted mt-1 uppercase">Total acumulado</span>
                <div className="flex w-full items-center justify-between">
                    <span className="flex-1 text-4xl font-display font-bold text-primary">
                        {score.pointsAdded || 0} <span className="text-xs font-body opacity-40">pts</span>
                    </span>

                    <IconButton
                        icon={<RotateCcw size={20} />}
                        title="Limpiar puntos"
                        className="p-4! active:rotate-180 duration-500"
                        onClick={() => {
                            if (window.confirm("¿Limpiar puntos?")) {
                                setSelections({});
                                onUpdate({ pointsAdded: 0 });
                                onFlowChange({ envidoClaimedBy: null, trucoClaimedBy: null });
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};