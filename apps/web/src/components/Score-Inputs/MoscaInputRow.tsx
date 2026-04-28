import { IRoundScore, IRoundDetails } from '@el-porotero/shared';


interface MoscaInputRowProps {
    score: IRoundScore;
    isDealer: boolean;
    onUpdateDetails: (details: Partial<IRoundDetails>) => void;
}

export const MoscaInputRow = ({ score, isDealer, onUpdateDetails }: MoscaInputRowProps) => (
    <div className="flex flex-1 items-center gap-2">
        <label className="text-[10px] text-text-muted uppercase font-bold">Bazas:</label>
        <input
            type="text"
            inputMode="numeric"
            className="form-input bg-background border border-white/10 py-2 text-center w-12 rounded-lg outline-none focus:border-primary"
            value={score.details?.bazas || ""}
            disabled={score.details?.paso}
            onChange={(e) => onUpdateDetails({ bazas: parseInt(e.target.value.replace(/\D/g, "")) || 0 })}
        />
        {!isDealer && (
            <button
                onClick={() => onUpdateDetails({ paso: !score.details?.paso, bazas: 0 })}
                className={`flex-1 p-2 rounded-lg text-[10px] font-bold transition-all ${score.details?.paso ? 'bg-warning text-background' : 'bg-surface text-text-muted'}`}
            >
                {score.details?.paso ? 'PASÓ' : '¿PASA?'}
            </button>
        )}
    </div>
);