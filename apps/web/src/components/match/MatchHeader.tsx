import { IMatch } from '@el-porotero/shared';
import { RotateCcw, XCircle } from 'lucide-react';
import { IconButton } from '@/components';
import { useMatchActions } from '@/hooks';

type MatchHeaderProps = {
    match: IMatch;
    onRefresh: () => void;
    icon: React.ReactNode;
}

export const MatchHeader = ({ match, onRefresh, icon }: MatchHeaderProps) => {
    const { cancelMatch } = useMatchActions(match._id!);

    const handleCancel = () => {
        if (window.confirm("¿Seguro que querés cancelar la partida?")) {
            cancelMatch.mutate();
        }
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
                    <IconButton
                        icon={<XCircle size={20} />}
                        variant="danger"
                        title="Cancelar Partida"
                        onClick={handleCancel}
                        disabled={cancelMatch.isPending}
                    />
                )}
                <IconButton
                    variant='secondary'
                    icon={<RotateCcw size={20} />}
                    title="Refrescar Puntajes"
                    onClick={onRefresh}
                />
            </div>
        </header>
    );
};