import { Minus, Plus, Check, Ghost } from 'lucide-react';
import { IRoundScore, IRoundDetails } from '@el-porotero/shared';

interface BurakoPlayerInputProps {
    score: IRoundScore;
    // Unificamos la función de actualización en una sola para simplificar el Modal
    onUpdate: (update: Partial<IRoundScore> & Partial<IRoundDetails>) => void;
    isTeamGame: boolean;
    disableExclusives?: boolean;
}

export const BurakoPlayerInput = ({
    score,
    onUpdate,
    isTeamGame,
    disableExclusives = false
}: BurakoPlayerInputProps) => {

    // Atajos para legibilidad
    const puras = score.details?.canastasPuras || 0;
    const impuras = score.details?.canastasImpuras || 0;
    const cerro = score.details?.isCerrar || false;
    const muerto = score.details?.tomoMuerto ?? true; // Por defecto asumimos que sí lo tomó

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* 1. INPUT DE PUNTOS DE FICHAS (Base de la ronda) */}
            <div className="flex flex-col gap-1">
                <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Suma de fichas..."
                    className="form-input bg-background border border-white/10 py-3 text-center rounded-xl outline-none focus:border-primary w-full transition-all"
                    value={score.pointsAdded || ""}
                    onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        onUpdate({ pointsAdded: parseInt(val) || 0 });
                    }}
                />
            </div>

            {/* 2. CONTADORES DE CANASTAS (Individuales) */}
            <div className="grid grid-cols-2 gap-3">
                {/* Puras */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex flex-col items-center">
                        <span className="text-[8px] text-text-muted font-bold uppercase">Puras</span>
                    </div>
                    <div className="flex items-center justify-between bg-background rounded-xl p-1 border border-white/5 shadow-inner">
                        <button
                            onClick={() => onUpdate({ canastasPuras: Math.max(0, puras - 1) })}
                            className="p-2 text-text-muted hover:text-white transition-colors"
                        >
                            <Minus size={14} />
                        </button>
                        <div className="flex flex-col items-center">
                            <span className="font-display text-primary font-bold leading-none">{puras}</span>
                        </div>
                        <button
                            onClick={() => onUpdate({ canastasPuras: puras + 1 })}
                            className="p-2 text-primary hover:text-white transition-colors"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                </div>

                {/* Impuras */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex flex-col items-center">
                        <span className="text-[8px] text-text-muted font-bold uppercase">Impuras</span>
                    </div>
                    <div className="flex items-center justify-between bg-background rounded-xl p-1 border border-white/5 shadow-inner">
                        <button
                            onClick={() => onUpdate({ canastasImpuras: Math.max(0, impuras - 1) })}
                            className="p-2 text-text-muted hover:text-white transition-colors"
                        >
                            <Minus size={14} />
                        </button>
                        <div className="flex flex-col items-center">
                            <span className="font-display text-text-main font-bold leading-none">{impuras}</span>
                        </div>
                        <button
                            onClick={() => onUpdate({ canastasImpuras: impuras + 1 })}
                            className="p-2 text-text-main hover:text-white transition-colors"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. ACCIONES DE CIERRE (Solo si NO es por equipos) */}
            {/* Si es por equipos, estos botones desaparecen de acá porque están arriba de todo el equipo en el Modal */}
            {!isTeamGame && (
                <div className="flex gap-2">
                    <button
                        disabled={disableExclusives && !cerro}
                        onClick={() => onUpdate({ isCerrar: !cerro })}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 transition-all
                            ${cerro ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-surface text-text-muted border border-white/5 opacity-50'}`}
                    >
                        <Check size={14} /> CERRÓ
                    </button>

                    <button
                        onClick={() => onUpdate({ tomoMuerto: !muerto })}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 transition-all
                            ${muerto ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'}`}
                    >
                        {muerto ? <Check size={14} /> : <Ghost size={14} />}
                        {muerto ? 'MUERTO' : 'SIN MUERTO'}
                    </button>
                </div>
            )}
        </div>
    );
};