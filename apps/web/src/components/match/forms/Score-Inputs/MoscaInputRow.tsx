import { IRoundScore, IRoundDetails } from '@el-porotero/shared';
import { Button, IconButton } from '@/components';
import { Minus, Plus } from 'lucide-react';

interface MoscaInputRowProps {
    score: IRoundScore;
    isDealer: boolean;
    onUpdateDetails: (details: Partial<IRoundDetails>) => void;
}

export const MoscaInputRow = ({ score, isDealer, onUpdateDetails }: MoscaInputRowProps) => {
    const hasPassed = !!score.details?.paso;

    const bazas = score.details.bazas || 0;

    return (
        <div className="score-input-col">
            {/* INPUT DE BAZAS */}
            <div className="flex items-center gap-2 flex-1">
                <span className="label-mini">Bazas</span>
                <div className="counter-control">
                    <IconButton title="Restar" icon={<Minus size={14} />} onClick={() => onUpdateDetails({ bazas: Math.max(0, bazas - 1), paso: false })} />
                    <span className="counter-val">{bazas}</span>
                    <IconButton title="Sumar" variant="primary" icon={<Plus size={14} />} onClick={() => onUpdateDetails({ bazas: bazas + 1, paso: false })} />
                </div>
            </div>

            {/* BOTÓN DE PASO (Solo para no-repartidores) */}
            {!isDealer && (
                <Button
                    variant={hasPassed ? 'warning' : 'ghost'}
                    className={`w-full py-2.5! text-[10px]! transition-all ${hasPassed ? 'shadow-lg shadow-warning/10 scale-105' : 'opacity-60'
                        }`}
                    onClick={() => onUpdateDetails({ paso: !hasPassed, bazas: 0 })}
                >
                    {hasPassed ? 'PASÓ' : '¿PASA?'}
                </Button>
            )}

            {isDealer && (
                <div className="flex-1 text-center">
                    <span className="text-[8px] font-bold text-primary/40 uppercase tracking-tighter italic">
                        Mano obligada
                    </span>
                </div>
            )}
        </div>
    );
};