import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { MatchRoundModal, MatchHeader, MatchScoreboard, WinnerDisplay, ConfirmDialog, AddCantoModal, AddPointsFAB, LoadingSpinner } from '@/components';
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

    if (loading || !gameInfo) return <LoadingSpinner />;
    if (!match) return <div className="p-20 text-center">Partida no encontrada.</div>;

    const handleRevancha = (m: IMatch) => {
        navigate('/new-match', {
            state: { gameType: m.gameType, players: m.players.map(p => ({ name: p.name, team: p.team })) }
        });
    };

    return (
        <>
            <Helmet>
                <title>El Porotero | Mis Partidas</title>
                <meta name="description" content="Gestioná tus partidas de Truco, Loba y Bársiga en tiempo real." />
                <meta property="og:title" content="El Porotero Online" />
                <meta property="og:description" content="El anotador profesional para timbiar con amigos." />
                <meta property="og:image" content="/og-image.jpg" /> {/* Imagen 1200x630px en public/ */}
            </Helmet>

            <div className="match-page">
                <MatchHeader
                    gameInfo={gameInfo}
                    match={match}
                    onRefresh={refetch}
                    icon={
                        <div className={`text-${gameInfo.color}`}>
                            {gameInfo.icon}
                        </div>
                    } />

                <main className="match-main">
                    {gameInfo.isDescending && (
                        <div className="game-mode-banner">
                            Modo Descendente
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

            <AddPointsFAB
                isVisible={match.status === 'active'}
                onClick={() => { setRoundToEdit(null); setIsModalOpen(true); }}
            />
        </>
    );
};