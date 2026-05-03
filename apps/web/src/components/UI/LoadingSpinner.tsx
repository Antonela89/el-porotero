import { motion } from 'framer-motion';

export const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center gap-4">
        <motion.div
            animate={{ 
                rotateY: [0, 180, 360],
                scale: [1, 1.1, 1]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-6xl"
        >
            🃏
        </motion.div>
        <p className="text-primary font-display font-bold animate-pulse uppercase tracking-widest text-xs">
            Mezclando mazo...
        </p>
    </div>
);
