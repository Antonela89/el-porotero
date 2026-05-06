import { Crown, Megaphone } from 'lucide-react';
import { getShortName } from '@/utils';

interface TeamHeaderProps {
    teamId: 'A' | 'B';
    allNames: string[];
    players: { name: string; isDealer: boolean }[];
    color: string;
    showCantar?: boolean;
    onCantar?: (name: string) => void;
}

export const TeamHeader = ({ teamId, allNames, players, color, showCantar, onCantar }: TeamHeaderProps) => (
    <th className="score-header-cell">
        <div className="score-header-stack">
            <span className={`font-display uppercase tracking-widest ${color}`}>
                Equipo {teamId}
            </span>

            <div className="team-players-row">
                {players.map((p) => (
                    <div
                        key={p.name}
                        className={`flex-col player-initials ${p.isDealer ? 'is-dealer' : 'not-dealer'}`}
                    >
                        <span className="player-initials">
                            {getShortName(p.name, allNames)}
                        </span>

                        {showCantar && onCantar && (
                            <button
                                onClick={() => onCantar(p.name)}
                                className="btn-cantar-small"
                                title={`Canto de ${p.name}`}
                            >
                                <Megaphone size={11} />
                            </button>
                        )}

                        <div className="crown-reserved-space">
                            {p.isDealer && <Crown size={10} fill="currentColor" className="text-primary" />}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </th>
);