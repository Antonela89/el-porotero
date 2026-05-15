import { IMatch } from '@el-porotero/shared';
import { Trophy, Users, ChevronRight, Trash2, Edit3, MoreVertical, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IconButton } from '@/components';
import { GAMES_MAP } from '@/constants';
import { useState } from 'react';

const MotionArticle = motion.create('article');

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
                    backgroundColor: isActive ? `var(--color-${gameInfo.color})` : 'var(--color-secondary)'
                }} />

            {/* Información Principal */}
            {!showMenu && (
                <>
                    <div className="match-icon-box" style={{ color: `var(--color-${gameInfo.color})` }}>
                        {gameInfo?.icon || <Trophy size={20} />}
                    </div>

                    <div className='match-main-info'>
                        <div className='match-name-row'>
                            <h3>{match.gameType}</h3>
                            {match.winner && (
                                <span className='match-winner-pill'>{match.winner}</span>
                            )}
                        </div>
                        <span className='match-players-badge'>
                            <Users size={14} /> {match.players.length} Jugadores
                        </span>
                    </div>
                </>
            )}

            {/* 3. Área de Acciones / Menú Extendido */}
            <div className='match-actions' onClick={(e) => e.stopPropagation()}>
                <AnimatePresence mode="wait">
                    {!showMenu ? (
                        <motion.div
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
                        </motion.div>
                    ) : (
                        <motion.div
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
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </MotionArticle >
    );
};