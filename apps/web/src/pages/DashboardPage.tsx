import { useEffect, useState } from 'react';
import { useAuth } from '@/context';
import api from '@/api/axios';
import { IMatch } from '@el-porotero/shared';
import { LogOut, Plus, Clock } from 'lucide-react';
import { CardMatch } from '@/components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
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

    return (
        <div className="dashboard-container">
            {/* Header con Logout */}
            <header className="dashboard-header">
                <div>
                    <h1 className="text-3xl text-primary font-display">Hola, {user?.username} 👋</h1>
                    <p className="text-text-muted italic">¿Qué vamos a jugar hoy?</p>
                </div>
                <button onClick={logout} className="p-2 text-text-muted hover:text-warning transition-colors">
                    <LogOut size={24} />
                </button>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {matches.map((match) => (
                            <CardMatch
                                key={match._id}
                                match={match}
                                onDelete={handleDeleteMatch}
                                onEdit={handleEditMatch}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};