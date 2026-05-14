import { motion }from 'framer-motion';
import { TeamPlayerList } from '@/components';
import { ITeamScore, GameType, IMatchConfig } from '@el-porotero/shared';

interface Player {
    name: string; isDealer: boolean
}; 

interface TeamScoreCardPromps {
    teamId: 'A' | 'B';
    score: ITeamScore["score"];
    limitScore: IMatchConfig["limitScore"];
    gameType: GameType;
    allNames: string[];
    players: Player[];
    showCantar?: boolean;
    onCantar?: (name: string) => void;
}

const MotionDiv = motion.create('div')

export const TeamScoreCard = ({ teamId, score, players, allNames, limitScore, gameType, onCantar }: TeamScoreCardPromps) => {
    const isTeamA = teamId === 'A';
    const colorClass = isTeamA ? 'text-indigo-400' : 'text-rose-400';
    const borderColor = isTeamA ? 'border-indigo-400' : 'border-rose-400';
    const remaining = limitScore > 0 ? limitScore - score : null;

    return (
        <MotionDiv
            layout
            className={`team-card ${borderColor} overflow-hidden shadow-xl`}
        >
            {/* Parte superior: Info del Equipo y Puntaje */}
            <div className="team-card-header">
                <div className="team-info">
                    <span className={`team-label ${colorClass}`}>
                        Equipo {teamId}
                    </span>
                    <span className="team-score-big">
                        {score}
                    </span>
                </div>

                {/* Distancia al límite */}
                {remaining !== null && (
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase font-bold text-text-muted">Restan</span>
                        <span className={`text-2xl font-mono font-bold ${remaining <= 10 ? 'text-rose-500' : 'text-slate-300'}`}>
                            {remaining}
                        </span>
                    </div>
                )}
            </div>

            {/* Parte inferior*/}
            <div className="team-players-footer">
                <TeamPlayerList
                    players={players}
                    allNames={allNames}
                    // color={colorClass}
                    showCantar={gameType === 'Barsiga'}
                    onCantar={onCantar}
                />
            </div>
        </MotionDiv>
    );
};