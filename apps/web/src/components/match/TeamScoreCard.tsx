import { motion } from 'framer-motion';
import { TeamPlayerList, ScoreProgressBar } from '@/components';
import { Trophy, RefreshCw } from 'lucide-react';
import { ITeamScore, GameType, IMatchConfig, IMatch } from '@el-porotero/shared';

interface Player {
    name: string; isDealer: boolean
};

interface TeamScoreCardPromps {
    teamId: 'A' | 'B';
    match: IMatch;
    score: ITeamScore["score"];
    winner?: string;
    limitScore: IMatchConfig["limitScore"];
    isWinnerOnLimit: boolean;
    gameType: GameType;
    allNames: string[];
    players: Player[];
    showCantar?: boolean;
    onCantar?: (name: string) => void;
    onRematch: (match: IMatch) => void;
}

const MotionArticle = motion.create('article')

export const TeamScoreCard = ({ teamId, match, score, winner, players, allNames, limitScore, isWinnerOnLimit, gameType, onCantar, onRematch }: TeamScoreCardPromps) => {
    const isTeamA = teamId === 'A';
    const colorClass = isTeamA ? 'text-indigo-400' : 'text-rose-400';
    const borderColor = isTeamA ? 'border-indigo-400' : 'border-rose-400';
    const remaining = limitScore > 0 ? limitScore - score : null;
    const isCritical = limitScore ? (remaining !== null && remaining <= 20) : (remaining !== null && remaining <= 10);
    const isWinner = winner === teamId;

    return (
        <div className="card-container" style={{ perspective: '1000px' }}>

            <MotionArticle
                className="card-inner"
                initial={false}
                animate={{ rotateY: isWinner ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                style={{ transformStyle: 'preserve-3d', position: 'relative', width: '100%', height: '100%' }}
            >

                {/* LADO A: EL MARCADOR (Frente) */}
                <article
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

                        {remaining !== null && (
                            <div className={`flex flex-col items-end ${isCritical ? 'text-esmerald-400 animate-pulse' : 'text-text-muted'}`}>
                                <div style={{ width: '120px' }}>
                                    {isWinnerOnLimit && `A ${remaining} de ganar`}
                                    <ScoreProgressBar
                                        current={score}
                                        limit={limitScore}
                                        isLoseOnLimit={isWinnerOnLimit}
                                    />
                                </div>
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
                </article >

                {/* LADO B: EL GANADOR (Detrás) */}
                <div
                    className="card-back"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0
                    }}
                >
                    <article className="winner-card-inner">
                        <Trophy size={32} className="text-primary mb-1" />
                        <h3 className="winner-name">{teamId}</h3>
                        <p className="winner-label">¡GANADORES!</p>

                        <button className="btn-rematch-compact" onClick={() => onRematch(match)}>
                            <RefreshCw size={14} /> REVANCHA
                        </button>
                    </article>
                </div>
            </MotionArticle>
        </div>

    );
};