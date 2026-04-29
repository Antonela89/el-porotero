import { Crown, HatGlasses, Trash2, Edit2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { getShortName } from '@/utils/formatters';
import { IMatch } from '@el-porotero/shared';

interface MatchScoreboardProps {
    match: IMatch;
    onEditRound: (roundNumber: number) => void;
    onDeleteRound: (roundNumber: number) => void;
    onReengage: (playerName: string) => void;
}

export const MatchScoreboard = ({ match, onEditRound, onDeleteRound, onReengage }: MatchScoreboardProps) => {
    const allPlayerNames = match.players.map(p => p.name);
    // Juegos donde llegar al límite significa PERDER
    const isLoseOnLimit = ['Loba', 'Chinchon'].includes(match.gameType);

    // Juegos donde llegar al límite significa GANAR
    // const isWinOnLimit = ['Escoba', 'Barsiga', 'Burako', 'Truco'].includes(match.gameType);

    // Caso especial Mosca: se gana al llegar a 0

    const isMosca = match.gameType === 'Mosca';
    const sombreroIndex = (isMosca && match.players.length === 5)
        ? (match.currentDealerIndex + 1) % match.players.length
        : -1;

    const limitLabel = isLoseOnLimit ? 'Para Salir' : 'Para Ganar';
    const limitColorClass = isLoseOnLimit ? 'text-orange-400' : 'text-emerald-400';
    const limitBgClass = isLoseOnLimit ? 'bg-orange-400/5' : 'bg-emerald-400/5';

    return (
        <main className="scoreboard-grid">
            <div className="w-full overflow-x-auto custom-scrollbar bg-surface rounded-4xl border border-white/5 shadow-2xl">
                <table className="w-full text-center border-collapse">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="p-4 text-[10px] text-text-muted uppercase tracking-widest sticky left-0 bg-surface z-10">Ronda</th>
                            <AnimatePresence>
                                {match.players.map((player, index) => {
                                    const isDealer = index === match.currentDealerIndex;
                                    const isSombrero = index === sombreroIndex;

                                    return (
                                        <th key={player.name} className={`p-4 min-w-20 ${index === match.currentDealerIndex ? 'text-primary' : 'text-text-main'}`}>
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="h-4 flex items-center gap-1"> {/* Contenedor de iconos fijo */}
                                                    {isDealer && <Crown size={14} className="text-primary" fill="currentColor" />}
                                                    {isSombrero && <HatGlasses size={14} className="text-purple-400" />}
                                                </div>
                                                <span className={`text-lg font-display ${isDealer ? 'text-primary' : isSombrero ? 'text-purple-400' : 'text-text-main'}`}>
                                                    {getShortName(player.name, allPlayerNames)}
                                                </span>
                                                <span className="text-[9px] opacity-50 uppercase tracking-tighter">{player.name}</span>
                                            </div>
                                        </th>
                                    )
                                })}
                            </AnimatePresence>
                        </tr>
                    </thead>

                    <tbody>
                        {/* HISTORIAL DE RONDAS */}
                        {match.rounds.map((round) => (
                            <tr key={round.roundNumber} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                                <td className="p-3 text-sm text-text-muted font-mono sticky left-0 bg-surface flex justify-around">{round.roundNumber}
                                    {/* BOTONES DE EDICIÓN DE RONDA (Aparecen al hacer hover o siempre en mobile) */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onEditRound(round.roundNumber)}
                                            className="text-yellow-400/60 hover:text-yellow-500"
                                        >
                                            <Edit2 size={20} />
                                        </button>
                                        <button
                                            onClick={() => onDeleteRound(round.roundNumber)}
                                            className="text-orange-400/60 hover:text-orange-500"
                                        >
                                            <Trash2 size={20} />
                                        </button>

                                    </div>
                                </td>
                                {match.players.map(player => {
                                    const roundScore = round.scores.find(s => s.playerName === player.name);
                                    return (
                                        <td key={player.name} className="p-3 font-mono text-sm">
                                            {roundScore ? roundScore.pointsAdded : 0}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}

                        {/* FILA DE TOTALES (DESTACADA) */}
                        <tr className="bg-primary/5 font-bold">
                            <td className="p-5 text-primary text-xs uppercase tracking-widest sticky left-0 bg-surface">Total</td>
                            {match.players.map(player => (
                                <td key={player.name} className={`p-5 text-2xl font-display ${player.name === match.winner ? 'text-primary animate-bounce' : 'text-text-main'} ${player.isOut ? 'opacity-20' : ''}`}>
                                    <div className="flex flex-col items-center">
                                        <span className={player.name === match.winner ? 'text-primary animate-bounce' : player.isOut ? 'text-text-muted opacity-20' : 'text-text-main'}>
                                            {player.score}

                                            {match.rounds.some(r => r.scores.find(s => s.playerName === player.name)?.details?.isReengage) &&
                                                <span className="text-secondary text-sm ml-1">*</span>
                                            }
                                        </span>

                                        {player.isOut && match.status === 'active' && (
                                            <button
                                                onClick={() => onReengage(player.name)}
                                                className="text-[9px] bg-secondary text-white px-2 py-1 rounded-full animate-pulse mt-2"
                                            >
                                                RE-ENGANCHE
                                            </button>
                                        )}
                                    </div>
                                </td>
                            ))}
                        </tr>

                        {/* FILA DINÁMICA DE DISTANCIA AL LÍMITE */}
                        {match.config.limitScore && !isMosca && match.status === 'active' && (
                            <tr className={`${limitBgClass} font-bold border-t border-white/10`}>
                                <td className={`p-5 ${limitColorClass} text-[10px] uppercase tracking-widest sticky left-0 bg-surface z-10`}>
                                    {limitLabel}
                                </td>
                                {match.players.map(player => {
                                    // Calculamos cuánto falta
                                    let distance = 0;
                                    if (isMosca) {
                                        distance = player.score; // En la Mosca falta lo que tenés para llegar a 0
                                    } else if (match.config.limitScore) {
                                        distance = match.config.limitScore - player.score;
                                    }

                                    return (
                                        <td key={player.name} className={`p-5 text-2xl font-display ${limitColorClass} ${player.isOut ? 'opacity-10' : ''}`}>
                                            {distance}
                                        </td>
                                    );
                                })}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    )
}
