import { IRoundScore, IRoundDetails } from '@el-porotero/shared';
import { Minus, Plus, Coins, Trophy, Layers, Star } from 'lucide-react';
import { IconButton, Button } from '@/components';

interface Props {
    score: IRoundScore;
    onUpdate: (update: Partial<IRoundScore> & Partial<IRoundDetails>) => void;
    onToggleExclusive: (key: keyof IRoundDetails) => void;
}

export const EscobaInputRow = ({ score, onUpdate, onToggleExclusive }: Props) => {
    const d = score.details;

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* CONTADOR DE ESCOBAS */}
            <div className="flex items-center justify-between bg-background/50 p-3 rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                    <Star size={16} className="text-primary" />
                    <span className="text-[10px] font-bold uppercase text-text-muted">Escobas</span>
                </div>
                <div className="flex items-center gap-2">
                    <IconButton
                        icon={<Minus size={16} />}
                        title="Quitar Escoba"
                        onClick={() => onUpdate({ escobas: Math.max(0, (d.escobas || 0) - 1) })}
                    />
                    <span className="font-display font-bold text-xl px-2 min-w-[2rem] text-center">
                        {d.escobas || 0}
                    </span>
                    <IconButton
                        icon={<Plus size={16} />}
                        variant="primary"
                        title="Sumar Escoba"
                        onClick={() => onUpdate({ escobas: (d.escobas || 0) + 1 })}
                    />
                </div>
            </div>

            {/* ÍTEMS DE MESA (Oros, Cartas, Setenta) */}
            <div className="grid grid-cols-3 gap-2">
                {(['hasOros', 'hasCartas', 'hasSetenta'] as const).map((key) => {
                    const config = {
                        hasOros: { label: 'Oros', icon: <Coins size={14} />, activeClass: 'active-oro' },
                        hasCartas: { label: 'Cartas', icon: <Layers size={14} />, activeClass: 'active-cartas' },
                        hasSetenta: { label: 'Setenta', icon: <Trophy size={14} />, activeClass: 'active-setenta' }
                    }[key];

                    const isActive = !!d[key];

                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => onToggleExclusive(key)}
                            className={`table-item-btn ${isActive ? config.activeClass : ''}`}
                        >
                            {config.icon}
                            <span className="text-[8px] font-bold uppercase">{config.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* LÓGICA DE VELOS (As, 7, 12) */}
            <div className="bg-background/50 p-3 rounded-xl border border-white/5 flex flex-col gap-3">
                <span className="text-[9px] font-bold text-text-muted uppercase ml-1">Velos de Oro</span>
                <div className="flex gap-2">
                    {['As', '7', '12'].map((card) => {
                        const key = `hasVelo${card}` as keyof IRoundDetails;
                        const isSelected = !!d[key];

                        return (
                            <Button
                                key={card}
                                variant="ghost"
                                // Usamos la clase personalizada para el color púrpura de los velos
                                className={`flex-1 !py-2 !text-xs ${isSelected ? 'table-item-btn active-velo' : 'opacity-40'}`}
                                onClick={() => onToggleExclusive(key)}
                            >
                                {card}
                            </Button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};