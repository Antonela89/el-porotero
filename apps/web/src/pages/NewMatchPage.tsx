import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconButton, Button, GameSelector, Input } from '@/components';
import { X, UserPlus, Play, Users, Edit2, Check, ArrowLeft } from 'lucide-react';
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
    const { state } = useLocation();
    const navigate = useNavigate();
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
        <>
            <Helmet>
                <title>El Porotero | Mis Partidas</title>
                <meta name="description" content="Gestioná tus partidas de Truco, Loba y Bársiga en tiempo real." />
                <meta property="og:title" content="El Porotero Online" />
                <meta property="og:description" content="El anotador profesional para timbiar con amigos." />
                <meta property="og:image" content="/og-image.jpg" /> {/* Imagen 1200x630px en public/ */}
            </Helmet>

            <div className='new-match-page'>
                <header className="new-match-header">
                    <div className="flex items-center justify-between">
                        <IconButton icon={<ArrowLeft />} onClick={() => navigate('/')} title="Volver" />
                        <h1 className="text-lg font-black uppercase tracking-tight">Nueva Mesa</h1>
                        <div className="w-10" />
                    </div>
                </header>


                {/* Selección de Juego */}
                <section className="setup-section">
                    <label className="label-mini pt-4">¿Qué van a jugar?</label>
                    <GameSelector value={gameType} onChange={(val) => updateGame(val as GameType)} />
                </section>

                {/* Selector de Límite (Loba/Chinchón) */}
                {hasLimitOptions && (
                    <section className="setup-section">
                        <label className="label-mini">Límite de Puntos</label>
                        <div className="segmented-control">
                            {[100, 101].map(val => (
                                <button
                                    key={val}
                                    onClick={() => setLimitScore(val)}
                                    className={`segmented-btn ${limitScore === val ? 'active' : ''}`}
                                >
                                    {val} Puntos
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {/* Aviso juego de equipos*/}
                {isTeamGame && (
                    <div className="info-banner-mini mb-4">
                        <Users size={12} className="inline mr-2" />
                        Partida por equipos
                    </div>
                )}

                <div className="new-match-main">
                    <label className="label-mini mb-4">Integrantes ({players.length}/{currentGame?.maxPlayers || 6})</label>
                    {players.length === 0 ? (
                        <div className="empty-mesa">
                            <Users size={26} />
                            <span>Mesa vacía</span>
                        </div>
                    ) : (
                        <div className="players-setup-list">
                            {/* Lista de Jugadores (Scrollable) */}
                            {players.map((p, i) => {
                                const isTeamA = i % 2 === 0;
                                const teamName = isTeamA ? 'A' : 'B';
                                return (
                                    <div key={i} className="player-setup-card relative overflow-hidden">
                                        {isTeamGame && (
                                            <div className={`team-indicator-bar ${isTeamA ? 'team-a-bar' : 'team-b-bar'}`} />
                                        )}
                                        <div className="player-setup-info">
                                            <span className={`player-number-circle ${isTeamGame ? (isTeamA ? 'team-a-circle' : 'team-b-circle') : 'player-setup-index'}`}>
                                                {i + 1}
                                            </span>
                                            {editingIndex === i ? (
                                                <Input
                                                    value={tempEditName}
                                                    onChange={e => setTempEditName(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && handleSaveEdit(i)}
                                                    className="player-setup-input"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-between w-full">
                                                    <span className="player-row-name">{p.name}</span>
                                                    {/* 3. Label de bando al lado del nombre */}
                                                    {isTeamGame && (
                                                        <span className={`team-label-tag ${isTeamA ? 'team-a-tag' : 'team-b-tag'}`}>
                                                            EQ. {teamName}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-3">
                                            {editingIndex === i ? (
                                                <IconButton icon={<Check size={16} />} variant="primary" title="Ok" onClick={() => handleSaveEdit(i)} />
                                            ) : (
                                                <IconButton icon={<Edit2 size={16} />} variant="info" title="Edit" onClick={() => { setEditingIndex(i); setTempEditName(p.name); }} />
                                            )}
                                            <IconButton icon={<X size={16} />} variant="danger" title="X" onClick={() => removePlayer(i)} />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Footer fijo con el Input de Jugador */}
                <footer className="setup-footer">
                    {canAddMore ? (
                        <div className="add-player-row">
                            <Input
                                containerClassName='w-full'
                                className='flex-1'
                                placeholder="Nombre del jugador..."
                                value={playerName.toUpperCase()}
                                onChange={e => setPlayerName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && playerName.trim() && (addPlayer(playerName), setPlayerName(''))}
                            />
                            <IconButton
                                icon={<UserPlus size={24} />}
                                className='w-14 h-14 rounded-full'
                                variant="primary"
                                title="Sumar"
                                onClick={() => { if (playerName.trim()) { addPlayer(playerName); setPlayerName(''); } }}
                                disabled={!playerName.trim()}
                            />
                        </div>
                    ) : (
                        <div className="info-banner-mini">
                            Mesa completa para {gameType}
                        </div>
                    )}

                    <Button
                        onClick={() => createMatch({ gameType, players: players.map((p, i) => ({ ...p, position: i })), limitScore, isTeamGame })}
                        disabled={!isPlayerCountValid || isPending}
                        loading={isPending}
                        className="flex-1 font-black uppercase py-4"
                    >
                        <Play size={20} fill="currentColor" />
                        {isPlayerCountValid ? `¡A Jugar!` : 'Esperando jugadores'}
                    </Button>
                </footer>
            </div>
        </>
    );
};