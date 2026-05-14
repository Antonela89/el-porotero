import { Plus } from 'lucide-react';
import { IconButton } from '@/components';

interface AddPointsFABProps {
    onClick: () => void;
    isVisible: boolean;
}

export const AddPointsFAB = ({ onClick, isVisible }: AddPointsFABProps) => {
    if (!isVisible) return null;

    return (
        <IconButton
            icon={<Plus size={32} />}
            variant='primary'
            className="fab-main text-background rounded-full flex items-center justify-center shadow-2xl"
            onClick={onClick}
            title="Anotar Ronda"
        />
    );
};