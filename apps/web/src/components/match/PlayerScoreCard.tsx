import { motion } from 'framer-motion';
import { Crown, HatGlasses, Asterisk, Megaphone, Trophy, RefreshCw } from 'lucide-react';
import { Button, IconButton, ScoreProgressBar } from '@/components';
import { getPointsToLimit, getTempCantosSum, getScoreStatus } from '@/utils';
import { IMatch } from '@el-porotero/shared';

const MotionDiv = motion.create('div');
const MotionSpan = motion.create('span');

interface PlayerScoreCardProps {
    name: string;
    score: number;
    winner?: string;
    match: IMatch;
    isDealer: boolean;
    isSombrero: boolean;
    isOut: boolean;
    isLoseOnLimit: boolean;
    reengage: number;
    teamColor?: string;
    onReengage?: () => void;
    onCantar?: () => void;
    showCantar?: boolean;
    onRematch?: () => void;
}

export const PlayerScoreCard = ({
    name, score, winner, match, isDealer, isSombrero, isOut,
    isLoseOnLimit, reengage, onReengage, onCantar, showCantar, onRematch
}: PlayerScoreCardProps) => {

    const isWinner = winner === name;
    const remaining = getPointsToLimit(score, match.config.limitScore, match.config.isDescending);
    const status = getScoreStatus(remaining, isLoseOnLimit, match.gameType);
    const tempCantos = getTempCantosSum(match.tempCantos, name);
    const isUno = match.gameType === 'Uno';

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
                <article className={`player-card ${isOut ? 'is-out' : ''}`} style={{ backfaceVisibility: 'hidden' }}>
                    {/* Cabecera: Nombre e Iconos */}
                    <div className="player-card-header">
                        <div className={`player-card-name ${isDealer ? 'text-primary' : ''}`}>
                            {name}
                            {reengage > 0 && (
                                <div className="flex -space-x-1.5">
                                    {Array.from({ length: reengage }).map((_, i) => (
                                        <MotionDiv
                                            key={i}
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                        >
                                            <Asterisk size={20} className="text-secondary" />
                                        </MotionDiv>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className='flex gap-1 shrink-0'>
                            {isDealer && <Crown size={24} className="text-primary" fill="currentColor" />}
                            {isSombrero && <HatGlasses size={24} className="text-secondary" />}
                            {showCantar && (
                                <IconButton
                                    title='Cantar'
                                    icon={<Megaphone size={24} className='text-purple-400' />}
                                    variant="ghost" className="h-7 px-2 text-xs" onClick={() => onCantar}
                                />
                            )}
                        </div>
                    </div>

                    {/* Puntaje Principal */}
                    <div className="flex justify-between items-center gap-1">
                        <span className={`player-card-score ${isOut ? 'text-slate-600' : 'text-white'}`}>
                            {score}
                        </span>
                        {tempCantos > 0 && (
                            <MotionSpan
                                initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                                className="text-sm font-black text-purple-400"
                            >
                                +{tempCantos}
                            </MotionSpan>
                        )}

                        {match.config.limitScore > 0 && !isOut && (
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
                                            {isLoseOnLimit ? 'Para salir' : 'Para ganar'}
                                        </span>
                                        <span className="text-xl font-display font-black leading-none">
                                            {remaining}
                                        </span>
                                    </MotionDiv>
                                    <div style={{ width: '90px' }}>
                                        <ScoreProgressBar
                                            current={score}
                                            limit={match.config.limitScore}
                                            isLoseOnLimit={isLoseOnLimit}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {isOut && <span className="badge-out">AFUERA</span>}

                    {!isUno && isOut && onReengage && (
                        <Button disabled={match.status === 'finished'} size="md" variant="primary" className="mt-3 w-full py-2" onClick={onReengage}>
                            RE-ENGANCHAR
                        </Button>
                    )}
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
                        <div className='winner-card-info'>
                            <Trophy size={32} className="text-primary mb-1" />
                            <h3 className="winner-name">{name}</h3>
                            <p className="winner-label">¡GANADOR!</p>
                        </div>

                        <button className="btn-rematch-compact" onClick={onRematch}>
                            <RefreshCw size={14} /> REVANCHA
                        </button>
                    </article>
                </div>
            </MotionDiv>
        </div >
    );
};
