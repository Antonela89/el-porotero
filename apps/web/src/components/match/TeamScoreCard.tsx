import { motion } from 'framer-motion';
import { TeamPlayerList, ScoreProgressBar } from '@/components';
import { Trophy, RefreshCw } from 'lucide-react';
import { IMatch } from '@el-porotero/shared';
import { getPointsToLimit, getTeamTempCantosSum, getTeamStyle, getScoreStatus, getTeamPlayersData, getTeamTotalScore } from '@/utils';

interface TeamScoreCardPromps {
    teamId: 'A' | 'B';
    match: IMatch;
    winner?: string;
    isWinnerOnLimit: boolean;
    showCantar?: boolean;
    onCantar?: (name: string) => void;
    onRematch: (match: IMatch) => void;
}

const MotionArticle = motion.create('article')

export const TeamScoreCard = ({ teamId, match, winner, isWinnerOnLimit, onCantar, onRematch }: TeamScoreCardPromps) => {
    const isWinner = winner === teamId;
    const teamStyles = getTeamStyle(teamId);
    
    const players = getTeamPlayersData(match, teamId);
    const score = getTeamTotalScore(match.players, teamId);
    const remaining = getPointsToLimit(score, match.config.limitScore, match.config.isDescending);
    const status = getScoreStatus(remaining, !isWinnerOnLimit);
    const tempCantos = getTeamTempCantosSum(match.tempCantos, match.players, teamId);

    return (
        <div className="card-container" style={{ perspective: '1200px', minHeight: '160px' }}>

            <MotionArticle
                className="card-inner"
                initial={false}
                animate={{ rotateY: isWinner ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                style={{ transformStyle: 'preserve-3d', position: 'relative', width: '100%', height: '100%' }}
            >

                {/* LADO A: EL MARCADOR (Frente) */}
                <article
                    className={`team-card ${teamStyles.border} ${teamStyles.bg} overflow-hidden shadow-xl`}
                >
                    {/* Parte superior: Info del Equipo y Puntaje */}
                    <div className="team-card-header">
                        <div className="team-info">
                            <span className={`team-label ${teamStyles.text}`}>
                                Equipo {teamId}
                            </span>
                            <span className="team-score-big">
                                {score}
                            </span>
                            {tempCantos > 0 && (
                                <div className="temp-canto-badge">+{tempCantos}</div>
                            )}
                        </div>

                        {match.config.limitScore > 0 && (
                            <div className={`flex flex-col items-end ${status.colorClass} ${status.isCritical ? 'animate-pulse' : ''}`}>
                                <span className="text-[9px] font-black uppercase tracking-tighter">
                                    {isWinnerOnLimit ? 'Para ganar' : 'Para salir'}
                                </span>
                                <span className="text-xl font-display font-black leading-none mb-1">
                                    {remaining}
                                </span>
                                <div style={{ width: '80px' }}>
                                    <ScoreProgressBar
                                        current={score}
                                        limit={match.config.limitScore}
                                        isLoseOnLimit={!isWinnerOnLimit}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="team-players-footer">
                        <TeamPlayerList
                            players={players}
                            allNames={match.players.map(p => p.name)}
                            showCantar={match.gameType === 'Barsiga'}
                            onCantar={onCantar}
                        />
                    </div>
                </article>

                {/* LADO B: EL GANADOR (Detrás) */}
                <div
                    className="card-back"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', position: 'absolute', inset: 0 }}
                >
                    <article className="winner-card-inner">
                        <Trophy size={40} className="text-primary mb-1" />
                        <h3 className="winner-name">EQUIPO {teamId}</h3>
                        <p className="winner-pill-text">¡VICTORIA TOTAL!</p>
                        <button className="btn-rematch-compact" onClick={() => onRematch(match)}>
                            <RefreshCw size={14} /> REVANCHA
                        </button>
                    </article>
                </div>
            </MotionArticle>
        </div>

    );
};