import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IMatch } from '@el-porotero/shared';
import { GAMES_MAP } from '@/constants/games';
import api from '@/api/axios';
import { ArrowLeft, Trophy, Crown, Plus, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AddRoundModal } from '@/components';
import { getShortName } from '@/utils/formatters';

export const MatchDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [match, setMatch] = useState<IMatch | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);


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

    if (loading || !match) return <div className="match-layout flex items-center justify-center">Cargando partida...</div>;

    const gameInfo = GAMES_MAP[match.gameType];

    const allPlayerNames = match.players.map(p => p.name);

    // Juegos donde llegar al límite significa PERDER
    const isLoseOnLimit = ['Loba', 'Chinchon'].includes(match.gameType);

    // Juegos donde llegar al límite significa GANAR
    // const isWinOnLimit = ['Escoba', 'Barsiga', 'Burako', 'Truco'].includes(match.gameType);

    // Caso especial Mosca: se gana al llegar a 0
    const isMosca = match.gameType === 'Mosca';

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
                    <span className="text-[10px] text-text-muted">Límite: {match.config.limitScore} pts</span>
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
                                    {match.players.map((player, index) => (
                                        <th key={player.name} className={`p-4 min-w-20 ${index === match.currentDealerIndex ? 'text-primary' : 'text-text-main'}`}>
                                            <div className="flex flex-col items-center gap-1">
                                                {index === match.currentDealerIndex && <Crown size={12} fill="currentColor" />}
                                                <span className="text-lg font-display tracking-tighter">
                                                    {getShortName(player.name, allPlayerNames)}
                                                </span>
                                                <span className="text-[9px] opacity-50 uppercase">{player.name}</span>
                                            </div>
                                        </th>
                                    ))}
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
                                                {roundScore?.pointsAdded || 0}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}

                            {/* FILA DE TOTALES (DESTACADA) */}
                            <tr className="bg-primary/5 font-bold">
                                <td className="p-5 text-primary text-xs uppercase tracking-widest sticky left-0 bg-surface">Total</td>
                                {match.players.map(player => (
                                    <td key={player.name} className={`p-5 text-2xl font-display ${player.isOut ? 'text-warning opacity-50' : 'text-primary'}`}>
                                        {player.score}
                                    </td>
                                ))}
                            </tr>

                            {/* FILA DINÁMICA DE DISTANCIA AL LÍMITE */}
                            {(match.config.limitScore || isMosca) && match.status === 'active' && (
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
                        onClick={() => navigate('/match/new')}
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