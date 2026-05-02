import { IRoundScore, IRoundDetails } from '@el-porotero/shared';

interface AccumulativeInputRowProps {
    gameType: string
    score: IRoundScore;
    onUpdateScore: (fields: Partial<IRoundScore> & Partial<IRoundDetails>) => void;
    onUpdateDetails: (fields: Partial<IRoundScore> & Partial<IRoundDetails>) => void;
    disableExclusives: boolean;
}

export const AccumulativeInputRow = ({ gameType, score, onUpdateScore, onUpdateDetails, disableExclusives }: AccumulativeInputRowProps) => {
    const isCerrar = !!score.details?.isCerrar;
    const isCorte = !!score.details?.isCorteMinus10;

    return (

        <div className="flex flex-1 items-center gap-2">
            <input
                type="text"
                inputMode="numeric"
                placeholder="Puntos"
                className="form-input bg-background border border-white/10 py-2 text-center w-12 rounded-lg flex-1"
                disabled={isCerrar || isCorte}
                value={isCerrar ? "0" : isCorte ? "-10" : (score.pointsAdded || "")}
                onChange={(e) => onUpdateScore({ pointsAdded: parseInt(e.target.value.replace(/\D/g, "")) || 0 })}
            />
            <button
                type="button"
                disabled={disableExclusives && !isCerrar}
                onClick={() => onUpdateDetails({ isCerrar: !isCerrar, isCorteMinus10: false })}
                className={`px-3 py-2 rounded-lg text-[10px] font-bold ${isCerrar ? 'bg-primary text-background' : 'bg-surface opacity-50'}`}
            >
                CERRÓ
            </button>

            {gameType !== 'Uno' && (
                <button
                    type="button"
                    disabled={disableExclusives && !isCorte}
                    onClick={() => onUpdateDetails({ isCorteMinus10: !isCorte, isCerrar: false })}
                    className={`px-3 py-2 rounded-lg text-[10px] font-bold ${isCorte ? 'bg-orange-500 text-white' : 'bg-surface opacity-50'}`}
                >
                    -10
                </button>
            )}
        </div>
    )
};