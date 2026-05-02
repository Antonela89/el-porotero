import { IMatch } from '@el-porotero/shared';
import { ArrowLeft, RotateCcw, XCircle } from 'lucide-react';
import api from '@/api/axios';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type MatchHeaderProps = {
    match: IMatch;
    onRefresh: () => void;
    icon: React.ReactNode;
}

export const MatchHeader = ({ match, onRefresh, icon }: MatchHeaderProps) => {

    const navigate = useNavigate();

    const handleCancelMatch = async () => {
        if (window.confirm("¿Seguro que querés cancelar la partida? Se marcará como cancelada.")) {
            try {
                await api.put(`/matches/${match._id}`, { status: 'cancelled' });
                navigate('/');
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    alert(error.response?.data?.message || "No se pudo cancelar");
                } else {
                    alert("No se pudo cancelar");
                }
            }
        }
    };

    return (
        <header className="flex items-center justify-between mb-4">
            <button onClick={() => navigate('/')} className="p-3 bg-surface rounded-full text-text-muted">
                <ArrowLeft size={20} />
            </button>
            <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-primary font-display font-bold uppercase tracking-widest">
                    {icon}
                    <span>{match.gameType}</span>
                </div>
                <span className="text-[10px] text-text-muted">{match.gameType === 'Mosca' ? 'Objetivo: 0 pts' : `Límite: ${match.config.limitScore} pts`}</span>
            </div>
            <div className="flex items-center gap-2">
                {match.status === 'active' && (
                    <button
                        onClick={handleCancelMatch}
                        className="p-3 text-text-muted  bg-surface rounded-full transition-colors"
                        title="Cancelar Partida"
                    >
                        <XCircle size={20} />
                    </button>
                )}
                <button onClick={() => onRefresh()} className="p-3 bg-surface rounded-full text-text-muted">
                    <RotateCcw size={20} />
                </button>
            </div>
        </header>
    )
}

