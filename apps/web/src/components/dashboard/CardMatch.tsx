import { IMatch } from '@el-porotero/shared';
import { Trophy, Users, ChevronRight, Trash2, Edit3, MoreVertical, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IconButton } from '@/components';
import { GAMES_MAP } from '@/constants';
import { useState } from 'react';
import { getGameColorVar } from '@/utils';

const MotionArticle = motion.create('article');
const MotionDiv = motion.create('div');

interface MatchCardProps {
    match: IMatch;
    onDelete: (id: string) => void;
    onEdit: (match: IMatch) => void;
}

export const CardMatch = ({ match, onDelete, onEdit }: MatchCardProps) => {
    const navigate = useNavigate();
    const isActive = match.status === 'active';
    const gameInfo = GAMES_MAP[match.gameType];
    const [showMenu, setShowMenu] = useState(false);

    const gameColor = getGameColorVar(match.gameType);

    const handleNavigate = () => navigate(`/match/${match._id}`);

    return (
        <MotionArticle
            whileTap={{ scale: 0.98 }}
            className="match-item"
            onClick={handleNavigate}
        >

            {/* Indicador de color lateral */}
            <div className="status-indicator"
                style={{
                    backgroundColor: isActive ? gameColor : 'var(--color-text-muted)'
                }} />

            {/* Información Principal */}
            {!showMenu && (
                <>
                    <div className="match-icon-box" style={{ color: gameColor }}>
                        {gameInfo?.icon || <Trophy size={20} />}
                    </div>

                    <div className='match-main-info'>
                        <div className='match-name-row'>
                            <h3>{match.gameType}</h3>
                            {match.winner && (
                                <span className='match-winner-pill'>
                                    {match.isTeamGame ? `Equipo ${match.winner}` : match.winner}
                                </span>
                            )}
                        </div>
                        <span className='match-players-badge'>
                            <Users size={14} /> {match.players.length} Jugadores
                        </span>
                    </div>
                </>
            )}

            {/* Área de Acciones / Menú Extendido */}
            <div className='match-actions' onClick={(e) => e.stopPropagation()}>
                <AnimatePresence mode="wait">
                    {!showMenu ? (
                        <MotionDiv
                            key="more"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex items-center gap-1"
                        >
                            <IconButton
                                className='btn-more-options'
                                onClick={() => setShowMenu(true)}
                                icon={<MoreVertical size={18} />}
                                title="Opciones"
                            />
                            <ChevronRight size={16} className="opacity-20" />
                        </MotionDiv>
                    ) : (
                        <MotionDiv
                            key="actions"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 20, opacity: 0 }}
                            className="flex items-center gap-2 bg-surface-light p-1 rounded-xl"
                        >
                            <IconButton
                                variant="info"
                                onClick={() => { onEdit(match); setShowMenu(false); }}
                                icon={<Edit3 size={16} />}
                                title="Editar"
                            />
                            <IconButton
                                variant="danger"
                                onClick={() => { onDelete(match._id!); setShowMenu(false); }}
                                icon={<Trash2 size={16} />}
                                title="Borrar"
                            />
                            <IconButton
                                onClick={() => setShowMenu(false)}
                                icon={<X size={16} />}
                                title="Cerrar"
                            />
                        </MotionDiv>
                    )}
                </AnimatePresence>
            </div>
        </MotionArticle >
    );
};