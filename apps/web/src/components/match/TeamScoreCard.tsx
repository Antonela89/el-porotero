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
    const borderColor = isTeamA ? 'border-indigo-500/30' : 'border-rose-500/30';
    const remaining = limitScore > 0 ? limitScore - score : null;

    return (
        <MotionDiv
            layout
            className={`flex flex-col rounded-3xl border-2 bg-slate-800/80 backdrop-blur-md ${borderColor} overflow-hidden shadow-xl`}
        >
            {/* Parte superior: Info del Equipo y Puntaje */}
            <div className="p-5 flex justify-between items-center bg-white/5">
                <div className="flex flex-col">
                    <span className={`text-xs font-black uppercase tracking-tighter opacity-70 ${colorClass}`}>
                        Equipo {teamId}
                    </span>
                    <span className="text-5xl font-display font-black text-white">
                        {score}
                    </span>
                </div>

                {/* Distancia al límite */}
                {remaining !== null && (
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase font-bold text-slate-500">Restan</span>
                        <span className={`text-2xl font-mono font-bold ${remaining <= 10 ? 'text-rose-500' : 'text-slate-300'}`}>
                            {remaining}
                        </span>
                    </div>
                )}
            </div>

            {/* Parte inferior: Tu lógica de jugadores refactorizada */}
            <div className="px-5 pb-4">
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