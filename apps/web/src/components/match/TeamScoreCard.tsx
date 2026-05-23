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
    trucoStatus: (score: number) => {label: string, val: number};
}

const MotionDiv = motion.create('div');

export const TeamScoreCard = ({ teamId, match, winner, isWinnerOnLimit, onCantar, onRematch, trucoStatus }: TeamScoreCardPromps) => {
    const isWinner = winner === teamId;
    const teamStyles = getTeamStyle(teamId);

    const players = getTeamPlayersData(match, teamId);
    const score = getTeamTotalScore(match.players, teamId);
    const remaining = getPointsToLimit(score, match.config.limitScore, match.config.isDescending);
    const status = getScoreStatus(remaining, !isWinnerOnLimit, match.gameType);
    const tempCantos = getTeamTempCantosSum(match.tempCantos, match.players, teamId);
    const { label, val } = trucoStatus ? trucoStatus(score) : { label: '', val: score };

    return (
        <div className="card-container" style={{ perspective: '1200px' }}>

            <MotionDiv
                className="card-inner"
                initial={false}
                animate={{ rotateY: isWinner ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                style={{ ...status.glowStyle, borderRadius: '2rem', transformStyle: 'preserve-3d', position: 'relative', width: '100%', height: '100%' }}
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
                                {score || val}
                                {match.gameType === 'Truco' && (
                                    <span className={`text-[12px] font-black uppercase ${label === 'Buenas' ? 'text-emerald-400' : 'text-orange-400'}`}>
                                        {label}
                                    </span>
                                )}
                            </span>
                            {tempCantos > 0 && (
                                <div className="temp-canto-badge">+{tempCantos}</div>
                            )}
                        </div>

                        {match.config.limitScore > 0 && (
                            <div className={`flex flex-col items-end px-6 ${status.colorClass}`}>
                                <div className='flex flex-col items-center gap-1'>
                                    <MotionDiv
                                        className='flex flex-col items-center gap-1'
                                        animate={status.isCritical ? {
                                            scale: [1, 1.08, 1],
                                            transition: {
                                                duration: 0.8,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }
                                        } : { scale: 1 }}
                                    >
                                        <span className="text-[9px] font-black uppercase tracking-tighter">
                                            {isWinnerOnLimit ? 'Para ganar' : 'Para salir'}
                                        </span>
                                        <span className="text-xl font-display font-black leading-none">
                                            {remaining}
                                        </span>
                                    </MotionDiv>
                                    <div style={{ width: '90px' }}>
                                        <ScoreProgressBar
                                            current={score}
                                            limit={match.config.limitScore}
                                            isLoseOnLimit={isWinnerOnLimit}
                                        />
                                    </div>
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
            </MotionDiv>
        </div>

    );
};