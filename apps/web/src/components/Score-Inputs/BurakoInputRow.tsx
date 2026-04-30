import { IRoundScore, IRoundDetails } from "@el-porotero/shared";
import { Plus, Minus, Check, Ghost } from "lucide-react";

interface BurakoInputRowProps {
    score: IRoundScore; // Recibimos el objeto completo de la ronda para este jugador
    onUpdateScore: (fields: Partial<IRoundScore>) => void;
    onUpdateDetails: (details: Partial<IRoundDetails>) => void;
    disableExclusives: boolean; // Para que un solo equipo pueda cerrar
}

export const BurakoInputRow = ({ score, onUpdateScore, onUpdateDetails, disableExclusives }: BurakoInputRowProps) => {

    // Atajos para leer los detalles actuales
    const puras = score.details?.canastasPuras || 0;
    const impuras = score.details?.canastasImpuras || 0;
    const cerro = score.details?.isCerrar || false;
    const muerto = score.details?.tomoMuerto ?? true; // Por defecto asumimos que sí lo tomó

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* INPUT DE PUNTOS DE FICHAS */}
            <div className="flex flex-col gap-1">
                <label className="text-[10px] text-text-muted uppercase font-bold ml-1">Puntos en Fichas</label>
                <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Suma de fichas..."
                    className="form-input bg-background border border-white/10 py-3 text-center rounded-xl outline-none focus:border-primary"
                    value={score.pointsAdded || ""}
                    onChange={(e) => onUpdateScore({ pointsAdded: parseInt(e.target.value.replace(/\D/g, "")) || 0 })}
                />
            </div>

            {/* CONTADORES DE CANASTAS */}
            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                    <span className="text-[9px] text-text-muted uppercase text-center font-bold">Puras (+200)</span>
                    <div className="flex items-center justify-between bg-background rounded-xl p-1 border border-white/5">
                        <button onClick={() => onUpdateDetails({ canastasPuras: Math.max(0, puras - 1) })} className="p-2 text-text-muted"><Minus size={14} /></button>
                        <span className="font-display text-primary font-bold">{puras}</span>
                        <button onClick={() => onUpdateDetails({ canastasPuras: puras + 1 })} className="p-2 text-primary"><Plus size={14} /></button>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-[9px] text-text-muted uppercase text-center font-bold">Impuras (+100)</span>
                    <div className="flex items-center justify-between bg-background rounded-xl p-1 border border-white/5">
                        <button onClick={() => onUpdateDetails({ canastasImpuras: Math.max(0, impuras - 1) })} className="p-2 text-text-muted"><Minus size={14} /></button>
                        <span className="font-display text-text-main font-bold">{impuras}</span>
                        <button onClick={() => onUpdateDetails({ canastasImpuras: impuras + 1 })} className="p-2 text-text-main"><Plus size={14} /></button>
                    </div>
                </div>
            </div>

            {/* TOGGLES DE CIERRE Y MUERTO */}
            <div className="flex gap-2">
                <button
                    disabled={disableExclusives && !cerro}
                    onClick={() => onUpdateDetails({ isCerrar: !cerro })}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 transition-all
                        ${cerro ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-surface text-text-muted border border-white/5 opacity-50'}`}
                >
                    <Check size={14} /> CERRÓ
                </button>

                <button
                    onClick={() => onUpdateDetails({ tomoMuerto: !muerto })}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 transition-all
                        ${muerto ? 'bg-indigo-500 text-white' : 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'}`}
                >
                    {muerto ? <Check size={14} /> : <Ghost size={14} />}
                    {muerto ? 'MUERTO' : 'SIN MUERTO'}
                </button>
            </div>
        </div>
    );
};