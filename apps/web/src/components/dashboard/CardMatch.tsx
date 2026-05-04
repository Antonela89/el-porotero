import { IMatch } from '@el-porotero/shared';
import { Trophy, Users, ChevronRight, Trash2, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IconButton, Button } from '@/components';

const MotionArticle = motion.create('article');

interface MatchCardProps {
    match: IMatch;
    onDelete: (id: string) => void;
    onEdit: (match: IMatch) => void;
}

export const CardMatch = ({ match, onDelete, onEdit }: MatchCardProps) => {
    const navigate = useNavigate();
    const isActive = match.status === 'active';
    const isFinished = match.status === 'finished';

    return (
        <MotionArticle
            whileTap={{ scale: 0.98 }}
            className="match-card"
        >
            <div className="match-card-header">
                <div className='match-card-info'>
                    <h3>
                        {match.gameType}
                    </h3>
                    <div className="match-card-meta">
                        <span>
                            <Users size={14} /> {match.players.length}
                        </span>
                        {match.winner && (
                            <span className="match-card-winner">
                                <Trophy size={14} /> {match.winner}
                            </span>
                        )}
                    </div>
                </div>

                <span className={`badge ${isActive ? 'status-active' : isFinished ? 'status-finished' : 'status-closed'}`}>
                    {isActive ? 'En Juego' : 'Cerrada'}
                </span>
            </div>

            <div className="match-card-footer">
                <div className="match-card-actions">
                    <IconButton
                        icon={<Edit3 size={18} />}
                        title="Editar"
                        onClick={() => onEdit(match)}
                    />
                    <IconButton
                        icon={<Trash2 size={18} />}
                        variant="danger"
                        title="Borrar"
                        onClick={() => {
                            if (window.confirm(`¿Borrar partida de ${match.gameType}?`)) {
                                onDelete(match._id!);
                            }
                        }}
                    />
                </div>

                <Button
                    onClick={() => navigate(`/match/${match._id}`)}
                    variant='secondary'
                    className="rounded-xl! py-3! px-4! text-sm!"
                >
                    Continuar <ChevronRight size={18} />
                </Button>
            </div>
        </MotionArticle>
    );
};