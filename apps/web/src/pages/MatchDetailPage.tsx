import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IMatch } from '@el-porotero/shared';
import { GAMES_MAP } from '@/constants/games';
import api from '@/api/axios';
import { Plus } from 'lucide-react';
import { MatchRoundModal, MatchHeader, LoadingSpinner, ErrorMessage, NotFound, MatchScoreboard, WinnerDisplay, ConfirmDialog } from '@/components';
import { useLobaLogic } from '@/hooks/useLobaLogic';
import { AddCantoModal } from '@/components/AddCantoModal';
import { useMatch } from '@/hooks/useMatch';

export const MatchDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { match, loading, error, setMatch, refetch } = useMatch(id);
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roundToDelete, setRoundToDelete] = useState<number | null>(null);
    const [roundToEdit, setRoundToEdit] = useState<number | null>(null);
    const { getReengageScore } = useLobaLogic(match || ({} as IMatch));
    const [cantoPlayer, setCantoPlayer] = useState<string | null>(null);

    if (loading) return <LoadingSpinner />; // Un componente que podrías crear
    if (error) return <ErrorMessage message={error} />;
    if (!match) return <NotFound />;

    const openEdit = (num: number) => {
        setRoundToEdit(num);
        setIsModalOpen(true);
    };

    // Función para abrir modo creación
    const openAdd = () => {
        setRoundToEdit(null);
        setIsModalOpen(true);
    };

    // Esta función la llamará el Modal de Puntos
    const handleUpdateMatch = (updatedMatch: IMatch) => {
        setMatch(updatedMatch);
    };

    const handleDeleteRound = async (roundNumber: number) => {
        if (window.confirm(`¿Eliminar la ronda ${roundNumber}? Esta acción no se puede deshacer.`)) {
            try {
                await api.delete(`/matches/${match?._id}/round/${roundNumber}`);
                // Refrescamos la partida para ver los cambios
                const { data } = await api.get<IMatch>(`/matches/${id}`);
                setMatch(data);
            } catch (error) {
                alert("Error al eliminar la ronda");
                console.log(error);
            }
        }
    };

    const handleDeleteConfirm = async () => {
        if (!roundToDelete) return;
        try {
            const { data } = await api.delete(`/matches/${id}/round/${roundToDelete}`);
            setMatch(data); // Actualizamos la tabla con el recalculo del back
            setRoundToDelete(null);
        } catch (err) {
            console.error("Error al borrar", err);
        }
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

    const gameInfo = match?.gameType ? GAMES_MAP[match.gameType] : null;

    if (loading || !match || !gameInfo) return <div className="match-layout flex items-center justify-center">Cargando partida...</div>;
    // CAMBIAR CUANDO ESTE EL SPINNER
    // if (loading || !match || !gameInfo) {
    // return <LoadingSpinner />; 
    // }

    return (
        <div className="match-layout">
            {/* HEADER COMPACTO */}
            <MatchHeader
                match={match}
                onRefresh={refetch}
                icon={gameInfo.icon}
            />

            <MatchScoreboard
                match={match}
                onEditRound={openEdit}
                onDeleteRound={handleDeleteRound}
                onReengage={handleReengage}
                onCantar={(name) => setCantoPlayer(name)}
            />

            {/* MODAL DE CONFIRMACIÓN PARA BORRAR */}
            <ConfirmDialog
                isOpen={roundToDelete !== null}
                onClose={() => setRoundToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title="¿Borrar ronda?"
                description={`Se eliminará la ronda ${roundToDelete} y se recalcularán todos los puntajes automáticamente.`}
            />

            {/* RESUMEN DE GANADOR (SI TERMINÓ) */}
            {match.status === 'finished' && (
                <WinnerDisplay winner={match.winner} handleRevancha={handleRevancha} match={match} />
            )}

            {/* BOTÓN FLOTANTE PARA ANOTAR RONDA */}
            {match.status === 'active' && (
                <button
                    className="fixed bottom-8 right-8 w-16 h-16 bg-primary text-background rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                    onClick={() => openAdd()}
                >
                    <Plus size={32} strokeWidth={3} />
                </button>
            )}

            {/* EL MODAL */}
            <MatchRoundModal
                key={isModalOpen ? `modal-${roundToEdit || 'new'}` : 'closed'}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                match={match!}
                roundToEdit={roundToEdit}
                onSuccess={handleUpdateMatch}
            />

            {/* Modal para cantar en Barsiga*/}
            <AddCantoModal
                isOpen={!!cantoPlayer}
                onClose={() => setCantoPlayer(null)}
                match={match!}
                playerName={cantoPlayer}
                onSuccess={setMatch}
            />
        </div>
    );
};