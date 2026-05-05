import { Button } from '@/components';
import { IRoundDetails } from '@el-porotero/shared';

interface MesaPointsSelectorProps {
    details: Partial<IRoundDetails> | undefined;
    onToggle: (key: keyof IRoundDetails, val: boolean) => void
}

export const MesaPointsSelector = ({ details, onToggle }: MesaPointsSelectorProps) => (
    <div className="mesa-points-container">
        <div className="mesa-grid-3">
            {(['hasOros', 'hasCartas', 'hasSetenta'] as const).map(key => {
                const classMap = {
                    hasOros: 'active-oro',
                    hasCartas: 'active-cartas',
                    hasSetenta: 'active-setenta'
                };
                const labelMap = { hasOros: 'Oros', hasCartas: 'Cartas', hasSetenta: '70' };

                return (
                    <Button
                        key={key}
                        onClick={() => onToggle(key, !details?.[key])}
                        className={`table-item-btn ${details?.[key] ? classMap[key] : ''}`}
                    >
                        <span className="text-[9px] font-black uppercase">{labelMap[key]}</span>
                    </Button>
                );
            })}
        </div>

        <div className="score-input-row">
            {(['As', '7', '12'] as const).map(v => {
                // CORRECCIÓN: Type casting para que TS no chille
                const key = `hasVelo${v}` as keyof IRoundDetails;
                const isActive = !!details?.[key];

                return (
                    <Button
                        key={v}
                        variant="ghost"
                        className={`btn-velo-item ${isActive ? 'active-velo' : ''}`}
                        onClick={() => onToggle(key, !isActive)}
                    >
                        {v}
                    </Button>
                );
            })}
        </div>
    </div>
);