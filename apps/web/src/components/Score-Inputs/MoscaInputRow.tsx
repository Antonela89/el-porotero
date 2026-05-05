import { IRoundScore, IRoundDetails } from '@el-porotero/shared';
import { Button, Input } from '@/components';

interface MoscaInputRowProps {
    score: IRoundScore;
    isDealer: boolean;
    onUpdateDetails: (details: Partial<IRoundDetails>) => void;
}

export const MoscaInputRow = ({ score, isDealer, onUpdateDetails }: MoscaInputRowProps) => {
    const hasPassed = !!score.details?.paso;

    return (
        <div className="score-input-col">
            {/* INPUT DE BAZAS */}
            <div className="flex items-center gap-2 flex-1">
                <label className="label-mini">Bazas</label>
                <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    className="score-input-field w-full flex-1 py-2!"
                    value={score.details?.bazas ?? ""}
                    disabled={hasPassed}
                    onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        onUpdateDetails({ bazas: parseInt(val) || 0 });
                    }}
                />
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