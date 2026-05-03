import { IRoundScore, IRoundDetails } from '@el-porotero/shared';
import { Button } from '@/components';

interface MoscaInputRowProps {
    score: IRoundScore;
    isDealer: boolean;
    onUpdateDetails: (details: Partial<IRoundDetails>) => void;
}

export const MoscaInputRow = ({ score, isDealer, onUpdateDetails }: MoscaInputRowProps) => {
    const hasPassed = !!score.details?.paso;

    return (
        <div className="flex flex-1 items-center gap-3">
            {/* INPUT DE BAZAS */}
            <div className="flex items-center gap-2 flex-1">
                <label className="text-[10px] text-text-muted uppercase font-black tracking-widest">
                    Bazas
                </label>
                <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    // Agregamos font-display y rounded-xl para coherencia visual
                    className="form-input bg-background border border-white/10 py-2 text-center w-14 rounded-xl outline-none focus:border-primary transition-all font-display text-lg"
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
                    // Si pasó, resaltamos con warning (naranja). Si no, queda en ghost (pálido).
                    variant={hasPassed ? 'warning' : 'ghost'}
                    className={`flex-1 !py-2.5 !text-[10px] transition-all ${hasPassed ? 'shadow-lg shadow-warning/10 scale-105' : 'opacity-60'
                        }`}
                    onClick={() => onUpdateDetails({ paso: !hasPassed, bazas: 0 })}
                >
                    {hasPassed ? 'PASÓ' : '¿PASA?'}
                </Button>
            )}

            {/* Si es Dealer, ponemos un placeholder visual para mantener el alineado */}
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