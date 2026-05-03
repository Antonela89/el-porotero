import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Clock } from 'lucide-react';
import { IMatch } from '@el-porotero/shared';
import { CardMatch, EditMatchModal, Button } from '@/components';
import { useMatches } from '@/hooks/useMatches';

export const DashboardPage = () => {
    const navigate = useNavigate();
    const { matches, loading, deleteMatch, updateMatchInState } = useMatches();
    const [matchToEdit, setMatchToEdit] = useState<IMatch | null>(null);

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
        <div className="dashboard-container px-4">
            {/* Header */}
            <header className="dashboard-header py-6">
                <p className="text-text-muted italic text-center">
                    <span className='font-semibold'>¡Hola!</span><br />
                    ¿Qué vamos a jugar hoy?
                </p>
            </header>

            {/* Acción Principal */}
            <section className="max-w-4xl mx-auto w-full">
                <Button
                    onClick={() => navigate('/new-match')}
                    size="lg"
                    className="w-full py-6!"
                >
                    <Plus size={28} /> Nueva Partida
                </Button>
            </section>

            {/* Listado de Partidas Recientes */}
            <main className="max-w-4xl mx-auto w-full flex flex-col gap-6 mt-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Clock size={20} /> Partidas Recientes
                </h2>

                {/* 1. Estado de Carga */}
                {loading ? (
                    <div className="flex flex-col gap-4">
                        <div className="h-24 w-full bg-surface/50 animate-pulse rounded-2xl" />
                        <div className="h-24 w-full bg-surface/50 animate-pulse rounded-2xl" />
                    </div>
                ) : matches.length === 0 ? (
                    /* 2. Estado Vacío */
                    <div className="card text-center py-20 opacity-50 border-2 border-dashed border-white/5">
                        No hay partidas anotadas todavía.
                    </div>
                ) : (
                    /* 3. Listado de Partidas */
                    <div className="flex flex-col gap-10">
                        {Object.entries(groupedMatches).map(([date, matchesInDate]) => (
                            <section key={date} className="flex flex-col gap-4">
                                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-text-muted border-l-2 border-primary pl-3">
                                    {date}
                                </h3>
                                <div className="match-grid">
                                    {matchesInDate.map(match => (
                                        <CardMatch
                                            key={match._id}
                                            match={match}
                                            onDelete={deleteMatch}
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
        </div>
    );
};