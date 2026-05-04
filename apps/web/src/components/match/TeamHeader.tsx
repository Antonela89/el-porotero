import { Crown } from 'lucide-react';
import { getShortName } from '@/utils';

interface TeamHeaderProps {
    teamId: 'A' | 'B';
    allNames: string[];
    players: { name: string; isDealer: boolean }[];
    color: string;
}

export const TeamHeader = ({ teamId, allNames, players, color }: TeamHeaderProps) => (
    <th className="score-header-cell is-team">
        <div className="score-header-stack gap-large">
            <span className={`font-display text-lg uppercase tracking-widest ${color}`}>
                Equipo {teamId}
            </span>

            <div className="team-players-row">
                {players.map((p) => (
                    <div
                        key={p.name}
                        className={`player-badge-pill ${p.isDealer ? 'is-dealer' : 'not-dealer'}`}
                    >
                        <span className="player-initials">
                            {getShortName(p.name, allNames)}
                        </span>
                        {p.isDealer && <Crown size={10} fill="currentColor" />}
                    </div>
                ))}
            </div>
        </div>
    </th>
);