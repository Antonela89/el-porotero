import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { IMatch } from '@el-porotero/shared';
import { Button } from '@/components';
import { useMemo } from 'react';

const MotionDiv = motion.create('div');

interface WinnerDisplayProps {
    winner: string | undefined;
    handleRevancha: (match: IMatch) => void;
    match: IMatch;
}

export const WinnerDisplay = ({ winner, handleRevancha, match }: WinnerDisplayProps) => {
    const winnerLabel = useMemo(() => {
        if (!winner) return "";

        if (match.isTeamGame) {
            const winningPlayer = match.players.find(p => p.name === winner);
            // Si el jugador que cerró/ganó tiene equipo, mostramos el equipo
            if (winningPlayer && winningPlayer.team !== 'None') {
                return `EQUIPO ${winningPlayer.team}`;
            }
        }
        return winner;
    }, [winner, match]);

    return (
        <MotionDiv
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="winner-card"
        >
            <Trophy size={48} />

            <div className="flex flex-col items-center">
                <span className="winner-sublabel">¡Tenemos un ganador!</span>
                <h2 className="winner-label-primary">{winnerLabel}</h2>
            </div>

            <Button
                variant="ghost"
                className="btn-rematch"
                onClick={() => handleRevancha(match)}
            >
                Nueva Revancha
            </Button>
        </MotionDiv>
    );
};