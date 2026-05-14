import { motion } from 'framer-motion';
import { Crown, HatGlasses, Asterisk } from 'lucide-react';
import { Button } from '@/components';

const MotionArticle = motion.create('article');

interface PlayerScoreCardProps {
    name: string;
    score: number;
    limitScore: number;
    isDealer: boolean;
    isSombrero: boolean;
    isOut: boolean;
    isLoseOnLimit: boolean;
    isReengage: boolean;
    teamColor?: string;
    onReengage?: () => void;
    onCantar?: () => void;
    showCantar?: boolean;
}

export const PlayerScoreCard = ({
    name, score, limitScore, isDealer, isSombrero, isOut,
    isLoseOnLimit, isReengage, teamColor, onReengage, onCantar, showCantar
}: PlayerScoreCardProps) => {

    const remaining = limitScore > 0 ? limitScore - score : null;
    const isCritical = isLoseOnLimit ? (remaining !== null && remaining <= 20) : (remaining !== null && remaining <= 10);

    return (
        <MotionArticle
            layout
            className={`player-card ${isOut ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-800 border-slate-700'
                }`}
        >
            {/* Cabecera: Nombre e Iconos */}
            <div className="player-card-header">
                <div className="player-card-name">
                    <span className={`font-bold text-lg ${teamColor || 'text-white'}`}>
                        {name}
                    </span>
                    <div className='flex gap-1'>
                        {isDealer && <Crown size={16} className="text-primary" fill="currentColor" />}
                        {isSombrero && <HatGlasses size={16} className="text-secondary" />}
                        {showCantar && (
                            <Button size="md" variant="ghost" className="h-7 px-2 text-xs" onClick={onCantar}>
                                CANTAR
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Puntaje Principal */}
            <div className="flex items-baseline gap-1">
                <span className={`player-card-score ${isOut ? 'text-slate-600' : 'text-white'}`}>
                    {score}
                </span>
                {isOut && <span className="text-xs text-warning font-bold">AFUERA</span>}
                {isReengage && <Asterisk size={10} className="text-secondary" />}
            </div>

            {/* Lógica de "Faltan" o barra de progreso */}
            {
                remaining !== null && !isOut && (
                    <div className={`player-card-status ${isCritical ? 'text-warning animate-pulse' : 'text-text-muted'}`}>
                        {isLoseOnLimit ? `Faltan ${remaining} para salir` : `A ${remaining} de ganar`}
                    </div>
                )
            }

            {
                isOut && onReengage && (
                    <Button size="md" variant="primary" className="mt-3 w-full" onClick={onReengage}>
                        RE-ENGANCHAR
                    </Button>
                )
            }
        </MotionArticle >
    );
};
