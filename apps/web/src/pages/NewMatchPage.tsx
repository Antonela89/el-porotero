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
    const [gameType, setGameType] = useState<string>(() => state?.gameType || 'Loba');

    const [isTeamGame, setIsTeamGame] = useState<boolean>(() =>
        ['Burako', 'Truco'].includes(state?.gameType || gameType)
    );

    const [limitScore, setLimitScore] = useState(100);

    // --- ESTADO DE JUGADORES ---
    const [players, setPlayers] = useState<IPlayer[]>(() => state?.players || []);
    const [playerName, setPlayerName] = useState('');
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [tempEditName, setTempEditName] = useState('');

    const currentGame = GAMES.find(g => g.id === gameType);

    const maxAllowed = currentGame?.maxPlayers || 6;
    const canAddMore = players.length < maxAllowed;
    const hasLimitOptions = ['Loba', 'Chinchon'].includes(gameType);

    const syncPlayersWithTeamMode = (list: IPlayer[], teamMode: boolean) : IPlayer[] => {
        return list.map((p, i) => ({
            ...p,
            team: teamMode ? (i % 2 === 0 ? 'A' : 'B') : 'None' as const
        }));
    };

    const handleGameChange = (newType: string) => {
        setGameType(newType);
        const teamEnabled = ['Burako', 'Truco'].includes(newType);
        setIsTeamGame(teamEnabled);
        setPlayers(prev => syncPlayersWithTeamMode(prev, teamEnabled));
    };

    const addPlayer = () => {
        if (!canAddMore && !playerName.trim()) return;

        // Evitar nombres duplicados en la misma mesa
        if (players.some(p => p.name.toLowerCase() === playerName.toLowerCase())) {
            alert("Ya hay un jugador con ese nombre");
            return;
        }

        const newPlayer: IPlayer = {
            name: playerName.trim().toUpperCase(),
            team: 'None',
            score: 0,
            isOut: false
        };

        setPlayers(prev => syncPlayersWithTeamMode([...prev, newPlayer], isTeamGame));
        setPlayerName(''); // Limpiamos el input
    };

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
        const filtered = players.filter((_, i) => i !== index);
        setPlayers(syncPlayersWithTeamMode(filtered, isTeamGame));
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

                {/* SELECCIÓN DE JUEGO (compacto) */}
                <section>
                    <label className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-bold mb-2 block ml-1">
                        Juego Seleccionado
                    </label>
                    <GameSelector value={gameType} onChange={handleGameChange} />

                    {/* Breve descripción del juego seleccionado */}
                    <p className="text-xs text-text-muted mt-3 px-1 italic">
                        {GAMES.find(g => g.id === gameType)?.description}
                    </p>
                </section>

                {/* SELECTOR DE LÍMITE (Solo Loba/Chinchon) */}
                {hasLimitOptions && (
                    <section>
                        <label className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-bold mb-3 block">
                            Límite de Puntos
                        </label>
                        <div className="flex gap-2 bg-surface p-1 rounded-2xl border border-white/5">
                            {[100, 101].map(val => (
                                <button
                                    key={val}
                                    onClick={() => setLimitScore(val)}
                                    className={`flex-1 py-3 rounded-xl transition-all font-bold text-sm 
                                ${limitScore === val ? 'bg-primary text-background shadow-lg' : 'text-text-muted hover:text-text-main'}`}
                                >
                                    {val} PUNTOS
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {/* TOGGLE DE EQUIPOS (Solo si el juego lo permite) */}
                {['Burako', 'Truco'].includes(gameType) && (
                    <section>
                        <div className="flex items-center justify-between bg-surface p-4 rounded-2xl border border-white/5 shadow-inner">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-text-main">Jugar por Equipos</span>
                                <span className="text-[10px] text-text-muted">Intercalado (1-3 vs 2-4)</span>
                            </div>
                            <button
                                onClick={() => setIsTeamGame(prev => !prev)}
                                className={`w-12 h-6 rounded-full transition-all relative ${isTeamGame ? 'bg-primary' : 'bg-background'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 rounded-full ${isTeamGame ? 'bg-background' : 'bg-white'} transition-all ${isTeamGame ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </section>
                )}


                {/* JUGADORES (Sección Principal) */}
                <section className="flex-1 overflow-hidden flex flex-col mb-8 custom-scrollbar animate-in fade-in slide-in-from-bottom-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] mb-4 text-text-muted font-bold block">
                        Integrantes ({players.length} / {maxAllowed})
                    </label>

                    {/* Lista con scroll si hay muchos */}
                    <div className="flex flex-col max-h-75 mb-3 overflow-y-auto custom-scrollbar">
                        {players.length === 0 ? (
                            <div className="py-8 border-2 border-dashed border-white rounded-3xl flex flex-col items-center justify-center text-text-muted opacity-40">
                                <Users size={32} className="mb-2" />
                                <p className="text-xs italic">La mesa está vacía...</p>
                            </div>
                        ) : (
                            // Solo si hay jugadores, mapeamos las filas
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
                                            p.team !== 'None' ? (
                                                <>
                                                    <span className="font-semibold text-text-main">{p.name}</span>
                                                    <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold border ${p.team === 'A' ? 'border-indigo-500 text-indigo-400' : 'border-rose-500 text-rose-400'}`}>EQUIPO {p.team}</span>
                                                </>
                                            ) :
                                                <span className="font-semibold text-text-main">{p.name}</span>
                                        )}
                                    </div>

                                    <div className="flex gap-1">
                                        {editingIndex === i ? (
                                            <button onClick={() => saveEdit(i)} className="text-emerald-400 p-1">
                                                <Check size={18} />
                                            </button>
                                        ) : (
                                            <button onClick={() => startEditing(i, p.name)} className="text-primary/70 hover:text-primary p-1">
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
                </section>
            </main>

            {/* 4. FOOTER FIJO (Sumar + Jugar) */}
            <footer className="fixed bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-xl border-t border-white/5 flex flex-col gap-4 max-w-lg mx-auto z-20">
                {/* AVISO DINÁMICO DE LÍMITE */}
                {canAddMore && (
                    <div className="bg-warning/10 border border-warning/20 p-2 rounded-xl flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-2">
                        <span className="text-[16px] text-warning font-bold uppercase tracking-tighter text-center">
                            Mesa completa para {gameType} ({maxAllowed} personas)
                        </span>
                    </div>
                )}

                {!canAddMore && (
                    <div className="flex gap-2 bg-surface p-2 rounded-2xl border border-white/5 focus-within:border-primary/50 transition-all">
                        <input
                            type="text"
                            placeholder="Sumar jugador..."
                            className="bg-transparent flex-1 outline-none px-3 py-2 text-text-main placeholder:text-text-muted/40 uppercase"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
                            onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                        />
                        <button onClick={addPlayer} disabled={!playerName.trim()} className="bg-primary text-background p-3 rounded-xl active:scale-90 transition-transform disabled:opacity-30">
                            <UserPlus size={20} />
                        </button>
                    </div>
                )}

                <button
                    onClick={handleStart}
                    disabled={players.length < 2}
                    className="btn-primary w-full py-5 text-lg flex items-center justify-center gap-3 shadow-2xl disabled:opacity-20"
                >
                    <Play size={20} fill="currentColor" />
                    ¡A Jugar! {gameType === 'Uno' ? '(500 pts)' : gameType === 'Burako' ? (isTeamGame ? '(5000 pts)' : '(3000 pts)') : `(${limitScore} pts)`}
                </button>
            </footer>
        </div>
    );
};
