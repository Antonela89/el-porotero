import { useState } from 'react';
import { History, ChevronUp } from 'lucide-react';
// import { AnimatePresence, motion } from 'framer-motion';
import { IMatch } from '@el-porotero/shared';
// import { useTrucoLogic } from '@/hooks';
import { PlayerScoreCard, HistoryDrawer, TeamScoreCard } from '@/components';

interface MatchScoreboardProps {
    match: IMatch;
    onEditRound: (num: number) => void;
    onDeleteRound: (num: number) => void;
    onReengage: (name: string) => void;
    onCantar: (name: string) => void;
    onRematch: (match: IMatch) => void;
}

export const MatchScoreboard = ({ match, onEditRound, onDeleteRound, onReengage, onCantar, onRematch }: MatchScoreboardProps) => {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    // const { getStatus } = useTrucoLogic(match);

    const isLoseOnLimit = ['Loba', 'Chinchon', 'Uno'].includes(match.gameType);
    const isWinnerOnLimit = ['Barsiga', 'Escoba', 'Burako', 'Truco'].includes(match.gameType);
    const isTeamLayout = match.isTeamGame || match.gameType === 'Truco';
    const isMosca = match.gameType === 'Mosca';
    // const isTruco = match.gameType === 'Truco';

    const allPlayerNames = match.players.map(p => p.name)
    console.log(allPlayerNames);
    

    const sombreroIndex = (isMosca && match.players.length === 5)
        ? (match.currentDealerIndex + 1) % match.players.length : -1;

    const gridClassName = isTeamLayout
        ? "scoreboard-grid mode-teams"
        : "scoreboard-grid mode-individual";

    return (
        <>
            {/* SECCIÓN DE PUNTAJES (Cards) */}
            <div className={gridClassName}>
                {isTeamLayout ? (
                    // --- MODO EQUIPOS ---
                    ['A', 'B'].map(t => {
                        return (
                            <TeamScoreCard
                                key={t}
                                teamId={t as 'A' | 'B'}
                                match={match}
                                winner={match.winner}
                                isWinnerOnLimit={isWinnerOnLimit}
                                onCantar={onCantar}
                                onRematch={onRematch}
                            />
                        );
                    })
                ) : (
                    // --- MODO INDIVIDUAL ---
                    match.players.map((p, i) => (
                        <PlayerScoreCard
                            key={p.name}
                            name={p.name}
                            score={p.score}
                            allPlayers={allPlayerNames}
                            match={match}
                            winner={match.winner}
                            isDealer={i === match.currentDealerIndex}
                            isSombrero={i === sombreroIndex}
                            isOut={p.isOut}
                            reengage={p.reengageCount}
                            isLoseOnLimit={isLoseOnLimit}
                            onReengage={() => onReengage(p.name)}
                            showCantar={match.gameType === 'Barsiga'}
                            onCantar={() => onCantar(p.name)}
                            onRematch={() => onRematch(match)} 
                        />
                    ))
                )}
            </div>

            {/* ACCESO AL HISTORIAL (Activador del Drawer) */}
            {match.rounds.length > 0 && (
                <button
                    onClick={() => setIsHistoryOpen(true)}
                    className="history-trigge"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-700 rounded-lg">
                            <History size={18} className="text-indigo-400" />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-sm font-bold text-slate-200">Ver Rondas</span>
                            <span className="text-[10px] uppercase opacity-50">{match.rounds.length} registradas</span>
                        </div>
                    </div>
                    <ChevronUp size={20} />
                </button>
            )}

            {/* EL DRAWER (Se renderiza fuera del flujo normal pero se controla aquí) */}
            <HistoryDrawer
                isOpen={isHistoryOpen}
                allNames={allPlayerNames}
                onClose={() => setIsHistoryOpen(false)}
                match={match}
                onEdit={(num) => {
                    setIsHistoryOpen(false);
                    onEditRound(num);
                }}
                onDelete={onDeleteRound}
            />
        </>
    );
};