import { useState, useCallback } from 'react';
import { GameType, IPlayer} from '@el-porotero/shared';
import { GAMES } from '@/constants/games';

export const useNewMatch = (
	initialPlayers: IPlayer[] = [],
	initialGame: GameType = 'Loba',
) => {
	const [gameType, setGameType] = useState<GameType>(initialGame);
	const [players, setPlayers] = useState<IPlayer[]>(initialPlayers);
	const [isTeamGame, setIsTeamGame] = useState(false);

	const currentGame = GAMES.find((g) => g.id === gameType);

	const getCalculatedLimit = useCallback(
		(game: GameType, pCount: number, teams: boolean) => {
			switch (game) {
				case 'Uno':
					return 500;
				case 'Barsiga':
					return 61;
				case 'Mosca':
					return 0;
				case 'Burako':
					return teams ? 5000 : 3000;
				case 'Truco':
					return pCount <= 2 ? 18 : pCount <= 4 ? 24 : 30;
				default:
					return 100; // Loba / Chinchon
			}
		},
		[],
	);

	const [limitScore, setLimitScore] = useState(() =>
		getCalculatedLimit(initialGame, initialPlayers.length, false),
	);

	const syncTeams = useCallback(
		(list: IPlayer[], active: boolean): IPlayer[] =>
			list.map((p, i) => ({
				...p,
				team: active ? (i % 2 === 0 ? 'A' : 'B') : 'None',
			})),
		[],
	);

	// --- ACCIONES DE JUGADORES ---
	const addPlayer = (name: string) => {
		const newPlayer: IPlayer = {
			name: name.trim().toUpperCase(),
			team: 'None',
			score: 0,
			isOut: false,
			reengageCount: 0,
		};
		const nextPlayers = [...players, newPlayer];
		const teamsPossible =
			['Burako', 'Truco'].includes(gameType) &&
			nextPlayers.length >= 4 &&
			nextPlayers.length % 2 === 0;
		const nextTeam = teamsPossible && isTeamGame;

		setPlayers(syncTeams(nextPlayers, nextTeam));
		if (!teamsPossible) setIsTeamGame(false);
		setLimitScore(
			getCalculatedLimit(gameType, nextPlayers.length, nextTeam),
		);
	};

	const removePlayer = (index: number) => {
		const nextPlayers = players.filter((_, i) => i !== index);
		setPlayers(syncTeams(nextPlayers, isTeamGame));
	};

	const editPlayer = (index: number, newName: string) => {
		const nextPlayers = [...players];
		nextPlayers[index] = {
			...nextPlayers[index],
			name: newName.toUpperCase(),
		};
		setPlayers(nextPlayers);
	};

	// --- ACCIONES DE JUEGO ---
	const updateGame = (newType: GameType) => {
		setGameType(newType);
		const supportsTeams = ['Burako', 'Truco'].includes(newType);
		const nextTeam = supportsTeams && isTeamGame;
		setIsTeamGame(nextTeam);
		setPlayers((prev) => syncTeams(prev, nextTeam));
		setLimitScore(getCalculatedLimit(newType, players.length, nextTeam));
	};

	const toggleTeams = () => {
		const next = !isTeamGame;
		setIsTeamGame(next);
		setPlayers((prev) => syncTeams(prev, next));
		if (gameType === 'Burako') setLimitScore(next ? 5000 : 3000);
	};

	return {
		gameType,
		players,
		isTeamGame,
		limitScore,
		currentGame,
		setLimitScore,
		updateGame,
		addPlayer,
		removePlayer,
		editPlayer,
		toggleTeams,
		syncTeams,
		canAddMore: players.length < (currentGame?.maxPlayers || 6),
	};
};
