import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GameSelector } from '@/components/GameSelector';
import { IconButton, Button } from '@/components';
import { X, UserPlus, Play, Users, Edit2, Check } from 'lucide-react';
import { useNewMatch } from '@/hooks/useNewMatch';
import { useCreateMatch } from '@/hooks/useCreateMatch';
import { GameType, IPlayer } from '@el-porotero/shared';

// Definimos el payload para el POST
export interface CreateMatchPayload {
    gameType: GameType;
    players: IPlayer[];
    limitScore: number;
    isTeamGame: boolean;
}

export const NewMatchPage = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [playerName, setPlayerName] = useState('');
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [tempEditName, setTempEditName] = useState('');

    const {
        gameType, players, isTeamGame, limitScore, currentGame, canAddMore,
        setLimitScore, updateGame, addPlayer, removePlayer, editPlayer, toggleTeams
    } = useNewMatch(state?.players || [], (state?.gameType as GameType) || 'Loba');

    const { mutate: createMatch, isPending } = useCreateMatch();

    const isTruco = gameType === 'Truco';
    const isPlayerCountValid = isTruco ? (players.length >= 2 && players.length % 2 === 0) : players.length >= 2;
    const hasLimitOptions = ['Loba', 'Chinchon'].includes(gameType);

    const handleSaveEdit = (index: number) => {
        if (tempEditName.trim()) editPlayer(index, tempEditName);
        setEditingIndex(null);
    };

    return (
        <div className="new-match-layout">
            <header className="p-6 flex items-center justify-between border-b border-white/5">
                <h1 className="text-2xl font-display font-bold">Nueva Mesa</h1>
                <IconButton icon={<X size={20} />} title="Cerrar" onClick={() => navigate('/')} />
            </header>

            <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 pb-40 custom-scrollbar">
                {/* Selector de Juego */}
                <section className="flex flex-col gap-3">
                    <label className="label-caps">Juego</label>
                    <GameSelector value={gameType} onChange={(val) => updateGame(val as GameType)} />
                </section>

                {/* Selector de Límite (Loba/Chinchón) */}
                {hasLimitOptions && (
                    <section className="flex flex-col gap-3">
                        <label className="label-caps">Límite de Puntos</label>
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

                {/* Toggle de Equipos */}
                {['Burako', 'Truco'].includes(gameType) && players.length >= 4 && players.length % 2 === 0 && (
                    <div className="flex items-center justify-between bg-surface p-4 rounded-2xl border border-white/5">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold">Jugar por Equipos</span>
                            <span className="text-[10px] text-text-muted">Intercalado</span>
                        </div>
                        <button onClick={toggleTeams} className={`w-12 h-6 rounded-full relative transition-colors ${isTeamGame ? 'bg-primary' : 'bg-background'}`}>
                            <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${isTeamGame ? 'left-7 bg-background' : 'left-1 bg-white'}`} />
                        </button>
                    </div>
                )}

                {/* Lista de Jugadores */}
                <section className="flex flex-col gap-4">
                    <label className="label-caps">Integrantes ({players.length}/{currentGame?.maxPlayers || 6})</label>
                    <div className="flex flex-col gap-2">
                        {players.length === 0 ? (
                            <div className="py-10 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center opacity-30">
                                <Users size={32} />
                                <p className="text-xs mt-2 italic">Mesa vacía</p>
                            </div>
                        ) : (
                            players.map((p, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-surface rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3 flex-1">
                                        <span className="text-[10px] font-bold text-primary w-4">{i + 1}</span>
                                        {editingIndex === i ? (
                                            <input
                                                className="bg-background border border-primary/30 rounded px-2 py-1 text-sm outline-none flex-1 uppercase"
                                                value={tempEditName}
                                                autoFocus
                                                onChange={e => setTempEditName(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && handleSaveEdit(i)}
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold">{p.name}</span>
                                                {p.team !== 'None' && (
                                                    <span className={`text-[8px] px-2 py-0.5 rounded-full border ${p.team === 'A' ? 'border-indigo-500 text-indigo-400' : 'border-rose-500 text-rose-400'}`}>
                                                        EQ {p.team}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-1">
                                        {editingIndex === i ? (
                                            <IconButton icon={<Check size={16} />} variant="primary" title="Guardar" onClick={() => handleSaveEdit(i)} />
                                        ) : (
                                            <IconButton icon={<Edit2 size={16} />} title="Editar" onClick={() => { setEditingIndex(i); setTempEditName(p.name); }} />
                                        )}
                                        <IconButton icon={<X size={16} />} variant="danger" title="Quitar" onClick={() => removePlayer(i)} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>

            <footer className="sticky-footer flex flex-col gap-4">
                {canAddMore ? (
                    <div className="flex gap-2 bg-surface p-2 rounded-2xl border border-white/5">
                        <input
                            placeholder="Sumar jugador..."
                            className="bg-transparent flex-1 px-3 py-2 outline-none uppercase text-sm"
                            value={playerName}
                            onChange={e => setPlayerName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && playerName.trim() && (addPlayer(playerName), setPlayerName(''))}
                        />
                        <IconButton
                            icon={<UserPlus size={20} />}
                            variant="primary"
                            title="Sumar"
                            onClick={() => { if (playerName.trim()) { addPlayer(playerName); setPlayerName(''); } }}
                            disabled={!playerName.trim()}
                        />
                    </div>
                ) : (
                    <div className="bg-warning/10 border border-warning/20 p-2 rounded-xl text-center text-warning font-bold uppercase text-xs">
                        Mesa completa para {gameType}
                    </div>
                )}

                <Button
                    onClick={() => createMatch({ gameType, players: players.map((p, i) => ({ ...p, position: i })), limitScore, isTeamGame })}
                    disabled={!isPlayerCountValid || isPending}
                    loading={isPending}
                    className="w-full py-5!"
                >
                    <Play size={20} fill="currentColor" />
                    {isPlayerCountValid ? `¡A Jugar! (${limitScore} pts)` : 'Esperando jugadores...'}
                </Button>
            </footer>
        </div>
    );
};