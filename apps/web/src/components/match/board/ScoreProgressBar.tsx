import { motion } from 'framer-motion';

const MotionDiv = motion.create('div');

interface Props {
    current: number;
    limit: number;
    statusColor?: string;
}

export const ScoreProgressBar = ({ current, limit, statusColor }: Props) => {
    const percentage = Math.min(Math.max((current / limit) * 100, 0), 100);

    return (
        <div className='progress-container'>
            <MotionDiv
                className='progress-fill'
                initial={{ width: 0 }}
                animate={{
                    width: `${percentage}%`,
                    backgroundColor: statusColor,
                }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                style={{ boxShadow: `0 0 10px ${statusColor}` }}
            />
        </div>
    );
};