import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import axios from 'axios';
import { GameSelector } from '@/components/GameSelector';
import { GAMES } from '@/constants/games';
import { X, UserPlus, Play } from 'lucide-react';


export const NewMatchPage = () => {
    const navigate = useNavigate();
    const [gameType, setGameType] = useState('Loba');
    const [playerName, setPlayerName] = useState('');
    const [players, setPlayers] = useState<{ name: string, team: string }[]>([]);
    const [limitScore, setLimitScore] = useState(100);

    const addPlayer = () => {
        if (!playerName.trim()) return;
        setPlayers([...players, { name: playerName, team: 'None' }]);
        setPlayerName('');
    };

    const removePlayer = (index: number) => {
        setPlayers(players.filter((_, i) => i !== index));
    };

    const handleStart = async () => {
        if (players.length < 2) return alert("Mínimo 2 jugadores");
        try {
            const { data } = await api.post('/matches', {
                gameType,
                players: players.map((p, i) => ({ ...p, position: i })),
                limitScore
            });
            navigate(`/match/${data._id}`);
        } catch (error: unknown) {
            let message = "Ocurrió un error inesperado";

            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || error.message;
            } else if (error instanceof Error) {
                message = error.message;
            }

            alert(`Error al crear la partida: ${message}`);
        }
    };


    return (
        <div className="dashboard-container max-w-lg mx-auto">
            <header className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-display font-bold">Nueva Mesa</h1>
                <button onClick={() => navigate('/')} className="p-2 bg-surface rounded-full text-text-muted">
                    <X size={20} />
                </button>
            </header>

            {/* 1. SELECCIÓN DE JUEGO (compacto) */}
            <section className="mb-6">
                <label className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-bold mb-2 block ml-1">
                    Juego Seleccionado
                </label>
                <GameSelector value={gameType} onChange={setGameType} />

                {/* Breve descripción del juego seleccionado */}
                <p className="text-xs text-text-muted mt-3 px-1 italic">
                    {GAMES.find(g => g.id === gameType)?.description}
                </p>
            </section>

            {/* 2. CONFIGURACIÓN EXTRA (Si es Loba) */}
            {gameType === 'Loba' || gameType === 'Chinchon' && (
                <section className="mb-8 animate-in fade-in slide-in-from-top-2">
                    <div className="flex gap-2">
                        {[100, 101].map(val => (
                            <button
                                key={val}
                                onClick={() => setLimitScore(val)}
                                className={`flex-1 py-3 rounded-2xl border-2 transition-all font-bold ${limitScore === val ? 'border-primary bg-primary/10 text-primary' : 'border-white/5 bg-surface text-text-muted'}`}
                            >
                                {val} pts
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* 3. JUGADORES (Sección Principal) */}
            <section className="flex-1 overflow-hidden flex flex-col mb-8">
                <label className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-bold mb-4 block ml-1">
                    Jugadores (Orden de Mesa)
                </label>

                {/* Lista con scroll si hay muchos */}
                <div className="flex flex-col gap-3 mb-6 max-h-75 overflow-y-auto pr-2 custom-scrollbar">
                    {players.map((p, i) => (
                        <div key={i} className="player-input-row flex justify-between px-4 py-3 bg-surface/50 border-white/5 border">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-primary font-bold text-sm">
                                    {i + 1}
                                </div>
                                <span className="font-semibold text-text-main">{p.name}</span>
                            </div>
                            <button onClick={() => removePlayer(i)} className="text-warning/70 hover:text-warning p-1">
                                <X size={18} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Input de agregado siempre visible */}
                <div className="player-input-row border-primary/20 ring-2 ring-primary/5 flex justify-between">
                    <input
                        type="text"
                        placeholder="Sumar jugador..."
                        className="bg-transparent flex-1 outline-none px-3 py-2 text-text-main"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                    />
                    <button onClick={addPlayer} className="bg-primary text-background p-3 rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
                        <UserPlus size={20} />
                    </button>
                </div>
            </section>

            <button
                onClick={handleStart}
                disabled={players.length < 2}
                className="btn-primary w-full py-5 text-xl flex items-center justify-center gap-3 mt-auto shadow-2xl"
            >
                <Play size={24} fill="currentColor" /> ¡A Jugar!
            </button>
        </div>
    );
};