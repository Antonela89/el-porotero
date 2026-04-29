import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { IMatch } from '@el-porotero/shared';

interface WinnerDisplayProps {
    winner: string | undefined;
    handleRevancha: (match: IMatch) => void;
    match: IMatch;
}

const MotionDiv = motion.create('div');

export const WinnerDisplay = ({winner, handleRevancha, match}: WinnerDisplayProps) => {
    return (
        <MotionDiv
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-primary text-background p-6 rounded-3xl flex flex-col items-center gap-2 shadow-2xl"
        >
            <Trophy size={48} />
            <h2 className="text-2xl font-display font-bold uppercase">¡Ganador {winner}!</h2>
            <button
                onClick={() => handleRevancha(match)}
                className="mt-2 bg-background text-primary px-6 py-2 rounded-full font-bold text-sm"
            >
                Nueva Revancha
            </button>
        </MotionDiv>
    )
}

