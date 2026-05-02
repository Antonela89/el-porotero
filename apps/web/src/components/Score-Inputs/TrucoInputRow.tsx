import { RotateCcw } from "lucide-react";
import { IRoundScore, IRoundDetails, IMatch } from '@el-porotero/shared';
import { TRUCO_ACTIONS } from '@/constants/truco_actions';
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

    const addPoints = (pts: number | string) => {
        const value = pts === 'Falta' ? faltaValue : Number(pts);
        onUpdate({ pointsAdded: (score.pointsAdded || 0) + value });
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* GRUPOS DE CANTOS */}
            {[
                { title: 'Envido', actions: TRUCO_ACTIONS.envido, color: 'text-indigo-400' },
                { title: 'Truco y Flor', actions: TRUCO_ACTIONS.truco, color: 'text-primary' }
            ].map(group => (
                <div key={group.title} className="flex flex-col gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest ml-1 ${group.color}`}>
                        {group.title}
                    </span>

                    <div className="flex flex-col gap-2">
                        {group.actions.map(action => (
                            <div key={action.label} className="flex items-center bg-background/60 rounded-xl overflow-hidden border border-white/5">
                                {/* Nombre del Canto */}
                                <div className="flex-1 px-4 py-2">
                                    <span className="text-xs font-bold text-text-main">{action.label}</span>
                                </div>

                                {/* Botón Querido (Q) */}
                                <button
                                    onClick={() => addPoints(action.q)}
                                    className="flex flex-col items-center justify-center px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border-l border-white/5 min-w-17.5 transition-colors"
                                >
                                    <span className="text-[8px] font-black text-emerald-400 uppercase">Quiero</span>
                                    <span className="text-sm font-display font-bold text-emerald-400">
                                        +{action.q === 'Falta' ? faltaValue : action.q}
                                    </span>
                                </button>

                                {/* Botón No Querido (NQ) */}
                                <button
                                    onClick={() => addPoints(action.nq)}
                                    className="flex flex-col items-center justify-center px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 border-l border-white/5 min-w-17.5 transition-colors"
                                >
                                    <span className="text-[8px] font-black text-orange-400 uppercase">No Q.</span>
                                    <span className="text-sm font-display font-bold text-orange-400">+{action.nq}</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* MARCADOR DE LA RONDA (SUMATORIA) */}
            <div className="mt-2 bg-primary/5 p-4 rounded-2xl border-2 border-primary/20 flex items-center justify-between">
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
        </div>
    );
};