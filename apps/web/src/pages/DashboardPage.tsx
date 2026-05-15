import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { IMatch } from '@el-porotero/shared';
import { CardMatch, EditMatchModal, Button, LoadingSpinner, ConfirmDialog } from '@/components';
import { useMatches } from '@/hooks';

export const DashboardPage = () => {
    const navigate = useNavigate();
    const { matches, loading, deleteMatch, updateMatchInState } = useMatches();
    const [matchToEdit, setMatchToEdit] = useState<IMatch | null>(null);
    const [idToDelete, setMatchToDelete] = useState<string | null>(null);

    const [filter, setFilter] = useState<'active' | 'finished' | 'cancelled' | 'all'>('active');

    if (loading) return <LoadingSpinner message="Buscando tus partidas..." />;

    // Filtrar por estado
    const filteredMatches = matches.filter(match => {
        if (filter === 'all') return true;
        return match.status === filter;
    });

    // Agrupacion de partidas por fecha
    const groupedMatches = filteredMatches.reduce((groups, match) => {
        const dateStr = match.createdAt ? String(match.createdAt) : new Date().toISOString();
        const dateKey = new Date(dateStr).toLocaleDateString('es-AR', {
            day: '2-digit', month: 'long', year: 'numeric'
        });

        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(match);
        return groups;
    }, {} as Record<string, IMatch[]>);

    const filterOptions = [
        { id: 'active', label: 'En Juego' },
        { id: 'finished', label: 'Finalizadas' },
        { id: 'cancelled', label: 'Canceladas' },
    ] as const;

    return (
        <>
            <Helmet>
                <title>El Porotero | Mis Partidas</title>
                <meta name="description" content="Gestioná tus partidas de Truco, Loba y Bársiga en tiempo real." />
                <meta property="og:title" content="El Porotero Online" />
                <meta property="og:description" content="El anotador profesional para timbiar con amigos." />
                <meta property="og:image" content="/og-image.jpg" /> {/* Imagen 1200x630px en public/ */}
            </Helmet>

            <>
                {/* Header */}
                <header className="dashboard-header">
                    <div className="dashboard-welcome">
                        <span>¡Hola!</span>
                        ¿Qué vamos a jugar hoy?
                    </div>
                </header>

                {/* Acción Principal */}
                <section className="dashboard-action-area">
                    <Button
                        onClick={() => navigate('/new-match')}
                        size="lg"
                        className="dashboard-action-btn"
                    >
                        <Plus size={24} strokeWidth={3} /> Nueva Partida
                    </Button>
                </section>

                {/* --- CONTENEDOR DE FILTROS --- */}
                <nav className='filter-scroll-area'>
                    {filterOptions.map((opt) => (
                        <Button
                            key={opt.id}
                            variant={filter === opt.id ? 'primary' : 'ghost'}
                            size="md"
                            onClick={() => setFilter(opt.id)}
                            className='filter-pill'
                        >
                            {opt.label}
                        </Button>
                    ))}
                </nav>

                <main className="dashboard-recent-list">
                    {filteredMatches.length === 0 ? (
                        <div className='empty-state-compact'>No hay partidas en este estado.</div>
                    ) : (
                        Object.entries(groupedMatches).map(([date, matchesInDate]) => (
                            <div key={date} className='date-group-wrapper'>
                                <h3 className='date-group-header'>{date}</h3>
                                {matchesInDate.map(match => (
                                    <CardMatch
                                        key={match._id}
                                        match={match}
                                        onDelete={deleteMatch}
                                        onEdit={setMatchToEdit}
                                    />
                                ))}
                            </div>
                        ))
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
            </>
        </>
    );
};