import { useState } from 'react';
import { IMatch } from '@el-porotero/shared';
import { GameDefinition } from '@/constants';
import { MoreVertical, ArrowLeft, RotateCcw, Trash2 } from 'lucide-react';
import { IconButton, ConfirmDialog } from '@/components';
import { useNavigate } from 'react-router-dom';
import { useMatchActions } from '@/hooks';

type MatchHeaderProps = {
    gameInfo: GameDefinition
    match: IMatch;
    onRefresh: () => void;
    icon: React.ReactNode;
}

export const MatchHeader = ({ gameInfo, match, onRefresh, icon }: MatchHeaderProps) => {
    const { cancelMatch } = useMatchActions(match._id!);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();

    const handleConfirmCancel = () => {
        cancelMatch.mutate();
        setShowCancelModal(false);
    };

    return (
        <header className="match-header">
            <IconButton
                icon={<ArrowLeft size={22} />}
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                title="Volver"
            />
            <div className={`header-info-center text-${gameInfo.color}`}>
                {icon}
                <div className='header-title-col'>
                    <span className="text-lg">{match.gameType}</span>
                    <span className={`limit-label text-${gameInfo.color}`}>
                        {match.gameType === 'Mosca'
                            ? 'OBJETIVO: 0 PTS'
                            : `LÍMITE: ${match.config.limitScore} PTS`
                        }
                    </span>
                </div>
            </div>

            {/* Acciones */}
            <div className="header-actions">
                <IconButton
                    icon={<RotateCcw size={20} />}
                    onClick={onRefresh}
                    variant="ghost"
                    title="Cargar Ronda"

                />
                <IconButton
                    icon={<MoreVertical size={20} />}
                    variant="ghost"
                    onClick={() => setShowMenu(!showMenu)}
                    title="Opciones"
                />

                {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-surface border border-white/10 rounded-xl shadow-xl z-50 p-2">
                        <button
                            className="flex items-center gap-2 w-full p-3 text-sm text-rose-400 font-bold"
                            onClick={() => { setShowCancelModal(true); setShowMenu(false); }}
                        >
                            <Trash2 size={16} /> Cancelar Partida
                        </button>
                    </div>
                )}
            </div>

            <ConfirmDialog
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={handleConfirmCancel}
                title="Cancelar Partida?"
                description="Se perderá el progreso actual. Esta acción no se puede deshacer."
            />
        </header>
    );
};