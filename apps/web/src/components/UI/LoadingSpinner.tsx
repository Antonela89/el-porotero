import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
    fullScreen?: boolean;
    message?: string;
}

export const LoadingSpinner = ({
    fullScreen = false,
    message = "Mezclando mazo..."
}: LoadingSpinnerProps) => (
    <div className={`spinner-wrapper ${fullScreen ? 'full-screen' : ''}`}>
        <motion.div
            animate={{
                rotateY: [0, 180, 360],
                scale: [1, 1.1, 1]
            }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            className="spinner-icon"
        >
            🃏
        </motion.div>

        <p className="spinner-text">
            {message}
        </p>
    </div>
);