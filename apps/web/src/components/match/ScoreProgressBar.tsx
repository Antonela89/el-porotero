import { motion } from 'framer-motion';

const MotionDiv = motion.create('div');

interface Props {
    current: number;
    limit: number;
    isLoseOnLimit: boolean;
}

export const ScoreProgressBar = ({ current, limit, isLoseOnLimit }: Props) => {
    const percentage = Math.min(Math.max((current / limit) * 100, 0), 100);

    const getBarColor = () => {
        if (percentage > 80) return isLoseOnLimit ? 'var(--color-warning)' : 'var(--color-success)';
        return 'var(--color-primary)';
    };

    return (
        <div className='progress-container'>
            <MotionDiv
                className='progress-fill'
                initial={{ width: 0 }}
                animate={{
                    width: `${percentage}%`,
                    backgroundColor: getBarColor()
                }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            />
        </div>
    );
};