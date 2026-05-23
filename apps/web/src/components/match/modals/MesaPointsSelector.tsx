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
                const labels = { hasOros: 'Oros', hasCartas: 'Cartas', hasSetenta: '70' };
                const isActive = !!details?.[key];

                return (
                    <Button
                        variant='ghost'
                        key={key}
                        onClick={() => onToggle(key, !isActive)}
                        className={`table-item-btn ${isActive ? `active-${key.replace('has', '').toLowerCase()}` : ''}`}
                    >
                        <span className="text-[9px] font-black uppercase">{labels[key]}</span>
                    </Button>
                );

            })}
        </div>

        <div className="mesa-grid-3">
            {(['As', '7', '12'] as const).map(v => {
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