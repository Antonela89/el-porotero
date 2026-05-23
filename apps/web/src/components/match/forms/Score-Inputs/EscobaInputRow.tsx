import { IRoundScore, IRoundDetails } from '@el-porotero/shared';
import { Minus, Plus } from 'lucide-react';
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
                    const labels = { hasOros: 'Oros', hasCartas: 'Cartas', hasSetenta: '70' };

                    const isActive = !!d[key];

                    return (
                        <Button
                            variant='ghost'
                            key={key}
                            onClick={() => onToggleExclusive(key)}
                            className={`table-item-btn ${isActive ? `active-${key.replace('has', '').toLowerCase()}` : ''}`}
                        >
                            <span className="text-[8px] font-bold uppercase">{labels[key]}</span>
                        </Button>
                    );
                })}
            </div>

            {/* LÓGICA DE VELOS (As, 7, 12) */}
            <div className="scoring-grid-3">
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
    );
};