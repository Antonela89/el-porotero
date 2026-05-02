import { RotateCcw, Minus } from "lucide-react";
import { IRoundScore, IRoundDetails } from '@el-porotero/shared';

// Usamos el tipo de payload que definimos en el modal para que no haya errores de TS
type ScoreUpdatePayload = Partial<IRoundScore & IRoundDetails>;

interface TrucoProps {
    score: IRoundScore;
    onUpdate: (payload: ScoreUpdatePayload) => void;
}

export const TrucoInputRow = ({ score, onUpdate }: TrucoProps) => {
    // Definimos los botones rápidos clásicos del Truco
    const quickPoints = [1, 2, 3];

    return (
        <div className="flex flex-col gap-4 w-full bg-background/20 p-4 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between gap-2">

                {/* BOTÓN PARA RESTAR (Corrección de error) */}
                <button
                    type="button"
                    onClick={() => onUpdate({ pointsAdded: Math.max(0, (score.pointsAdded || 0) - 1) })}
                    className="p-3 bg-surface border border-white/5 rounded-xl text-orange-400 active:scale-90 transition-all hover:bg-orange-500/10"
                    title="Restar 1"
                >
                    <Minus size={18} />
                </button>

                {/* BOTONES RÁPIDOS PARA SUMAR */}
                <div className="flex flex-1 gap-2">
                    {quickPoints.map(p => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => onUpdate({ pointsAdded: (score.pointsAdded || 0) + p })}
                            className="flex-1 py-3 bg-primary/10 border border-primary/20 rounded-xl text-primary font-bold text-lg active:scale-95 transition-all hover:bg-primary hover:text-background"
                        >
                            +{p}
                        </button>
                    ))}
                </div>

                {/* BOTÓN RESET (Resetear la mano) */}
                <button
                    type="button"
                    onClick={() => {
                        if (window.confirm("¿Resetear puntos de esta ronda?")) {
                            onUpdate({ pointsAdded: 0 });
                        }
                    }}
                    className="p-3 bg-surface border border-white/5 rounded-xl text-text-muted active:scale-90 transition-all hover:text-white"
                    title="Resetear mano"
                >
                    <RotateCcw size={18} />
                </button>
            </div>

            {/* VISUALIZACIÓN DE PUNTOS QUE SE ESTÁN ANOTANDO */}
            <div className="flex items-center justify-center gap-3 py-2 bg-background/40 rounded-xl border border-dashed border-white/10">
                <span className="text-[10px] text-text-muted uppercase font-black tracking-widest">
                    Anotando en esta ronda:
                </span>
                <span className="text-2xl font-display font-bold text-primary animate-in zoom-in duration-300">
                    {score.pointsAdded || 0}
                </span>
            </div>
        </div>
    );
};