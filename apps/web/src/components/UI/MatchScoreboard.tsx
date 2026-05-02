import { Crown, HatGlasses, Trash2, Edit2, Asterisk } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { getShortName } from '@/utils/formatters';
import { IMatch, IRoundScore, IRound } from '@el-porotero/shared';
import { useTrucoLogic } from '@/hooks/useTrucoLogic';

interface MatchScoreboardProps {
    match: IMatch;
    onEditRound: (roundNumber: number) => void;
    onDeleteRound: (roundNumber: number) => void;
    onReengage: (playerName: string) => void;
    onCantar: (name: string) => void;
}

export const MatchScoreboard = ({ match, onEditRound, onDeleteRound, onReengage, onCantar }: MatchScoreboardProps) => {
    const { getStatus } = useTrucoLogic(match);
    const allPlayerNames = match.players.map(p => p.name);
    // Juegos donde llegar al límite significa PERDER
    const isLoseOnLimit = ['Loba', 'Chinchon'].includes(match.gameType);

    // Juegos donde llegar al límite significa GANAR
    // const isWinOnLimit = ['Escoba', 'Barsiga', 'Burako', 'Truco'].includes(match.gameType);

    // Caso especial Mosca: se gana al llegar a 0

    const isTeamLayout = match.isTeamGame || match.gameType === 'Truco';
    const isTeamHeader = match.isTeamGame;

    // Identificamos quiénes son de cada equipo (usando el campo 'team' que ya tenemos)
    const teamA = match.players.filter(p => p.team === 'A');
    const teamB = match.players.filter(p => p.team === 'B');

    // Helper para sumar puntos de una ronda por equipo
    const sumTeamRound = (round: IRound, teamNames: string[]) => {
        return round.scores
            .filter((s: IRoundScore) => teamNames.includes(s.playerName))
            .reduce((acc: number, s: IRoundScore) => acc + (s.pointsAdded || 0), 0);
    };

    // Helper para el total histórico
    // const getTeamTotal = (teamNames: string[]) => {
    //     return match.players
    //         .filter(p => teamNames.includes(p.name))
    //         .reduce((acc, p) => acc + p.score, 0);
    // };

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


                                {isTeamHeader ? (
                                    // CABECERA MODO EQUIPOS
                                    ['A', 'B'].map(t => {
                                        const teamPlayers = match.players.filter(p => p.team === t);
                                        const isTeamStarting = teamPlayers.some((_, idx) =>
                                            match.players.indexOf(teamPlayers[idx]) === match.currentDealerIndex
                                        );

                                        return (
                                            <th key={t} className={`p-4 border-r border-white/5 ${t === 'A' ? 'text-indigo-400' : 'text-rose-400'}`}>
                                                <div className="flex flex-col items-center gap-1">
                                                    {/* Mostramos la corona si alguien del equipo es el repartidor */}
                                                    <div className="h-4">
                                                        {isTeamStarting && <Crown size={14} fill="currentColor" />}
                                                    </div>
                                                    <span className="font-display text-lg uppercase tracking-widest">Equipo {t}</span>
                                                    <div className="flex gap-1">
                                                        {teamPlayers.map(p => (
                                                            <span key={p.name} className="text-[8px] opacity-60 uppercase border border-white/10 px-1 rounded">
                                                                {p.name.substring(0, 3)}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </th>
                                        );
                                    })
                                ) : (
                                    // CABECERA INDIVIDUAL 
                                    match.players.map((player, index) => {
                                        const isDealer = index === match.currentDealerIndex;
                                        const isSombrero = index === sombreroIndex;

                                        return (
                                            <th key={player.name} className={`p-4 min-w-20 ${index === match.currentDealerIndex ? 'text-primary' : 'text-text-main'}`} >
                                                <div className="flex flex-col items-center gap-1">
                                                    <div className="h-4 flex items-center gap-1"> {/* Contenedor de iconos fijo */}
                                                        {isDealer && <Crown size={14} className="text-primary" fill="currentColor" />}
                                                        {isSombrero && <HatGlasses size={14} className="text-purple-400" />}
                                                    </div>
                                                    <span className={`text-lg font-display ${isDealer ? 'text-primary' : isSombrero ? 'text-purple-400' : 'text-text-main'}`}>
                                                        {getShortName(player.name, allPlayerNames)}
                                                    </span>
                                                    <span className="text-[9px] opacity-50 uppercase tracking-tighter">{player.name}</span>


                                                    {match.gameType === 'Barsiga' && match.status === 'active' && (
                                                        <button
                                                            onClick={() => onCantar(player.name)}
                                                            className="text-[8px] bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-full border border-pink-500/30 mt-1 hover:bg-pink-500 hover:text-white transition-all"
                                                        >
                                                            CANTAR
                                                        </button>
                                                    )}
                                                </div>
                                            </th>
                                        )
                                    })
                                )}
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
                                {isTeamLayout ? (
                                    // PUNTOS POR EQUIPO
                                    <>
                                        <td className="p-3 font-mono text-indigo-300">{sumTeamRound(round, teamA.map(p => p.name))}</td>
                                        <td className="p-3 font-mono text-rose-300">{sumTeamRound(round, teamB.map(p => p.name))}</td>
                                    </>
                                ) : (
                                    // PUNTOS POR JUGADOR
                                    match.players.map(player => {
                                        const roundScore = round.scores.find(s => s.playerName === player.name);
                                        const wasReengagedInThisRound = roundScore?.details?.isReengage === true;

                                        return (
                                            <td key={player.name} className="p-3 font-mono text-sm">
                                                <div className="flex items-center justify-center gap-0.5">
                                                    <span>{roundScore ? roundScore.pointsAdded : 0}</span>

                                                    {/* --- REPETIR ICONOS DE ASTERISCO --- */}
                                                    {wasReengagedInThisRound && (
                                                        <Asterisk
                                                            size={12}
                                                            className="text-secondary shrink-0"
                                                            strokeWidth={3}
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    })
                                )}
                            </tr>
                        ))}

                        {/* FILA DE TOTALES (DESTACADA) */}
                        <tr className="bg-primary/5 font-bold">
                            <td className="p-5 text-primary text-xs uppercase tracking-widest sticky left-0 bg-surface">Total</td>
                            {
                                isTeamLayout ? (
                                    ['A', 'B'].map(teamId => {
                                        const teamPlayers = match.players.filter(p => p.team === teamId);
                                        const teamTotal = teamPlayers.reduce((acc, p) => acc + p.score, 0);

                                        // Lógica específica para TRUCO: Unificamos Etapa y Valor
                                        if (match.gameType === 'Truco') {
                                            const status = getStatus(teamTotal);
                                            const isBuenas = status.label === 'Buenas';

                                            return (
                                                <td key={teamId} className="p-5 border-r border-white/5">
                                                    <div className="flex flex-col items-center justify-center">
                                                        {/* Etiqueta: Malas (Gris) vs Buenas (Amarillo) */}
                                                        <span className={`text-[10px] uppercase font-black tracking-[0.2em] mb-1 transition-colors duration-500 ${isBuenas ? 'text-primary' : 'text-text-muted opacity-60'
                                                            }`}>
                                                            {status.label}
                                                        </span>

                                                        {/* Valor relativo (1 al 15) */}
                                                        <span className={`text-4xl font-display transition-all duration-500 ${isBuenas ? 'text-primary scale-110' : 'text-text-main'
                                                            }`}>
                                                            {status.val}
                                                        </span>

                                                        {/* Puntaje real acumulado chiquito para referencia */}
                                                        <span className="text-[9px] opacity-30 mt-1 font-mono tracking-tighter">
                                                            {teamTotal} PTS TOTALES
                                                        </span>
                                                    </div>
                                                </td>
                                            );
                                        }

                                        // Lógica para BURAKO (u otros juegos por equipo no-truco)
                                        return (
                                            <td key={teamId} className={`p-5 text-4xl font-display border-r border-white/5 ${teamId === 'A' ? 'text-indigo-400' : 'text-rose-400'
                                                }`}>
                                                {teamTotal}
                                            </td>
                                        );
                                    })
                                ) : (
                                    // --- MODO INDIVIDUAL (Loba, Mosca, Uno, Chinchón) ---
                                    match.players.map(player => (
                                        <td key={player.name} className={`p-5 text-2xl font-display ${player.name === match.winner ? 'text-primary animate-bounce' : 'text-text-main'}`}>
                                            <div className={`flex ${player.isOut && match.status === 'active' ? 'flex-col' : ''} items-center justify-center gap-1`}>

                                                <span className={player.isOut ? 'text-text-muted opacity-40' : ''}>
                                                    {player.score}

                                                    {/* Asteriscos de Re-enganche acumulados */}
                                                    {player.reengageCount > 0 && (!player.isOut || match.status === 'finished') && (
                                                        <div className="inline-flex -space-x-1 ml-1">
                                                            {Array.from({ length: player.reengageCount }).map((_, idx) => (
                                                                <Asterisk key={idx} size={10} className="text-secondary" strokeWidth={4} />
                                                            ))}
                                                        </div>
                                                    )}
                                                </span>

                                                {/* Botón de Re-enganche sutil si está fuera */}
                                                {player.isOut && match.status === 'active' && (
                                                    <button
                                                        onClick={() => onReengage(player.name)}
                                                        className="text-[9px] bg-secondary text-white px-3 py-1.5 rounded-lg font-black animate-pulse mt-2 shadow-lg shadow-secondary/40 uppercase tracking-tighter"
                                                    >
                                                        Re-enganchar
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    ))
                                )}
                        </tr>

                        {/* FILA DINÁMICA DE DISTANCIA AL LÍMITE */}
                        {match.config.limitScore && !isMosca && match.status === 'active' && (
                            <tr className={`${limitBgClass} font-bold border-t border-white/10`}>
                                <td className={`p-5 ${limitColorClass} text-[10px] uppercase tracking-widest sticky left-0 bg-surface z-10`}>
                                    {limitLabel}
                                </td>

                                {isTeamLayout ? (
                                    <>
                                        {/* Distancia para el Equipo A */}
                                        <td className={`p-5 text-2xl font-display ${limitColorClass}`}>
                                            {match.config.limitScore - teamA.reduce((acc, p) => acc + p.score, 0)}
                                        </td>
                                        {/* Distancia para el Equipo B */}
                                        <td className={`p-5 text-2xl font-display ${limitColorClass}`}>
                                            {match.config.limitScore - teamB.reduce((acc, p) => acc + p.score, 0)}
                                        </td>
                                    </>
                                ) : (
                                    match.players.map(player => (
                                        <td key={player.name} className={`p-5 text-2xl font-display ${limitColorClass} ${player.isOut ? 'opacity-10' : ''}`}>
                                            {match.config.limitScore - player.score}
                                        </td>
                                    ))
                                )}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </main >
    )
}
