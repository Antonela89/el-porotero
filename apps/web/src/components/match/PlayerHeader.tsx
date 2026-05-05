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
    <th className={`p-4 ${isDealer ? 'text-primary' : ''}`}>
        <div className="flex flex-col items-center gap-1">
            <div className="h-4 flex items-center gap-1">
                {isDealer && <Crown size={14} className="text-primary" fill="currentColor" />}
                {isSombrero && <HatGlasses size={14} className="text-purple-400" />}
            </div>
            <span className={`text-lg font-display ${color} ${isSombrero ? 'text-purple-400' : isDealer ? 'text-primary' : ''}`}>
                {getShortName(name, allNames)}
            </span>
            <span className="text-[9px] opacity-50 uppercase tracking-tighter">{name}</span>

            {showCantar && onCantar && (
                <Button
                    variant="ghost"
                    className="text-[8px]! py-0.5! px-2! mt-1 border-pink-500/30 text-pink-400 hover:bg-pink-500"
                    onClick={onCantar}
                >
                    CANTAR
                </Button>
            )}
        </div>
    </th>
);