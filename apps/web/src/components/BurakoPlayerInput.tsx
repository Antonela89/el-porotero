import { Minus, Plus } from 'lucide-react';
import { IRoundScore, IRoundDetails } from '@el-porotero/shared';

interface BurakoPlayerInputProps {
    score: IRoundScore; // Cambiado de number a IRoundScore
    // Definimos que el update puede ser de la base (pointsAdded) o de los detalles
    onUpdate: (update: Partial<IRoundScore> & Partial<IRoundDetails>) => void;
}

export const BurakoPlayerInput = ({ score, onUpdate }: BurakoPlayerInputProps) => {
    // Acceso seguro a los detalles
    const puras = score.details?.canastasPuras || 0;
    const impuras = score.details?.canastasImpuras || 0;

    return (
        <div className="flex flex-col gap-4">
            {/* INPUT DE FICHAS (pointsAdded) */}
            <div className="flex flex-col gap-1">
                <label className="text-[9px] text-text-muted uppercase font-bold ml-1 text-left">Fichas en mesa</label>
                <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Suma de fichas..."
                    className="form-input bg-background border border-white/10 py-3 text-center rounded-xl outline-none focus:border-primary w-full"
                    value={score.pointsAdded || ""}
                    onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        onUpdate({ pointsAdded: parseInt(val) || 0 });
                    }}
                />
            </div>

            {/* CONTADORES DE CANASTAS (details) */}
            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between bg-background rounded-xl p-1 border border-white/5">
                        <button
                            onClick={() => onUpdate({ canastasPuras: Math.max(0, puras - 1) })}
                            className="p-2 text-text-muted hover:text-white"
                        >
                            <Minus size={14} />
                        </button>
                        <div className="flex flex-col items-center">
                            <span className="text-[8px] text-text-muted font-bold uppercase">Puras</span>
                            <span className="font-display text-primary font-bold">{puras}</span>
                        </div>
                        <button
                            onClick={() => onUpdate({ canastasPuras: puras + 1 })}
                            className="p-2 text-primary hover:text-white"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between bg-background rounded-xl p-1 border border-white/5">
                        <button
                            onClick={() => onUpdate({ canastasImpuras: Math.max(0, impuras - 1) })}
                            className="p-2 text-text-muted hover:text-white"
                        >
                            <Minus size={14} />
                        </button>
                        <div className="flex flex-col items-center">
                            <span className="text-[8px] text-text-muted font-bold uppercase">Impuras</span>
                            <span className="font-display text-text-main font-bold">{impuras}</span>
                        </div>
                        <button
                            onClick={() => onUpdate({ canastasImpuras: impuras + 1 })}
                            className="p-2 text-text-main hover:text-white"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};