import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IMatch } from '@el-porotero/shared';
import { GAMES_MAP } from '@/constants/games';
import api from '@/api/axios';
import { ArrowLeft, Trophy, Crown, Plus, RotateCcw, HatGlasses } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AddRoundModal } from '@/components';
import { getShortName } from '@/utils/formatters';
import { useLobaLogic } from '@/hooks/useLobaLogic';

export const MatchDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [match, setMatch] = useState<IMatch | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { getReengageScore } = useLobaLogic(match || ({} as IMatch));

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const { data } = await api.get<IMatch>(`/matches/${id}`);
                setMatch(data);
            } catch (error) {
                console.error("Error al cargar la partida", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) loadInitialData();
    }, [id]); // Solo se ejecuta si cambia el ID de la URL

    // Esta función la llamará el Modal de Puntos
    const handleUpdateMatch = (updatedMatch: IMatch) => {
        setMatch(updatedMatch);
    };

    const handleReengage = async (playerName: string) => {
        const newScore = getReengageScore();

        if (window.confirm(`¿Re-enganchar a ${playerName} con ${newScore} puntos?`)) {
            try {
                // Mandamos una ronda especial de "re-enganche"
                const { data } = await api.post(`/matches/${match?._id}/round`, {
                    scores: match?.players.map(p => ({
                        playerName: p.name,
                        pointsAdded: p.name === playerName ? (newScore - p.score) : 0,
                        details: p.name === playerName ? { isReengage: true } : {}
                    }))
                });
                setMatch(data);
            } catch (error) {
                alert("Error al re-enganchar");
                console.log(error);

            }
        }
    };

    const handleRevancha = (match: IMatch) => {
        // Mandamos solo los nombres y el equipo, reseteando puntos y estado
        const playersForRematch = match.players.map(p => ({
            name: p.name,
            team: p.team
        }));

        navigate('/new-match', {
            state: {
                gameType: match.gameType,
                players: playersForRematch
            }
        });
    };

    if (loading || !match) return <div className="match-layout flex items-center justify-center">Cargando partida...</div>;

    const gameInfo = GAMES_MAP[match.gameType];
    const gameLimit = GAMES_MAP[match.gameType]?.defaultLimit || 0;

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
        <div className="match-layout">
            {/* HEADER COMPACTO */}
            <header className="flex items-center justify-between mb-4">
                <button onClick={() => navigate('/')} className="p-3 bg-surface rounded-full text-text-muted">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 text-primary font-display font-bold uppercase tracking-widest">
                        {gameInfo.icon}
                        <span>{match.gameType}</span>
                    </div>
                    <span className="text-[10px] text-text-muted"><span>{isMosca ? 'Objetivo: 0 pts' : `Límite: ${gameLimit} pts`}</span></span>
                </div>
                <button onClick={() => setMatch(null)} className="p-3 bg-surface rounded-full text-text-muted">
                    <RotateCcw size={20} />
                </button>
            </header>

            {/* MARCADOR PRINCIPAL (LA MESA) */}
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
                                    <td className="p-3 text-sm text-text-muted font-mono sticky left-0 bg-surface">{round.roundNumber}</td>
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
                                    <td key={player.name} className={`p-5 text-2xl font-display ${player.name === match.winner ? 'text-primary animate-bounce' : 'text-text-main'}
        ${player.isOut ? 'opacity-20' : ''}`}>
                                        <div className="flex flex-col items-center">
                                            <span className={player.name === match.winner ? 'text-primary animate-bounce' : player.isOut ? 'text-text-muted opacity-20' : 'text-text-main'}>
                                                {player.score}

                                                {match.rounds.some(r => r.scores.find(s => s.playerName === player.name)?.details?.isReengage) &&
                                                    <span className="text-secondary text-sm ml-1">*</span>
                                                }
                                            </span>

                                            {player.isOut && match.status === 'active' && (
                                                <button
                                                    onClick={() => handleReengage(player.name)}
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

            {/* RESUMEN DE GANADOR (SI TERMINÓ) */}
            {match.status === 'finished' && (
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-primary text-background p-6 rounded-3xl flex flex-col items-center gap-2 shadow-2xl"
                >
                    <Trophy size={48} />
                    <h2 className="text-2xl font-display font-bold uppercase">¡Ganador {match.winner}!</h2>
                    <button
                        onClick={() => handleRevancha(match)}
                        className="mt-2 bg-background text-primary px-6 py-2 rounded-full font-bold text-sm"
                    >
                        Nueva Revancha
                    </button>
                </motion.div>
            )}

            {/* BOTÓN FLOTANTE PARA ANOTAR RONDA */}
            {match.status === 'active' && (
                <button
                    className="fixed bottom-8 right-8 w-16 h-16 bg-primary text-background rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Plus size={32} strokeWidth={3} />
                </button>
            )}

            {/* EL MODAL */}
            <AddRoundModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                match={match}
                onSuccess={handleUpdateMatch}
            />
        </div>
    );
};