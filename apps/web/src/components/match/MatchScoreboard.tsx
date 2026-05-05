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
    const isTeamLayout = match.isTeamGame || match.gameType === 'Truco';
    const isMosca = match.gameType === 'Mosca';
    const isTruco = match.gameType === 'Truco';

    const sombreroIndex = (isMosca && match.players.length === 5)
        ? (match.currentDealerIndex + 1) % match.players.length : -1;

    // Helpers
    const sumTeamRound = (round: IRound, team: 'A' | 'B') =>
        round.scores.filter(s => match.players.find(p => p.name === s.playerName)?.team === team)
            .reduce((acc, s) => acc + (s.pointsAdded || 0), 0);

    return (
        <main className="scoreboard-container">
            <table className="scoreboard-table">
                <thead>
                    <tr className="score-header-row">
                        <th className="sticky-round-col">Ronda</th>
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
                                            showCantar={match.gameType === 'Barsiga' && match.status === 'active'}
                                            onCantar={onCantar}
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
                        <tr key={round.roundNumber} className="score-row">
                            <td className="round-number-col">
                                <div className="row-actions">
                                    <IconButton icon={<Edit2 size={14} />} variant="info" title="Editar" onClick={() => onEditRound(round.roundNumber)} />
                                    <IconButton icon={<Trash2 size={14} />} variant="danger" title="Borrar" onClick={() => onDeleteRound(round.roundNumber)} />
                                </div>
                            </td>
                            {isTeamLayout ? (
                                <>
                                    <td className="score-cell-mono team-a">{sumTeamRound(round, 'A')}</td>
                                    <td className="score-cell-mono team-b">{sumTeamRound(round, 'B')}</td>
                                </>
                            ) : (
                                match.players.map(p => {
                                    const score = round.scores.find(s => s.playerName === p.name);
                                    return (
                                        <td key={p.name} className="score-cell-mono">
                                            <div className="cell-content">
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
                        <td className="sticky-round-col">Total</td>
                        {isTeamLayout ? (
                            ['A', 'B'].map(t => {
                                const teamTotal = match.players.filter(p => p.team === t).reduce((acc, p) => acc + p.score, 0);
                                return match.gameType === 'Truco'
                                    ? <TrucoTotalCell key={t} total={teamTotal} status={getStatus(teamTotal)} />
                                    : <td key={t} className={`p-5 text-4xl font-display ${t === 'A' ? 'text-indigo-400' : 'text-rose-400'}`}>{teamTotal}</td>
                            })
                        ) : (
                            match.players.map(p => (
                                <td key={p.name} className="score-cell">
                                    <div className={`total-display ${isTruco ? 'min-height: 100px' : ''}`}>
                                        <span className={`total-main-val ${p.isOut ? 'muted' : ''}`}>
                                            {p.score}
                                        </span>
                                        {p.isOut && match.status === 'active' && (
                                            <Button size="md" variant="ghost" className="btn-reengage" onClick={() => onReengage(p.name)}>
                                                RE-ENGANCHAR
                                            </Button>
                                        )}
                                    </div>
                                </td>
                            ))
                        )}
                    </tr>

                    {/* FILA DINÁMICA DE DISTANCIA AL LÍMITE (USO DE isLoseOnLimit) */}
                    {match.config.limitScore > 0 && match.gameType !== 'Mosca' && match.status === 'active' && (
                        <tr className={`limit-row ${isLoseOnLimit ? 'lose-limit' : 'win-limit'}`}>
                            <td className="limit-label-cell">{limitLabel}</td>
                            {isTeamLayout ? (
                                ['A', 'B'].map(t => {
                                    const teamTotal = match.players.filter(p => p.team === t).reduce((acc, p) => acc + p.score, 0);
                                    return (
                                        <td key={t} className="limit-value-cell">
                                            {match.config.limitScore - teamTotal}
                                        </td>
                                    );
                                })
                            ) : (
                                match.players.map(p => (
                                    <td key={p.name} className={`limit-value-cell ${p.isOut ? 'opacity-10' : ''}`}>
                                        {match.config.limitScore - p.score}
                                    </td>
                                ))
                            )}
                        </tr>
                    )}
                </tbody>
            </table>
        </main>
    );
};