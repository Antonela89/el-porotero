import { Minus, Plus } from 'lucide-react';
import { IRoundScore, IRoundDetails } from '@el-porotero/shared';

interface BurakoPlayerInputProps {
    score: IRoundScore; 
    onUpdate: (update: Partial<IRoundScore> & Partial<IRoundDetails>) => void;
    isTeamGame: boolean;
}

export const BurakoPlayerInput = ({ score, onUpdate, isTeamGame }: BurakoPlayerInputProps) => {
    // Acceso seguro a los detalles
    const puras = score.details?.canastasPuras || 0;
    const impuras = score.details?.canastasImpuras || 0;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <input
                    type="text" inputMode="numeric" placeholder="Puntos en fichas..."
                    className="form-input bg-background border border-white/10 py-3 text-center rounded-xl outline-none focus:border-primary w-full"
                    value={score.pointsAdded || ""}
                    onChange={(e) => onUpdate({ pointsAdded: parseInt(e.target.value.replace(/\D/g, "")) || 0 })}
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                {/* Contadores de Canastas */}
                <div className="flex items-center justify-between bg-background rounded-xl p-1 border border-white/5">
                    <button onClick={() => onUpdate({ canastasPuras: Math.max(0, puras - 1) })} className="p-2 text-text-muted"><Minus size={14} /></button>
                    <span className="text-primary font-bold">{puras} Puras</span>
                    <button onClick={() => onUpdate({ canastasPuras: puras + 1 })} className="p-2 text-primary"><Plus size={14} /></button>
                </div>
                <div className="flex items-center justify-between bg-background rounded-xl p-1 border border-white/5">
                    <button onClick={() => onUpdate({ canastasImpuras: Math.max(0, impuras - 1) })} className="p-2 text-text-muted"><Minus size={14} /></button>
                    <span className="text-text-main font-bold">{impuras} Imp.</span>
                    <button onClick={() => onUpdate({ canastasImpuras: impuras + 1 })} className="p-2 text-text-main"><Plus size={14} /></button>
                </div>
            </div>

            {/* REGLA: Si NO es por equipos (individual), mostrar los botones aquí */}
            {!isTeamGame && (
                <div className="flex gap-2">
                    <button
                        onClick={() => onUpdate({ isCerrar: !score.details?.isCerrar })}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-bold ${score.details?.isCerrar ? 'bg-emerald-500' : 'bg-surface'}`}
                    >
                        CERRÓ
                    </button>
                    <button
                        onClick={() => onUpdate({ tomoMuerto: !score.details?.tomoMuerto })}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-bold ${score.details?.tomoMuerto ? 'bg-indigo-500' : 'bg-orange-500'}`}
                    >
                        MUERTO
                    </button>
                </div>
            )}
        </div>
    );
};