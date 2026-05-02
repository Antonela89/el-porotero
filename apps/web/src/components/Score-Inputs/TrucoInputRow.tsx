import { RotateCcw } from "lucide-react";
import { IRoundScore, IRoundDetails, IMatch } from '@el-porotero/shared';
import { TRUCO_ACTIONS } from '@/constants/truco_actions';
import { useState } from "react";
import { useTrucoLogic } from '@/hooks/useTrucoLogic'



// Usamos el tipo de payload que definimos en el modal para que no haya errores de TS
type ScoreUpdatePayload = Partial<IRoundScore & IRoundDetails>;

interface TrucoProps {
    match: IMatch,
    score: IRoundScore;
    onUpdate: (payload: ScoreUpdatePayload) => void;
}

export const TrucoInputRow = ({ match, score, onUpdate }: TrucoProps) => {
    const { faltaValue } = useTrucoLogic(match);

    const [selections, setSelections] = useState<Record<string, 'q' | 'nq' | null>>({});

    const handleToggle = (label: string, type: 'q' | 'nq', points: number | string) => {
        const val = points === 'Falta' ? faltaValue : Number(points);
        const isCurrent = selections[label] === type;

        let newPoints = score.pointsAdded || 0;

        if (isCurrent) {
            // DESACTUALIZAR: Si ya estaba seleccionado, lo quitamos
            setSelections({ ...selections, [label]: null });
            newPoints -= val;
        } else {
            // ACTUALIZAR: Si había otro tipo (ej: era Q y ahora es NQ), restamos el viejo
            if (selections[label]) {
                const action = [...TRUCO_ACTIONS.envido, ...TRUCO_ACTIONS.truco].find(a => a.label === label);
                const oldVal = selections[label] === 'q' ? (action?.q === 'Falta' ? faltaValue : Number(action?.q)) : Number(action?.nq);
                newPoints -= oldVal;
            }
            // Sumamos la nueva
            setSelections({ ...selections, [label]: type });
            newPoints += val;
        }

        onUpdate({ pointsAdded: newPoints });
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* GRUPOS DE CANTOS */}
            {[
                { title: 'Envido', actions: TRUCO_ACTIONS.envido, color: 'text-indigo-400' },
                { title: 'Truco', actions: TRUCO_ACTIONS.truco, color: 'text-primary' }
            ].map(group => (
                <div key={group.title} className="flex flex-col gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest ml-1 ${group.color}`}>
                        {group.title}
                    </span>

                    <div className="flex flex-col gap-2">
                        {group.actions.map(action => {
                            const status = selections[action.label];

                            return (
                                <div key={action.label} className="flex items-center bg-background/60 rounded-xl overflow-hidden border border-white/5">
                                    <div className="flex-1 px-4 py-2 text-xs font-bold">{action.label}</div>

                                    {/* BOTÓN QUIERO */}
                                    <button
                                        type="button"
                                        onClick={() => handleToggle(action.label, 'q', action.q)}
                                        className={`flex flex-col items-center p-2 min-w-17.5 border-l border-white/5 transition-all
                                    ${status === 'q' ? 'bg-emerald-500 text-white' : 'hover:bg-emerald-500/10 text-emerald-400 opacity-40'}`}
                                    >
                                        <span className="text-[7px] uppercase font-black">Quiero</span>
                                        <span className="text-sm font-bold">+{action.label === 'Falta Envido' ? faltaValue : action.q}</span>
                                    </button>

                                    {/* BOTÓN NO QUIERO */}
                                    <button
                                        type="button"
                                        onClick={() => handleToggle(action.label, 'nq', action.nq)}
                                        className={`flex flex-col items-center p-2 min-w-17.5 border-l border-white/5 transition-all
                                    ${status === 'nq' ? 'bg-orange-500 text-white' : 'hover:bg-orange-500/10 text-orange-400 opacity-40'}`}
                                    >
                                        <span className="text-[7px] uppercase font-black">No Q.</span>
                                        <span className="text-sm font-bold">+{action.nq}</span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>))}

            {/* MARCADOR DE LA RONDA (SUMATORIA) */}
            < div className="mt-2 bg-primary/5 p-4 rounded-2xl border-2 border-primary/20 flex items-center justify-between" >
                <div className="flex flex-col">
                    <span className="text-[9px] text-text-muted uppercase font-black tracking-widest">Total acumulado mano</span>
                    <span className="text-4xl font-display font-bold text-primary leading-none">
                        {score.pointsAdded || 0} <span className="text-xs font-body opacity-50">pts</span>
                    </span>
                </div>
                <button
                    onClick={() => onUpdate({ pointsAdded: 0 })}
                    className="p-4 bg-surface text-text-muted hover:text-white rounded-xl transition-all active:rotate-180 duration-500"
                    title="Resetear mano"
                >
                    <RotateCcw size={24} />
                </button>
            </div>
        </div >
    );
};