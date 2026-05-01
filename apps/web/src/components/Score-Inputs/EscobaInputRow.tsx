// apps/web/src/components/score-inputs/EscobaInputRow.tsx
import { IRoundScore, IRoundDetails } from '@el-porotero/shared';
import { Minus, Plus, Coins, Trophy, Layers, Star } from 'lucide-react';

interface Props {
    score: IRoundScore;
    onUpdate: (update: Partial<IRoundScore> & Partial<IRoundDetails>) => void;
    onToggleExclusive: (key: keyof IRoundDetails) => void;
    isBarsiga: boolean;
}

export const EscobaInputRow = ({ score, onUpdate, onToggleExclusive, isBarsiga }: Props) => {
    const d = score.details;

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* CONTADOR DE ESCOBAS */}
            <div className="flex items-center justify-between bg-background/50 p-3 rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                    <Star size={16} className="text-primary" />
                    <span className="text-[10px] font-bold uppercase text-text-muted">Escobas</span>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => onUpdate({ escobas: Math.max(0, (d.escobas || 0) - 1) })} className="text-text-muted"><Minus size={16} /></button>
                    <span className="font-display font-bold text-xl">{d.escobas || 0}</span>
                    <button onClick={() => onUpdate({ escobas: (d.escobas || 0) + 1 })} className="text-primary"><Plus size={16} /></button>
                </div>
            </div>

            {/* ÍTEMS DE MESA  */}
            <div className="grid grid-cols-3 gap-2">
                {[
                    { key: 'hasOros', label: 'Oros', color: 'yellow', icon: <Coins size={14} /> },
                    { key: 'hasCartas', label: 'Cartas', color: 'blue', icon: <Layers size={14} /> },
                    { key: 'hasSetenta', label: 'Setenta', color: 'emerald', icon: <Trophy size={14} /> }
                ].map((item) => (
                    <button
                        key={item.key}
                        type="button"
                        onClick={() => onToggleExclusive(item.key as keyof IRoundDetails)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all duration-300
                            ${d[item.key as keyof IRoundDetails]
                                ? `bg-${item.color}-500/20 border-${item.color}-500 text-${item.color}-500 shadow-lg shadow-${item.color}-500/10`
                                : 'bg-surface border-white/5 text-text-muted opacity-50 hover:opacity-100'}`}
                    >
                        {item.icon}
                        <span className="text-[8px] font-bold uppercase">{item.label}</span>
                    </button>
                ))}
            </div>

            {/* 3. LÓGICA DE VELOS (Exclusivos) */}
            <div className="bg-background/50 p-3 rounded-xl border border-white/5 flex flex-col gap-3">
                <span className="text-[9px] font-bold text-text-muted uppercase ml-1">Velos de Oro</span>
                <div className="flex items-center gap-3">
                    <div className="flex gap-2 flex-1">
                        {['As', '7', '12'].map((card) => {
                            const key = `hasVelo${card}` as keyof IRoundDetails;
                            const isSelected = !!d[key];

                            return (
                                <button
                                    key={card}
                                    type="button"
                                    onClick={() => onToggleExclusive(key)}
                                    className={`grow py-2 rounded-xl border font-bold text-xs transition-all duration-300
                                        ${isSelected
                                            ? 'bg-purple-500/20 border-purple-500 text-purple-400 shadow-lg shadow-purple-500/10 scale-105'
                                            : 'bg-surface border-white/5 text-text-muted opacity-40 hover:opacity-100'}`}
                                >
                                    {card}
                                </button>
                            );
                        })}
                    </div>

                    {/* CANTOS (Solo Bársiga) */}
                    {isBarsiga && (
                        <div className="flex flex-col items-end shrink-0">
                            <label className="text-[8px] text-text-muted uppercase font-bold mb-1">Cantos</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="0"
                                className="w-12 bg-background border border-white/10 rounded-lg text-center py-1 text-sm outline-none focus:border-primary transition-all"
                                value={d.cantos || ""}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, "");
                                    onUpdate({ cantos: parseInt(val) || 0 });
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};