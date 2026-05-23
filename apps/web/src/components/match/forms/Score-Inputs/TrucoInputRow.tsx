import { RotateCcw } from "lucide-react";
import { IRoundScore, IRoundDetails, IMatch, TrucoFlowState } from '@el-porotero/shared';
import { TRUCO_ACTIONS } from '@/constants';
import { useState } from "react";
import { useTrucoLogic } from '@/hooks';
import { Button, IconButton, ConfirmDialog } from '@/components'

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
    teamId?: 'A' | 'B';
    flowState: TrucoFlowState;
    onUpdate: (payload: Partial<IRoundScore & IRoundDetails>) => void;
    onFlowChange: (newFlow: Partial<TrucoFlowState>) => void;
}

export const TrucoInputRow = ({ match, score, teamId, flowState, onUpdate, onFlowChange }: TrucoProps) => {
    const { faltaValue } = useTrucoLogic(match);
    const [showCleanPoints, setShowCleanPoints] = useState(false);
    const [selections, setSelections] = useState<Record<string, 'q' | 'nq' | null>>({});

    const handleShowClean = () => setShowCleanPoints(true);

    const handleClean = () => {
        setSelections({});
        onUpdate({ pointsAdded: 0 });
        onFlowChange({ envidoClaimedBy: null, trucoClaimedBy: null });

    }

    const handleToggle = (action: ITrucoAction, type: 'q' | 'nq') => {
        const isTrucoGroup = action.id.includes('truco') || action.id.includes('retruco') || action.id.includes('vale');
        const categoryKey = isTrucoGroup ? 'trucoClaimedBy' : 'envidoClaimedBy';

        if (flowState[categoryKey] && flowState[categoryKey] !== teamId) return;

        const label = action.label;
        const isCurrent = selections[label] === type;

        const nextSelections = { ...selections };

        if (isTrucoGroup) {
            TRUCO_ACTIONS.truco.forEach(a => {
                if (a.label !== label) nextSelections[a.label] = null;
            });
            nextSelections[label] = isCurrent ? null : type;
        } else {
            nextSelections[label] = isCurrent ? null : type;
        }

        const getPoints = (val: string | number) => val === 'Falta' ? faltaValue : Number(val);

        const newTotal = Object.entries(nextSelections).reduce((acc, [key, val]) => {
            if (!val) return acc;
            const act = [...TRUCO_ACTIONS.envido, ...TRUCO_ACTIONS.truco].find(a => a.label === key);
            if (!act) return acc;

            return acc + (val === 'q' ? getPoints(act.q) : Number(act.nq));
        }, 0);

        const hasRemainingInCat = Object.keys(nextSelections).some(k => {
            const inCat = isTrucoGroup
                ? TRUCO_ACTIONS.truco.some(a => a.label === k)
                : TRUCO_ACTIONS.envido.some(a => a.label === k);
            return inCat && nextSelections[k] !== null;
        });

        setSelections(nextSelections);
        onFlowChange({ [categoryKey]: hasRemainingInCat ? teamId : null });
        onUpdate({ pointsAdded: newTotal });
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
                                <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-tighter">
                                    Sumando para equipo
                                </span>
                            )}
                        </div>

                        <div className="truco-group-container">
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
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggle(action, 'q')
                                                }
                                                }
                                            >
                                                <div className="truco-btn-content">
                                                    <span className="text-[7px] uppercase opacity-70 grow">Quiero</span>
                                                    <span className="text-sm font-display">+{action.q === 'Falta' ? faltaValue : action.q}</span>
                                                </div>
                                            </Button>

                                            <Button
                                                variant={selections[action.label] === 'nq' ? 'danger' : 'ghost'}
                                                className="truco-btn-split"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggle(action, 'nq')
                                                }
                                                }
                                            >
                                                <div className="truco-btn-content">
                                                    <span className="text-[7px] uppercase opacity-70 grow">No Quiero</span>
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
                        onClick={handleShowClean}
                    />
                </div>
            </div>

            <ConfirmDialog
                isOpen={showCleanPoints}
                onClose={() => setShowCleanPoints(false)}
                onConfirm={handleClean}
                title="¿Limpiar los puntos?"
                description="Los puntos de la ronda volverán a 0. Esta acción no se puede deshacer."
                reset
            />
        </div>
    );
};