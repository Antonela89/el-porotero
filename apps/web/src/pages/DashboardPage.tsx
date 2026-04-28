import { useEffect, useState } from 'react';
import api from '@/api/axios';
import { IMatch } from '@el-porotero/shared';
import { Plus, Clock } from 'lucide-react';
import { CardMatch } from '@/components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
    const navigate = useNavigate();
    const [matches, setMatches] = useState<IMatch[]>([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data } = await api.get('/matches');
                setMatches(data);
            } catch (error) {
                console.error("Error al cargar historial", error);
            }
        };
        fetchHistory();
    }, []);

    // Función para borrar
    const handleDeleteMatch = async (id: string) => {
        try {
            await api.delete(`/matches/${id}`);
            // Filtramos el estado para que desaparezca visualmente
            setMatches(prev => prev.filter(m => m._id !== id));
        } catch (error: unknown) {
            let message = "Ocurrió un error inesperado";

            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || error.message;
            } else if (error instanceof Error) {
                message = error.message;
            }

            alert(`Error al borrar la partida: ${message}`);
        }
    };

    // Función para editar (por ahora solo un log, luego modal)
    const handleEditMatch = (match: IMatch) => {
        console.log("Editando partida:", match._id);
        // abrir un modal para cambiar el nombre de los jugadores y el estado del juego
    };

    const groupMatchesByDate = (matches: IMatch[]) => {
        const groups: Record<string, IMatch[]> = {};

        matches.forEach(match => {
            const date = new Date(match.createdAt).toLocaleDateString('es-AR', {
                day: '2-digit', month: 'long', year: 'numeric'
            });
            if (!groups[date]) groups[date] = [];
            groups[date].push(match);
        });

        return groups;
    };

    const groupedMatches = groupMatchesByDate(matches);

    return (
        <div className="dashboard-container">
            {/* Header*/}
            <header className="dashboard-header">
                <p className="text-text-muted italic text-center">
                    <span className='font-semibold'>Hola!, </span>
                    <br />
                    ¿Qué vamos a jugar hoy?
                </p>
            </header>

            {/* Acción Principal */}
            <section className="max-w-4xl mx-auto w-full">
                <button onClick={() => navigate('/new-match')} className="btn-primary w-full flex items-center justify-center gap-2 text-xl py-6">
                    <Plus size={28} /> Nueva Partida
                </button>
            </section>

            {/* Listado de Partidas Recientes */}
            <main className="max-w-4xl mx-auto w-full flex flex-col gap-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Clock size={20} /> Partidas Recientes
                </h2>

                {matches.length === 0 ? (
                    <div className="card-player text-center py-10 opacity-50">
                        No hay partidas anotadas todavía.
                    </div>
                ) : (
                    <section className="flex flex-col gap-8">
                        {Object.entries(groupedMatches).map(([date, matchesInDate]) => (
                            <div key={date} className="flex flex-col gap-4">
                                <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-text-muted border-l-2 border-primary pl-3 ml-1">
                                    {date}
                                </h2>
                                <div className="match-grid">
                                    {matchesInDate.map(match => (
                                        <CardMatch
                                            key={match._id}
                                            match={match}
                                            onDelete={handleDeleteMatch}
                                            onEdit={handleEditMatch}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </section>
                )}
            </main>
        </div>
    );
};