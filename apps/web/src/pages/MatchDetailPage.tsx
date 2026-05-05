import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { MatchRoundModal, MatchHeader, MatchScoreboard, WinnerDisplay, ConfirmDialog, AddCantoModal, IconButton } from '@/components';
import { GAMES_MAP } from '@/constants';
import { useMatch, useMatchActions } from '@/hooks';
import { IMatch } from '@el-porotero/shared';

export const MatchDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Data Fetching con TanStack Query
    const { match, loading, refetch } = useMatch(id);
    // Mutaciones centralizadas
    const actions = useMatchActions(id!);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roundToDelete, setRoundToDelete] = useState<number | null>(null);
    const [roundToEdit, setRoundToEdit] = useState<number | null>(null);
    const [cantoPlayer, setCantoPlayer] = useState<string | null>(null);

    const gameInfo = match ? GAMES_MAP[match.gameType] : null;

    if (loading || !match || !gameInfo) return <div className="p-20 text-center animate-pulse">Cargando partida...</div>;

    const handleRevancha = (m: IMatch) => {
        navigate('/new-match', {
            state: { gameType: m.gameType, players: m.players.map(p => ({ name: p.name, team: p.team })) }
        });
    };

    return (
        <div className="match-page">
            <MatchHeader match={match} onRefresh={refetch} icon={
                <div className={gameInfo.color}>
                    {gameInfo.icon}
                </div>
            } />

            <main className="match-scroller">
                {gameInfo.isDescending && (
                    <div className="game-mode-banner">
                        Modo Descendente: El primero en llegar a 0 gana
                    </div>
                )}

                <MatchScoreboard
                    match={match}
                    onEditRound={(num) => { setRoundToEdit(num); setIsModalOpen(true); }}
                    onDeleteRound={setRoundToDelete}
                    onReengage={(name) => actions.reengage.mutate(name)}
                    onCantar={setCantoPlayer}
                />
            </main>

            <ConfirmDialog
                isOpen={roundToDelete !== null}
                onClose={() => setRoundToDelete(null)}
                onConfirm={() => {
                    actions.deleteRound.mutate(roundToDelete!);
                    setRoundToDelete(null);
                }}
                title="¿Borrar ronda?"
                description={`Se eliminará la ronda ${roundToDelete} y se recalcularán los puntos.`}
            />

            {match.status === 'finished' && (
                <WinnerDisplay winner={match.winner} handleRevancha={handleRevancha} match={match} />
            )}

            {match.status === 'active' && (
                <IconButton
                    icon={<Plus size={32} />}
                    variant="primary"
                    title="Anotar Ronda"
                    className="fab-main"
                    onClick={() => {
                        setRoundToEdit(null);
                        setIsModalOpen(true);
                    }}
                />
            )}

            <MatchRoundModal
                key={roundToEdit ? `edit-${roundToEdit}` : 'new-round'}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setRoundToEdit(null);
                }}
                match={match}
                roundToEdit={roundToEdit}
                onSuccess={() => {
                    setIsModalOpen(false);
                    setRoundToEdit(null);
                }}
            />

            <AddCantoModal
                isOpen={!!cantoPlayer}
                onClose={() => setCantoPlayer(null)}
                playerName={cantoPlayer}
                onConfirm={(points) => {
                    if (cantoPlayer) {
                        actions.addCanto.mutate({
                            playerName: cantoPlayer,
                            points
                        });
                    }
                }}
            />
        </div>
    );
};