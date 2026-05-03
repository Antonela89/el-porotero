import { Crown } from 'lucide-react';
import { getShortName } from '@/utils';

interface TeamHeaderProps {
    teamId: 'A' | 'B';
    allNames: string[];
    players: { name: string; isDealer: boolean }[];
    color: string;
}

export const TeamHeader = ({ teamId, allNames, players, color }: TeamHeaderProps) => (
    <th className="p-4 border-r border-white/5">
        <div className="flex flex-col items-center gap-2">
            <span className={`font-display text-lg uppercase tracking-widest ${color}`}>
                Equipo {teamId}
            </span>
            <div className="flex gap-2">
                {players.map((p) => {
                    const shortName = getShortName(p.name, allNames);
                    return (
                        <div
                            key={p.name}
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition-all ${p.isDealer
                                ? 'bg-primary/20 border-primary text-primary'
                                : 'bg-white/5 border-white/10 text-text-muted opacity-60'
                                }`}
                        >
                            <span className="text-[9px] font-black uppercase">
                                {shortName}
                            </span>
                            {p.isDealer && <Crown size={10} fill="currentColor" />}
                        </div>
                    )
                })}
            </div>
        </div>
    </th>
);