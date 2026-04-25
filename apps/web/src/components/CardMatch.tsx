import { IMatch } from '@el-porotero/shared';
import { Trophy, Users, Calendar, ChevronRight, Trash2, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MatchCardProps {
    match: IMatch;
    onDelete: (id: string) => void;
    onEdit: (match: IMatch) => void;
}


const CardMatch = ({ match, onDelete, onEdit }: MatchCardProps) => {
    const navigate = useNavigate();

    const date = new Date(match.createdAt).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'short',
    });

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
        <article
            onClick={() => navigate(`/match/${match._id}`)}
            className="match-card group flex items-center gap-4 transition-all"
        >
            {/* Indicador lateral de estado */}
            <div className={`w-1.5 h-12 rounded-full ${match.status === 'active' ? 'bg-primary' : 'bg-text-muted/30'
                }`} />

            <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-text-main group-hover:text-primary transition-colors">
                        {match.gameType}
                    </h3>
                    <span className="text-[10px] text-text-muted flex items-center gap-1 uppercase tracking-widest">
                        <Calendar size={12} /> {date}
                    </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-text-muted">
                    <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{match.players.length}</span>
                    </div>
                    {match.winner && (
                        <div className="flex items-center gap-1 text-primary/80">
                            <Trophy size={14} />
                            <span className="font-semibold">{match.winner}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleEdit}
                    className="p-2 hover:bg-white/10 rounded-lg text-text-muted hover:text-primary transition-colors"
                    title="Editar partida"
                >
                    <Edit3 size={18} />
                </button>
                <button
                    onClick={handleDelete}
                    className="p-2 hover:bg-white/10 rounded-lg text-text-muted hover:text-warning transition-colors"
                    title="Eliminar partida"
                >
                    <Trash2 size={18} />
                </button>
                <ChevronRight className="text-text-muted self-center ml-1" />
            </div>
        </article>
    );
};

export default CardMatch