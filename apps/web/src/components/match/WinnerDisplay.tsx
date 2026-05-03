import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { IMatch } from '@el-porotero/shared';
import { Button } from '@/components';

interface WinnerDisplayProps {
    winner: string | undefined;
    handleRevancha: (match: IMatch) => void;
    match: IMatch;
}

export const WinnerDisplay = ({ winner, handleRevancha, match }: WinnerDisplayProps) => {
    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="winner-card"
        >
            <Trophy size={48} />
            <h2 className="text-2xl font-display font-bold uppercase tracking-tight">
                ¡Ganador {winner}!
            </h2>
            <Button
                variant="ghost"
                className="mt-2 bg-background text-primary hover:bg-background/90 rounded-full! px-8!"
                onClick={() => handleRevancha(match)}
            >
                Nueva Revancha
            </Button>
        </motion.div>
    );
};