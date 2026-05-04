import { Crown, HatGlasses } from 'lucide-react';
import { getShortName } from '@/utils';
import { Button } from '@/components';

interface ScoreHeaderProps {
    name: string;
    allNames: string[];
    isDealer: boolean;
    isSombrero: boolean;
    color?: string;
    showCantar?: boolean; // Solo para Bársiga
    onCantar?: () => void;
}

export const PlayerHeader = ({
    name,
    allNames,
    isDealer,
    isSombrero,
    color = 'text-text-main',
    showCantar,
    onCantar
}: ScoreHeaderProps) => (
    <th className={`score-header-cell ${isDealer ? 'is-dealer' : ''}`}>
        <div className="score-header-stack">
            <div className="score-icon-slot">
                {isDealer && <Crown size={14} fill="currentColor" />}
                {isSombrero && <HatGlasses size={14} className="text-purple-400" />}
            </div>

            <span className={`score-name-main ${color} ${isSombrero ? 'is-sombrero' : ''}`}>
                {getShortName(name, allNames)}
            </span>

            <span className="score-name-sub">{name}</span>

            {showCantar && onCantar && (
                <Button
                    variant="ghost"
                    className="btn-cantar-small"
                    onClick={onCantar}
                >
                    CANTAR
                </Button>
            )}
        </div>
    </th>
);