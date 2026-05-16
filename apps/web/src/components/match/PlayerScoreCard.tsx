import { motion } from 'framer-motion';
import { Crown, HatGlasses, Asterisk, Megaphone, Trophy, RefreshCw } from 'lucide-react';
import { Button, IconButton, ScoreProgressBar } from '@/components';

const MotionArticle = motion.create('article');
const MotionDiv = motion.create('div');

interface PlayerScoreCardProps {
    name: string;
    score: number;
    winner?: string;
    limitScore: number;
    isDealer: boolean;
    isSombrero: boolean;
    isOut: boolean;
    isLoseOnLimit: boolean;
    reengage: number;
    teamColor?: string;
    onReengage?: () => void;
    onCantar?: () => void;
    showCantar?: boolean;
    onRematch?: ()  => void;
}

export const PlayerScoreCard = ({
    name, score, winner, limitScore, isDealer, isSombrero, isOut,
    isLoseOnLimit, reengage, onReengage, onCantar, showCantar, onRematch
}: PlayerScoreCardProps) => {

    const isWinner = winner === name;
    const remaining = limitScore > 0 ? limitScore - score : null;
    const isCritical = isLoseOnLimit ? (remaining !== null && remaining <= 20) : (remaining !== null && remaining <= 10);

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
                <article className={`player-card ${isOut ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-800 border-slate-700'}`}>
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
                        {isOut && <span className="text-xs text-warning font-bold">AFUERA</span>}

                        {
                            remaining !== null && !isOut && (
                                <div className={`player-card-status ${isCritical ? 'text-warning animate-pulse' : 'text-text-muted'}`}>
                                    {isLoseOnLimit && `Faltan ${remaining} para salir`}

                                    <div style={{ width: '120px' }}> {/* Ancho fijo para que no ocupe todo si no quieres */}
                                        <ScoreProgressBar
                                            current={score}
                                            limit={limitScore}
                                            isLoseOnLimit={isLoseOnLimit}
                                        />
                                    </div>
                                </div>
                            )
                        }
                    </div>

                    {
                        isOut && onReengage && (
                            <Button size="md" variant="primary" className="mt-3 w-full" onClick={onReengage}>
                                RE-ENGANCHAR
                            </Button>
                        )
                    }
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
            </MotionArticle>
        </div>
    );
};
