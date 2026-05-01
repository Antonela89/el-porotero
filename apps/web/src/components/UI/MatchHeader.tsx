import { IMatch } from '@el-porotero/shared';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type MatchHeaderProps = {
    match: IMatch;
    onRefresh: () => void;
    icon: React.ReactNode;
}

export const MatchHeader = ({ match, onRefresh, icon }: MatchHeaderProps) => {

    const navigate = useNavigate();
    const isMosca = match.gameType.toLowerCase() === 'mosca';

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
                    <span className="text-[10px] text-text-muted">{isMosca ? 'Objetivo: 0 pts' : `Límite: ${match.config.limitScore} pts`}</span>
                </div>
                <button onClick={() => onRefresh()} className="p-3 bg-surface rounded-full text-text-muted">
                    <RotateCcw size={20} />
                </button>
            </header>
    )
}

