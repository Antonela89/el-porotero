import { IMatch } from '@el-porotero/shared';
import { Trophy, Users, ChevronRight, Trash2, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface MatchCardProps {
    match: IMatch;
    onDelete: (id: string) => void;
    onEdit: (match: IMatch) => void;
}


export const CardMatch = ({ match, onDelete, onEdit }: MatchCardProps) => {
    const navigate = useNavigate();

    // Manejador para borrar
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation(); // Evita navegar a la partida
        if (window.confirm(`¿Seguro que querés borrar la partida de ${match.gameType}?`)) {
            onDelete(match._id);
        }
    };

    // Manejador para editar
    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation(); // Evita navegar a la partida
        onEdit(match);
    };

    return (
        <motion.article
            whileTap={{ scale: 0.98 }}
            className="match-card flex flex-col gap-4"
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-display font-bold text-primary uppercase">
                        {match.gameType}
                    </h3>
                    <div className="flex items-center gap-3 text-text-muted text-sm mt-1">
                        <span className="flex items-center gap-1"><Users size={14} /> {match.players.length}</span>
                        {match.winner && (
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                                <Trophy size={14} /> {match.winner}
                            </span>
                        )}
                    </div>
                </div>

                {/* ESTADO */}
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${match.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-white/5 text-text-muted'
                    }`}>
                    {match.status === 'active' ? 'En Juego' : 'Cerrada'}
                </span>
            </div>

            {/* BARRA DE ACCIONES SIEMPRE VISIBLE */}
            <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-auto">
                <div className="flex gap-2">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => handleEdit(e)}
                        className="p-3 bg-surface border border-white/10 rounded-xl text-primary hover:bg-primary/10 transition-colors"
                    >
                        <Edit3 size={18} />
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => handleDelete(e)}
                        className="p-3 bg-surface border border-white/10 rounded-xl text-orange-400 hover:bg-orange-400/10 transition-colors"
                    >
                        <Trash2 size={18} />
                    </motion.button>
                </div>

                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate(`/match/${match._id}`)}
                    className="flex items-center gap-2 px-4 py-3 bg-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 active:bg-indigo-600"
                >
                    Continuar <ChevronRight size={18} />
                </motion.button>
            </div>
        </motion.article>
    );
};