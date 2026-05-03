import { IRoundScore, IRoundDetails, GameType } from '@el-porotero/shared';
import { Button } from '@/components';

interface AccumulativeInputRowProps {
    gameType: GameType
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
            <Button
                variant={isCerrar ? 'primary' : 'ghost'}
                className="!text-[10px] !py-2 flex-1"
                disabled={disableExclusives && !isCerrar}
                onClick={() => onUpdateDetails({ isCerrar: !isCerrar, isCorteMinus10: false })}
            >
                CERRÓ
            </Button>
            {gameType !== 'Uno' && (
                <Button
                    variant={isCorte ? 'danger' : 'ghost'}
                    className="!text-[10px] !py-2 flex-1"
                    disabled={disableExclusives && !isCorte}
                    onClick={() => onUpdateDetails({ isCorteMinus10: !isCorte, isCerrar: false })}
                >
                    -10
                </Button>
            )}
        </div>
    )
};