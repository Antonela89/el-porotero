import { IRoundScore, IRoundDetails } from '@el-porotero/shared';

interface AccumulativeInputRowProps {
    score: IRoundScore;
    onUpdateScore: (fields: Partial<IRoundScore> & Partial<IRoundDetails>) => void;
    onUpdateDetails: (fields: Partial<IRoundScore> & Partial<IRoundDetails>) => void;
    disableExclusives: boolean;
}

export const AccumulativeInputRow = ({ score, onUpdateScore, onUpdateDetails, disableExclusives }: AccumulativeInputRowProps) => (
    <div className="flex flex-1 items-center gap-2">
        <input
            type="text"
            inputMode="numeric"
            placeholder="Puntos"
            className="form-input bg-background border border-white/10 py-2 text-center w-12 rounded-lg flex-1"
            disabled={score.details?.isCerrar || score.details?.isCorteMinus10}
            value={score.details?.isCerrar ? "0" : score.details?.isCorteMinus10 ? "-10" : (score.pointsAdded || "")}
            onChange={(e) => onUpdateScore({ pointsAdded: parseInt(e.target.value.replace(/\D/g, "")) || 0 })}
        />
        <button
            disabled={disableExclusives && !score.details?.isCerrar}
            onClick={() => onUpdateDetails({ isCerrar: !score.details?.isCerrar, isCorteMinus10: false, pointsAdded: 0 })}
            className={`px-3 py-2 rounded-lg text-[10px] font-bold ${score.details?.isCerrar ? 'bg-primary text-background' : 'bg-surface opacity-50'}`}
        >
            CERRÓ
        </button>
        <button
            disabled={disableExclusives && !score.details?.isCorteMinus10}
            onClick={() => onUpdateDetails({ isCorteMinus10: !score.details?.isCorteMinus10, isCerrar: false, pointsAdded: -10 })}
            className={`px-3 py-2 rounded-lg text-[10px] font-bold ${score.details?.isCorteMinus10 ? 'bg-orange-500 text-white' : 'bg-surface opacity-50'}`}
        >
            -10
        </button>
    </div>
);