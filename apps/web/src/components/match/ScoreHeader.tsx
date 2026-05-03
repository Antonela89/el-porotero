import { Crown, HatGlasses } from 'lucide-react';
import { getShortName } from '@/utils/formatters';

export const PlayerHeader = ({ name, allNames, isDealer, isSombrero, color = 'text-text-main' }: any) => (
    <th className={`p-4 ${isDealer ? 'text-primary' : ''}`}>
        <div className="flex flex-col items-center gap-1">
            <div className="h-4 flex items-center gap-1">
                {isDealer && <Crown size={14} className="text-primary" fill="currentColor" />}
                {isSombrero && <HatGlasses size={14} className="text-purple-400" />}
            </div>
            <span className={`text-lg font-display ${color} ${isSombrero ? 'text-purple-400' : ''}`}>
                {getShortName(name, allNames)}
            </span>
            <span className="text-[9px] opacity-50 uppercase tracking-tighter">{name}</span>
        </div>
    </th>
);