import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Plus, Clock } from 'lucide-react';
import { IMatch } from '@el-porotero/shared';
import { CardMatch, EditMatchModal, Button, LoadingSpinner, ConfirmDialog } from '@/components';
import { useMatches } from '@/hooks';

export const DashboardPage = () => {
    const navigate = useNavigate();
    const { matches, loading, deleteMatch, updateMatchInState } = useMatches();
    const [matchToEdit, setMatchToEdit] = useState<IMatch | null>(null);
    const [idToDelete, setMatchToDelete] = useState<string | null>(null);

    if (loading) return <LoadingSpinner message="Buscando tus partidas..." />;

    // Agrupacion de partidas por fecha
    const groupedMatches = matches.reduce((groups, match) => {
        const dateStr = match.createdAt ? String(match.createdAt) : new Date().toISOString();
        const dateKey = new Date(dateStr).toLocaleDateString('es-AR', {
            day: '2-digit', month: 'long', year: 'numeric'
        });

        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(match);
        return groups;
    }, {} as Record<string, IMatch[]>);

    return (
        <>
            <Helmet>
                <title>El Porotero | Mis Partidas</title>
                <meta name="description" content="Gestioná tus partidas de Truco, Loba y Bársiga en tiempo real." />
                <meta property="og:title" content="El Porotero Online" />
                <meta property="og:description" content="El anotador profesional para timbiar con amigos." />
                <meta property="og:image" content="/og-image.jpg" /> {/* Imagen 1200x630px en public/ */}
            </Helmet>

            <div className="dashboard-container">
                {/* Header */}
                <header className="dashboard-header">
                    <p className="dashboard-welcome">
                        <span className='text-[16px]'>¡Hola!</span><br />
                        ¿Qué vamos a jugar hoy?
                    </p>
                </header>

                {/* Acción Principal */}
                <section className="dashboard-action-area">
                    <Button
                        onClick={() => navigate('/new-match')}
                        size="lg"
                        className="w-full py-6!"
                    >
                        <Plus size={28} /> Nueva Partida
                    </Button>
                </section>

                {/* Listado de Partidas Recientes */}
                <main className="dashboard-recent-list">
                    <h2 className="dashboard-history-title">
                        <Clock size={20} /> Partidas Recientes
                    </h2>

                    {/* 1. Estado de Carga */}
                    {loading ? (
                        <div className="loading-skeleton-list">
                            <div className="skeleton-card" />
                            <div className="skeleton-card" />
                        </div>
                    ) : matches.length === 0 ? (
                        /* 2. Estado Vacío */
                        <div className="dashboard-empty-state">
                            No hay partidas anotadas todavía.
                        </div>
                    ) : (
                        /* 3. Listado de Partidas */
                        <div className="date-group-list">
                            {Object.entries(groupedMatches).map(([date, matchesInDate]) => (
                                <section key={date} className="date-group-container">
                                    <h3 className="date-group-title">
                                        {date}
                                    </h3>
                                    <div className="match-grid">
                                        {matchesInDate.map(match => (
                                            <CardMatch
                                                key={match._id}
                                                match={match}
                                                onDelete={(id) => setMatchToDelete(id)}
                                                onEdit={setMatchToEdit}
                                            />
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    )}
                </main>

                {/* Modal de edición */}
                {matchToEdit && (
                    <EditMatchModal
                        match={matchToEdit}
                        isOpen={!!matchToEdit}
                        onClose={() => setMatchToEdit(null)}
                        onSuccess={updateMatchInState}
                    />
                )}

                {/* DIÁLOGO DE CONFIRMACIÓN CENTRALIZADO */}
                <ConfirmDialog
                    isOpen={!!idToDelete}
                    onClose={() => setMatchToDelete(null)}
                    onConfirm={() => {
                        if (idToDelete) deleteMatch(idToDelete);
                    }}
                    title="¿Borrar Partida?"
                    description="Esta acción es irreversible. Se perderán todos los porotos de esta mesa."
                />
            </div>
        </>
    );
};