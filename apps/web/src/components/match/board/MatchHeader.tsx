import { useState } from 'react';
import { IMatch } from '@el-porotero/shared';
import { GameDefinition } from '@/constants';
import { MoreVertical, ArrowLeft, RotateCcw, Trash2, X, Settings } from 'lucide-react';
import { IconButton, ConfirmDialog, EditMatchModal } from '@/components';
import { useNavigate } from 'react-router-dom';
import { useMatchActions } from '@/hooks';
import { getGameColorVar } from '@/utils';

type MatchHeaderProps = {
    gameInfo: Partial<GameDefinition>;
    match: IMatch;
    onRefresh: () => void;
    icon: React.ReactNode;
}

export const MatchHeader = ({ gameInfo, match, onRefresh, icon }: MatchHeaderProps) => {
    const { cancelMatch } = useMatchActions(match._id!);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const gameColor = getGameColorVar(match.gameType);
    const navigate = useNavigate();

    const handleConfirmCancel = () => {
        cancelMatch.mutate();
        setShowCancelModal(false);
    };

    return (
        <header className="match-header">
            {showMenu && (
                <div className="fixed inset-0 z-200" onClick={() => setShowMenu(false)} />
            )}

            <IconButton
                icon={<ArrowLeft size={22} />}
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                title="Volver"
            />
            <div className='header-info-center' style={{ color: gameColor }}>
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
                    icon={showMenu ? <X size={20} /> : <MoreVertical size={20} />}
                    variant="ghost"
                    onClick={() => setShowMenu(!showMenu)}
                    title="Opciones"
                    className="relative z-50"
                />

                {showMenu && (
                    <div className="absolute right-0 mt-2 mr-2 flex flex-col items-center gap-3 w-24 bg-surface border border-white/10 rounded-xl shadow-xl z-201 p-2">
                        {/* OPCIÓN: EDITAR */}
                        <IconButton
                            className="flex items-center rounded-full w-18 h-18 active:bg-white/5 transition-colors border-b border-white/5"
                            icon={<Settings size={26} className="text-secondary" />}
                            title='Editar'
                            onClick={() => {
                                setIsEditModalOpen(true);
                                setShowMenu(false);
                            }}
                        >
                        </IconButton>

                        {/* OPCIÓN: CANCELAR */}
                        <IconButton
                            className="flex items-center rounded-full w-18 h-18 active:bg-rose-500/10 transition-colors"
                            icon={<Trash2 size={26} className='text-rose-400' />}
                            title='Cancelar'
                            onClick={() => {
                                setShowCancelModal(true);
                                setShowMenu(false);
                            }}
                        >
                        </IconButton>
                    </div>
                )}
            </div>

            {/* MODAL DE EDICIÓN */}
            <EditMatchModal
                match={match}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={() => {
                    onRefresh();
                    setIsEditModalOpen(false);
                }}
            />

            <ConfirmDialog
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={handleConfirmCancel}
                title="¿Cancelar Partida?"
                description="Se perderá el progreso actual. Esta acción no se puede deshacer."
            />
        </header>
    );
};