import { IRoundScore, IRoundDetails, GameType } from '@el-porotero/shared';
import { Button, Input } from '@/components';

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
        <div className="score-input-col">
            <Input
                type="text"
                inputMode="numeric"
                placeholder="Puntos"
                className="score-input-field w-full"
                disabled={isCerrar || isCorte}
                value={isCerrar ? "0" : isCorte ? "-10" : (score.pointsAdded || "")}
                onChange={(e) => onUpdateScore({ pointsAdded: parseInt(e.target.value.replace(/\D/g, "")) || 0 })}
            />
            <div className='flex w-full gap-2 items-center mt-2'>
                <Button
                    variant={isCerrar ? 'primary' : 'ghost'}
                    className="text-[12px]! py-2! flex-1"
                    disabled={disableExclusives && !isCerrar}
                    onClick={() => onUpdateDetails({ isCerrar: !isCerrar, isCorteMinus10: false })}
                >
                    CERRÓ
                </Button>
                {gameType !== 'Uno' && (
                    <Button
                        variant={isCorte ? 'danger' : 'ghost'}
                        className="text-[12px]! py-2! flex-1"
                        disabled={disableExclusives && !isCorte}
                        onClick={() => onUpdateDetails({ isCorteMinus10: !isCorte, isCerrar: false })}
                    >
                        -10
                    </Button>
                )}
            </div>
        </div>
    )
};