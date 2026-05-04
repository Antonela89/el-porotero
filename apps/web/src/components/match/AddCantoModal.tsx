import { useBarsigaLogic } from '@/hooks';
import { BaseModal } from '@/components';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    playerName: string | null;
    onConfirm: (points: number) => void;
}

export const AddCantoModal = ({ isOpen, onClose, playerName, onConfirm }: Props) => {
    const { CANTOS } = useBarsigaLogic();

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={`Canto de ${playerName}`}
            maxWidth="max-w-sm"
        >

            <div className="canto-grid">
                {CANTOS.map((canto) => (
                    <button
                        key={canto.id}
                        onClick={() => {
                            onConfirm(canto.points);
                            onClose();
                        }}
                        className="canto-option"
                    >
                        <div className="canto-main-info">
                            <div className="canto-icon-box">
                                <img
                                    src={canto.icon}
                                    alt={canto.label}
                                    className="card-icon-filter"
                                />
                            </div>
                            <span className="canto-label-text">
                                {canto.label}
                            </span>
                        </div>
                        <span className="canto-points-badge">
                            +{canto.points}
                        </span>
                    </button>
                ))}
            </div>
        </BaseModal>
    );
};