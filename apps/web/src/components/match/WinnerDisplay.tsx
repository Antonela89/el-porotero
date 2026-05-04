import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { IMatch } from '@el-porotero/shared';
import { Button } from '@/components';

const MotionDiv = motion.create('div');

interface WinnerDisplayProps {
    winner: string | undefined;
    handleRevancha: (match: IMatch) => void;
    match: IMatch;
}

export const WinnerDisplay = ({ winner, handleRevancha, match }: WinnerDisplayProps) => {
    return (
        <MotionDiv
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="winner-card"
        >
            <Trophy size={48} />

            <h2 className="winner-title">
                ¡Ganador {winner}!
            </h2>

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