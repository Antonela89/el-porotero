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

    return (
        <MotionArticle
            whileTap={{ scale: 0.98 }}
            className="match-card flex flex-col gap-4"
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-display font-bold text-primary uppercase">
                        {match.gameType}
                    </h3>
                    <div className="flex items-center gap-3 text-text-muted text-sm mt-1">
                        <span className="flex items-center gap-1">
                            <Users size={14} /> {match.players.length}
                        </span>
                        {match.winner && (
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                                <Trophy size={14} /> {match.winner}
                            </span>
                        )}
                    </div>
                </div>

                <span className={isActive ? 'status-active' : 'status-closed'}>
                    {isActive ? 'En Juego' : 'Cerrada'}
                </span>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-auto">
                <div className="flex gap-2">
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
                    className="bg-secondary text-white rounded-xl! py-3! px-4! text-sm!"
                >
                    Continuar <ChevronRight size={18} />
                </Button>
            </div>
        </MotionArticle>
    );
};