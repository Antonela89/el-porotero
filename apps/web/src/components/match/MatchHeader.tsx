import { useState } from 'react';
import { IMatch } from '@el-porotero/shared';
import { RotateCcw, XCircle, Plus } from 'lucide-react';
import { IconButton, ConfirmDialog } from '@/components';
import { useMatchActions } from '@/hooks';

type MatchHeaderProps = {
    match: IMatch;
    onRefresh: () => void;
    onAddRound: () => void;
    icon: React.ReactNode;
}

export const MatchHeader = ({ match, onRefresh, onAddRound, icon }: MatchHeaderProps) => {
    const { cancelMatch } = useMatchActions(match._id!);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const handleConfirmCancel = () => {
        cancelMatch.mutate();
        setShowCancelModal(true);
    };

    return (
        <header className="match-header">
            {/* Información Central */}
            <div className="header-info">
                <div className='flex gap-2'>
                    {icon}
                    <span className="text-lg">{match.gameType}</span>
                </div>
                <span className='limit-label'>
                    {match.gameType === 'Mosca'
                        ? 'OBJETIVO: 0 PTS'
                        : `LÍMITE: ${match.config.limitScore} PTS`
                    }
                </span>
            </div>

            {/* Acciones */}
            <div className="header-actions">
                {match.status === 'active' && (
                    <>
                        <IconButton
                            icon={<Plus size={20} />}
                            variant="primary"
                            title="Anotar Ronda"
                            onClick={onAddRound}
                        />
                        <IconButton
                            icon={<XCircle size={20} />}
                            variant="danger"
                            title="Cancelar Partida"
                            onClick={() => setShowCancelModal(true)}
                            disabled={cancelMatch.isPending}
                        />
                    </>
                )}
                <IconButton
                    variant='secondary'
                    icon={<RotateCcw size={20} />}
                    title="Refrescar Puntajes"
                    onClick={onRefresh}
                />
            </div>


            <ConfirmDialog
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={handleConfirmCancel}
                title="¿Borrar Partida?"
                description="Esta acción no se puede deshacer."
            />
        </header>
    );
};