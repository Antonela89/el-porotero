import { RotateCcw, Check } from "lucide-react";
import { IRoundScore, IRoundDetails, IMatch, TrucoFlowState } from '@el-porotero/shared';
import { TRUCO_ACTIONS } from '@/constants'; // Asegurate de que la ruta sea correcta
import { useState } from "react";
import { useTrucoLogic } from '@/hooks';
import { Button } from '@/components'

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
        <div className="flex flex-col gap-5 w-full">
            {[
                { title: 'Envido', actions: TRUCO_ACTIONS.envido as ITrucoAction[], key: 'envidoClaimedBy' as const, color: 'text-indigo-400' },
                { title: 'Truco', actions: TRUCO_ACTIONS.truco as ITrucoAction[], key: 'trucoClaimedBy' as const, color: 'text-primary' }
            ].map(group => {
                const isClaimedByOpponent = flowState[group.key] !== null && flowState[group.key] !== teamId;
                const isClaimedByMe = flowState[group.key] === teamId;

                return (
                    <div key={group.title} className={`flex flex-col gap-2 transition-all duration-500 ${isClaimedByOpponent ? 'opacity-10 grayscale pointer-events-none' : ''}`}>
                        <div className="flex justify-between items-center px-1">
                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${group.color}`}>
                                {group.title}
                            </span>
                            {isClaimedByMe && (
                                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
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
                                    <div key={action.id} className={`flex items-center bg-background/60 rounded-xl overflow-hidden border border-white/5 ${isOtherActiveInGroup ? 'opacity-30' : ''}`}>
                                        <span className="flex-1 px-4 py-2 text-xs font-bold text-text-main">
                                            {action.label}
                                        </span>

                                        <Button
                                            variant={selections[action.label] === 'q' ? 'success' : 'ghost'}
                                            className="rounded-none! border-l px-4! py-2! min-w-20"
                                            onClick={() => handleToggle(action, 'q')}
                                        >
                                            <div className="flex flex-col items-center">
                                                <span className="text-[7px] uppercase opacity-70">Quiero</span>
                                                <span className="text-sm font-display">+{action.q === 'Falta' ? faltaValue : action.q}</span>
                                            </div>
                                        </Button>

                                        <Button
                                            variant={selections[action.label] === 'nq' ? 'danger' : 'ghost'}
                                            className="rounded-none! border-l px-4! py-2! min-w-20"
                                            onClick={() => handleToggle(action, 'nq')}
                                        >
                                            <div className="flex flex-col items-center">
                                                <span className="text-[7px] uppercase opacity-70">No Q.</span>
                                                <span className="text-sm font-display">+{action.nq}</span>
                                            </div>
                                        </Button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                );
            })}

            {/* TOTAL ACUMULADO */}
            <div className="mt-2 bg-primary/5 p-4 rounded-3xl border-2 border-primary/20 flex items-center justify-between shadow-lg">
                <div className="flex flex-col">
                    <span className="text-[9px] text-text-muted uppercase font-black tracking-widest">Total acumulado equipo</span>
                    <span className="text-4xl font-display font-bold text-primary">
                        {score.pointsAdded || 0} <span className="text-xs font-body opacity-40">pts</span>
                    </span>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        if (window.confirm("¿Limpiar puntos de esta mano?")) {
                            setSelections({});
                            onUpdate({ pointsAdded: 0 });
                            onFlowChange({ envidoClaimedBy: null, trucoClaimedBy: null });
                        }
                    }}
                    className="p-4 bg-surface text-text-muted hover:text-white rounded-2xl transition-all active:rotate-180 duration-500"
                >
                    <RotateCcw size={24} />
                </button>
            </div>
        </div>
    );
};