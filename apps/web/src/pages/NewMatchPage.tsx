import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconButton, Button, GameSelector, Input } from '@/components';
import { X, UserPlus, Play, Users, Edit2, Check } from 'lucide-react';
import { useNewMatch, useCreateMatch } from '@/hooks';;
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
        setLimitScore, updateGame, addPlayer, removePlayer, editPlayer
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
            <header className="new-match-header">
                <h1>Nueva Mesa</h1>
                <IconButton icon={<X size={20} />} title="Cerrar" onClick={() => navigate('/')} />
            </header>

            <main className="new-match-main">
                {/* Selector de Juego */}
                <section className="new-match-section">
                    <label className="label-caps">Juego</label>
                    <GameSelector value={gameType} onChange={(val) => updateGame(val as GameType)} />
                </section>

                {/* Selector de Límite (Loba/Chinchón) */}
                {hasLimitOptions && (
                    <section className="new-match-section">
                        <label className="label-caps">Límite de Puntos</label>
                        <div className="limit-selector-group">
                            {[100, 101].map(val => (
                                <button
                                    key={val}
                                    onClick={() => setLimitScore(val)}
                                    className={`limit-btn ${limitScore === val ? 'active' : ''}`}
                                >
                                    {val} PUNTOS
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {isTeamGame && (
                    <div className="info-box py-3 flex items-center justify-center gap-2">
                        <Users size={14} />
                        PARTIDA POR EQUIPOS (INTERCALADO)
                    </div>
                )}

                {/* Lista de Jugadores */}
                <section className="new-match-section">
                    <label className="label-caps">Integrantes ({players.length}/{currentGame?.maxPlayers || 6})</label>
                    <div className="player-list-container">
                        {players.length === 0 ? (
                            <div className="empty-table-placeholder">
                                <Users size={32} />
                                <p>Mesa vacía</p>
                            </div>
                        ) : (
                            players.map((p, i) => (
                                <div key={i} className="player-row-card">
                                    <div>
                                        <span className="player-number">{i + 1}</span>
                                        {editingIndex === i ? (
                                            <Input
                                                autoFocus
                                                value={tempEditName}
                                                containerClassName="flex-1"
                                                className="player-edit-input"
                                                onChange={e => setTempEditName(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && handleSaveEdit(i)}
                                            />
                                        ) : (
                                            <div className="player-row">
                                                <span className="player-row-name">{p.name}</span>
                                                {p.team !== 'None' && (
                                                    <span className={`team-badge team-${p.team.toLowerCase()}`}>
                                                        EQ {p.team}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="player-row-actions">
                                        {editingIndex === i ? (
                                            <IconButton icon={<Check size={16} />} variant="primary" title="Guardar" onClick={() => handleSaveEdit(i)} />
                                        ) : (
                                            <IconButton icon={<Edit2 size={16} />} variant="info" title="Editar" onClick={() => { setEditingIndex(i); setTempEditName(p.name); }} />
                                        )}
                                        <IconButton icon={<X size={16} />} variant="danger" title="Quitar" onClick={() => removePlayer(i)} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>

            <footer className="new-match-footer">
                {canAddMore ? (
                    <div className="player-input-row">
                        <Input
                            placeholder="Sumar jugador..."
                            className="input-player"
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
                    <div className="warning-box">
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