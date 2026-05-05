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
        <div className="score-input-stack">
            {/* CONTADOR DE ESCOBAS */}
            <div className="counter-container-escoba">
                <div className="flex items-center gap-2">
                    <Star size={16} className="text-primary" />
                    <span className="label-mini mb-0!">Escobas</span>
                </div>
                <div className="flex items-center gap-2">
                    <IconButton
                        icon={<Minus size={16} />}
                        title="Quitar Escoba"
                        onClick={() => onUpdate({ escobas: Math.max(0, (d.escobas || 0) - 1) })}
                        className='p-2.5!'
                    />
                    <span className="counter-value px-2 min-w-8 text-center">
                        {d.escobas || 0}
                    </span>
                    <IconButton
                        icon={<Plus size={16} />}
                        variant="primary"
                        title="Sumar Escoba"
                        onClick={() => onUpdate({ escobas: (d.escobas || 0) + 1 })}
                        className='p-2.5!'
                    />
                </div>
            </div>

            {/* ÍTEMS DE MESA (Oros, Cartas, Setenta) */}
            <div className="scoring-grid-3">
                {(['hasOros', 'hasCartas', 'hasSetenta'] as const).map((key) => {
                    const config = {
                        hasOros: { label: 'Oros', icon: <Coins size={14} />, activeClass: 'active-oro' },
                        hasCartas: { label: 'Cartas', icon: <Layers size={14} />, activeClass: 'active-cartas' },
                        hasSetenta: { label: 'Setenta', icon: <Trophy size={14} />, activeClass: 'active-setenta' }
                    }[key];

                    const isActive = !!d[key];

                    return (
                        <Button
                            key={key}
                            onClick={() => onToggleExclusive(key)}
                            className={`table-item-btn ${isActive ? config.activeClass : ''}`}
                        >
                            {config.icon}
                            <span className="text-[8px] font-bold uppercase">{config.label}</span>
                        </Button>
                    );
                })}
            </div>

            {/* LÓGICA DE VELOS (As, 7, 12) */}
            <div className="velo-selection-area">
                <span className="label-mini ml-1">Velos de Oro</span>
                <div className="score-input-row">
                    {['As', '7', '12'].map((card) => {
                        const key = `hasVelo${card}` as keyof IRoundDetails;
                        const isActive = !!d[key];

                        return (
                            <Button
                                key={card}
                                variant="ghost"
                                className={`btn-velo-item ${isActive ? 'active-velo' : ''}`}
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