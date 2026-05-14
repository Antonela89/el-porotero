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
}

export const MatchScoreboard = ({ match, onEditRound, onDeleteRound, onReengage, onCantar }: MatchScoreboardProps) => {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    // const { getStatus } = useTrucoLogic(match);
    const allPlayerNames = match.players.map(p => p.name);

    const isLoseOnLimit = ['Loba', 'Chinchon', 'Uno'].includes(match.gameType);
    // const limitLabel = isLoseOnLimit ? 'Para Salir' : 'Para Ganar';
    const isTeamLayout = match.isTeamGame || match.gameType === 'Truco';
    const isMosca = match.gameType === 'Mosca';
    // const isTruco = match.gameType === 'Truco';

    const sombreroIndex = (isMosca && match.players.length === 5)
        ? (match.currentDealerIndex + 1) % match.players.length : -1;

    // Helpers
    // const sumTeamRound = (round: IRound, team: 'A' | 'B') =>
    //     round.scores.filter(s => match.players.find(p => p.name === s.playerName)?.team === team)
    //         .reduce((acc, s) => acc + (s.pointsAdded || 0), 0);

    return (
        <main className="p-4 flex flex-col gap-4">
            {/* 1. SECCIÓN DE PUNTAJES (Cards) */}
            <div className={isTeamLayout ? "flex flex-col gap-4" : "grid grid-cols-2 gap-3"}>
                {isTeamLayout ? (
                    // --- MODO EQUIPOS ---
                    ['A', 'B'].map(t => {
                        const teamPlayers = match.players
                            .map((p, i) => ({ ...p, globalIndex: i }))
                            .filter(p => p.team === t)
                            .map(p => ({
                                name: p.name,
                                isDealer: p.globalIndex === match.currentDealerIndex
                            }));

                        const teamTotalScore = match.players
                            .filter(p => p.team === t)
                            .reduce((acc, p) => acc + p.score, 0);

                        return (
                            <TeamScoreCard
                                key={t}
                                teamId={t as 'A' | 'B'}
                                score={teamTotalScore}
                                players={teamPlayers}
                                allNames={allPlayerNames}
                                limitScore={match.config.limitScore}
                                gameType={match.gameType}
                                onCantar={onCantar}
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
                            limitScore={match.config.limitScore}
                            isDealer={i === match.currentDealerIndex}
                            isSombrero={i === sombreroIndex}
                            isOut={p.isOut}
                            isReengage={p.reengageCount > 0 ? true : false}
                            isLoseOnLimit={isLoseOnLimit}
                            onReengage={() => onReengage(p.name)}
                            showCantar={match.gameType === 'Barsiga'}
                            onCantar={() => onCantar(p.name)}
                        />
                    ))
                )}
            </div>

            {/* 2. ACCESO AL HISTORIAL (Activador del Drawer) */}
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

            {/* 3. EL DRAWER (Se renderiza fuera del flujo normal pero se controla aquí) */}
            <HistoryDrawer
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                match={match}
                onEdit={(num) => {
                    setIsHistoryOpen(false);
                    onEditRound(num);
                }}
                onDelete={onDeleteRound}
            />
        </main>
    );
};