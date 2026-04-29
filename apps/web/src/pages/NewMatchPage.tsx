import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import axios from 'axios';
import { GameSelector } from '@/components/GameSelector';
import { GAMES } from '@/constants/games';
import { X, Users, UserPlus, Play, Edit2, Check } from 'lucide-react';
import { IPlayer } from '@el-porotero/shared';

interface RematchState {
    gameType: string;
    players: IPlayer[];
}

export const NewMatchPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const state = location.state as RematchState | null;

    // --- ESTADO DE JUEGO ---
    const [gameType, setGameType] = useState<string>(() => {
        // Si venimos de una revancha, usamos ese juego, si no, 'Loba'
        return state?.gameType || 'Loba';
    });

    // --- ESTADO DE JUGADORES ---
    const [players, setPlayers] = useState<IPlayer[]>(() => state?.players || []);
    const [playerName, setPlayerName] = useState('');
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [tempEditName, setTempEditName] = useState('');
    const [limitScore, setLimitScore] = useState(100);


    const addPlayer = () => {
        const trimmedName = playerName.trim();
        if (!trimmedName) return;

        // Evitar nombres duplicados en la misma mesa
        if (players.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
            alert("Ya hay un jugador con ese nombre");
            return;
        }

        const newPlayer: IPlayer = {
            name: trimmedName,
            team: 'None',
            score: 0,
            isOut: false
        };

        setPlayers([...players, newPlayer]);
        setPlayerName(''); // Limpiamos el input
    };

    // Limite de jugadores: Mosca máximo 5, el resto máximo 6
    const isMosca = gameType === 'Mosca';
    const canAddMorePlayers = isMosca ? players.length < 5 : players.length < 6;

    const startEditing = (index: number, currentName: string) => {
        setEditingIndex(index);
        setTempEditName(currentName);
    };

    const saveEdit = (index: number) => {
        if (!tempEditName.trim()) return;
        const newPlayers = [...players];
        newPlayers[index] = { ...newPlayers[index], name: tempEditName }
        setPlayers(newPlayers);
        setEditingIndex(null);
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
        <div className="dashboard-container h-dvh bg-background overflow-hidden max-w-lg mx-auto">
            <header className="pb-6 flex items-center justify-between border-b border-white/5 bg-background/80 backdrop-blur-md z-10">
                <h1 className="text-2xl font-display font-bold">Nueva Mesa</h1>
                <button onClick={() => navigate('/')} className="p-2 bg-surface rounded-full text-text-muted hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </header>

            <main className="flex-1 overflow-y-auto flex flex-col gap-2">

                {/* 1. SELECCIÓN DE JUEGO (compacto) */}
                <section>
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
                <section className="flex-1 overflow-hidden flex flex-col mb-8 custom-scrollbar animate-in fade-in slide-in-from-bottom-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-bold mb-4 block ml-1">
                        Jugadores (Orden de Mesa)
                    </label>

                    {/* Lista con scroll si hay muchos */}
                    <div className="flex flex-col max-h-75 mb-3 overflow-y-auto custom-scrollbar">
                        {players.length === 0 ? (
                            <div className="py-8 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-text-muted opacity-40">
                                <Users size={32} className="mb-2" />
                                <p className="text-xs italic">La mesa está vacía...</p>
                            </div>
                        ) : (
                            // 3. Solo si hay jugadores, mapeamos las filas
                            players.map((p, i) => (
                                <div key={i} className="player-input-row flex justify-between p-3 bg-surface/50 border-white/5 border">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-6 h-6 rounded-full bg-background flex items-center justify-center text-primary font-bold text-[10px]">
                                            {i + 1}
                                        </div>
                                        {editingIndex === i ? (
                                            <input
                                                className="bg-background border border-primary/30 rounded px-2 py-1 text-sm outline-none flex-1"
                                                value={tempEditName}
                                                onChange={(e) => setTempEditName(e.target.value.toUpperCase())}
                                                autoFocus
                                                onKeyDown={(e) => e.key === 'Enter' && saveEdit(i)}
                                            />
                                        ) : (
                                            <span className="font-semibold text-text-main">{p.name}</span>
                                        )}
                                    </div>

                                    <div className="flex gap-1">
                                        {editingIndex === i ? (
                                            <button onClick={() => saveEdit(i)} className="text-emerald-400 p-1">
                                                <Check size={18} />
                                            </button>
                                        ) : (
                                            <button onClick={() => startEditing(i, p.name)} className="text-text-muted hover:text-primary p-1">
                                                <Edit2 size={18} />
                                            </button>
                                        )}
                                        <button onClick={() => removePlayer(i)} className="text-warning/70 hover:text-warning p-1">
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>
                            )))}
                    </div>

                    {/* Input de agregado siempre visible */}
                    <div className="player-input-row border-primary/20 ring-2 p-2 ring-primary/5 flex justify-between">
                        <input
                            type="text"
                            placeholder={canAddMorePlayers ? "Sumar jugador..." : "Límite de jugadores alcanzado"}
                            disabled={!canAddMorePlayers} // Bloquear el input
                            className="bg-transparent flex-1 outline-none py-2 text-text-main"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
                            onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                        />
                        <button onClick={addPlayer} className="bg-primary text-background p-3 rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                            disabled={!canAddMorePlayers || !playerName.trim()}>
                            <UserPlus size={20} />
                        </button>
                    </div>

                    {/* Aviso visual */}
                    {isMosca && players.length === 5 && (
                        <p className="text-[10px] text-warning mt-2 ml-1 animate-pulse font-bold uppercase">
                            ⚠️ La Mosca se juega con máximo 5 jugadores (Regla del Sombrero activa)
                        </p>
                    )}
                </section>
            </main>
            <footer className='fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-lg px-4'>
                <button
                    onClick={handleStart}
                    disabled={players.length < 2}
                    className="btn-primary w-full py-5 text-xl flex items-center justify-center gap-3 mt-auto shadow-2xl"
                >
                    <Play size={24} fill="currentColor" /> ¡A Jugar!
                </button>
            </footer>
        </div >
    );
};