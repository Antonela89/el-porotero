import { Trash2, Edit2, Asterisk } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { IMatch, IRound } from '@el-porotero/shared';
import { useTrucoLogic } from '@/hooks';
import { IconButton, Button, PlayerHeader, TrucoTotalCell, TeamHeader } from '@/components';

interface MatchScoreboardProps {
    match: IMatch;
    onEditRound: (num: number) => void;
    onDeleteRound: (num: number) => void;
    onReengage: (name: string) => void;
    onCantar: (name: string) => void;
}

export const MatchScoreboard = ({ match, onEditRound, onDeleteRound, onReengage, onCantar }: MatchScoreboardProps) => {
    const { getStatus } = useTrucoLogic(match);
    const allPlayerNames = match.players.map(p => p.name);

    const isLoseOnLimit = ['Loba', 'Chinchon'].includes(match.gameType);
    const limitLabel = isLoseOnLimit ? 'Para Salir' : 'Para Ganar';
    const limitColorClass = isLoseOnLimit ? 'text-orange-400' : 'text-emerald-400';
    const limitBgClass = isLoseOnLimit ? 'bg-orange-400/5' : 'bg-emerald-400/5';
    const isTeamLayout = match.isTeamGame || match.gameType === 'Truco';
    const isMosca = match.gameType === 'Mosca';

    const sombreroIndex = (isMosca && match.players.length === 5)
        ? (match.currentDealerIndex + 1) % match.players.length : -1;

    // Helpers
    const sumTeamRound = (round: IRound, team: 'A' | 'B') =>
        round.scores.filter(s => match.players.find(p => p.name === s.playerName)?.team === team)
            .reduce((acc, s) => acc + (s.pointsAdded || 0), 0);

    return (
        <main className="p-4">
            <div className="scoreboard-container">
                <table className="w-full text-center border-collapse">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="sticky-col p-4 text-[10px] text-text-muted uppercase tracking-widest">Ronda</th>
                            <AnimatePresence>

                                {isTeamLayout ? (
                                    // --- MODO EQUIPOS CON DEALER INDIVIDUAL ---
                                    ['A', 'B'].map((t) => {
                                        const teamPlayers = match.players.filter(p => p.team === t);
                                        // Mapeamos los jugadores del equipo para saber quién reparte
                                        const playersWithDealerStatus = teamPlayers.map(p => ({
                                            name: p.name,
                                            isDealer: match.players.indexOf(p) === match.currentDealerIndex
                                        }));

                                        return (
                                            <TeamHeader
                                                key={t}
                                                allNames={allPlayerNames}
                                                teamId={t as 'A' | 'B'}
                                                players={playersWithDealerStatus}
                                                color={t === 'A' ? 'text-indigo-400' : 'text-rose-400'}
                                            />
                                        );
                                    })
                                ) : (
                                    // --- MODO INDIVIDUAL ---
                                    match.players.map((p, i) => (
                                        <PlayerHeader
                                            key={p.name}
                                            name={p.name}
                                            allNames={allPlayerNames}
                                            isDealer={i === match.currentDealerIndex}
                                            isSombrero={i === sombreroIndex}
                                            showCantar={match.gameType === 'Barsiga' && match.status === 'active'}
                                            onCantar={() => onCantar(p.name)}
                                        />
                                    ))
                                )}
                            </AnimatePresence>
                        </tr>
                    </thead>

                    <tbody>
                        {match.rounds.map((round) => (
                            <tr key={round.roundNumber} className="border-b border-white/5 hover:bg-white/2 transition-colors group">
                                <td className="sticky-col p-3 font-mono text-sm text-text-muted">
                                    <div className="flex items-center justify-between gap-4 px-2">
                                        <span>{round.roundNumber}</span>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <IconButton icon={<Edit2 size={14} />} title="Editar" onClick={() => onEditRound(round.roundNumber)} />
                                            <IconButton icon={<Trash2 size={14} />} variant="danger" title="Borrar" onClick={() => onDeleteRound(round.roundNumber)} />
                                        </div>
                                    </div>
                                </td>
                                {isTeamLayout ? (
                                    <>
                                        <td className="score-cell text-indigo-300">{sumTeamRound(round, 'A')}</td>
                                        <td className="score-cell text-rose-300">{sumTeamRound(round, 'B')}</td>
                                    </>
                                ) : (
                                    match.players.map(p => {
                                        const score = round.scores.find(s => s.playerName === p.name);
                                        return (
                                            <td key={p.name} className="score-cell">
                                                <div className="flex items-center justify-center gap-1">
                                                    {score?.pointsAdded || 0}
                                                    {score?.details?.isReengage && <Asterisk size={10} className="text-secondary" />}
                                                </div>
                                            </td>
                                        );
                                    })
                                )}
                            </tr>
                        ))}

                        {/* FILA DE TOTALES */}
                        <tr className="total-row">
                            <td className="sticky-col p-5 text-primary text-xs uppercase tracking-widest">Total</td>
                            {isTeamLayout ? (
                                ['A', 'B'].map(t => {
                                    const teamTotal = match.players.filter(p => p.team === t).reduce((acc, p) => acc + p.score, 0);
                                    return match.gameType === 'Truco'
                                        ? <TrucoTotalCell key={t} total={teamTotal} status={getStatus(teamTotal)} />
                                        : <td key={t} className={`p-5 text-4xl font-display ${t === 'A' ? 'text-indigo-400' : 'text-rose-400'}`}>{teamTotal}</td>;
                                })
                            ) : (
                                match.players.map(p => (
                                    <td key={p.name} className="p-5">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className={`text-2xl font-display ${p.isOut ? 'text-text-muted opacity-40' : 'text-text-main'}`}>
                                                {p.score}
                                            </span>
                                            {p.isOut && match.status === 'active' && (
                                                <Button size="md" variant="ghost" className="text-[9px]! py-1!" onClick={() => onReengage(p.name)}>
                                                    RE-ENGANCHAR
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                ))
                            )}
                        </tr>

                        {/* FILA DINÁMICA DE DISTANCIA AL LÍMITE (USO DE isLoseOnLimit) */}
                        {match.config.limitScore && match.gameType !== 'Mosca' && match.status === 'active' && (
                            <tr className={`${limitBgClass} font-bold border-t border-white/10`}>
                                <td className={`sticky-col p-5 ${limitColorClass} text-[10px] uppercase tracking-widest`}>
                                    {limitLabel}
                                </td>
                                {isTeamLayout ? (
                                    ['A', 'B'].map(t => {
                                        const teamTotal = match.players.filter(p => p.team === t).reduce((acc, p) => acc + p.score, 0);
                                        return (
                                            <td key={t} className={`p-5 text-2xl font-display ${limitColorClass}`}>
                                                {match.config.limitScore - teamTotal}
                                            </td>
                                        );
                                    })
                                ) : (
                                    match.players.map(p => (
                                        <td key={p.name} className={`p-5 text-2xl font-display ${limitColorClass} ${p.isOut ? 'opacity-10' : ''}`}>
                                            {match.config.limitScore - p.score}
                                        </td>
                                    ))
                                )}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
};