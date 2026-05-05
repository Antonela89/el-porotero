import { useState, useCallback, useMemo } from 'react';
import { GameType, IPlayer } from '@el-porotero/shared';
import { GAMES } from '@/constants/games';
import { notify } from '@/utils';

export const useNewMatch = (
	initialPlayers: IPlayer[] = [],
	initialGame: GameType = 'Loba',
) => {
	const [gameType, setGameType] = useState<GameType>(initialGame);
	const [players, setPlayers] = useState<IPlayer[]>(initialPlayers);
	const [limitScore, setLimitScore] = useState(100);

	const checkTeamStatus = (game: GameType, count: number): boolean => {
		const teamGames: GameType[] = ['Truco', 'Burako', 'Escoba', 'Barsiga'];
		if (!teamGames.includes(game)) return false;

		if (game === 'Burako') return count === 4;
		if (game === 'Truco') return count >= 4;
		if (game === 'Escoba' || game === 'Barsiga')
			return count === 4 || count === 6;

		return false;
	};

	const isTeamGame = useMemo(
		() => checkTeamStatus(gameType, players.length),
		[gameType, players.length],
	);

	const currentGame = useMemo(
		() => GAMES.find((g) => g.id === gameType),
		[gameType],
	);

	const getCalculatedLimit = useCallback(
		(game: GameType, pCount: number, teams: boolean) => {
			switch (game) {
				case 'Uno':
					return 500;
				case 'Barsiga':
					return 61;
				case 'Escoba':
					return 15;
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

	const syncTeams = useCallback(
		(list: IPlayer[], active: boolean): IPlayer[] =>
			list.map((p, i) => ({
				...p,
				team: active ? (i % 2 === 0 ? 'A' : 'B') : 'None',
			})),
		[],
	);

	const updateTableState = useCallback(
		(nextPlayers: IPlayer[], nextGame: GameType) => {
			const teamActive = checkTeamStatus(nextGame, nextPlayers.length);
			const syncedPlayers = syncTeams(nextPlayers, teamActive);

			setPlayers(syncedPlayers);

			if (!['Loba', 'Chinchon'].includes(nextGame)) {
				setLimitScore(
					getCalculatedLimit(
						nextGame,
						syncedPlayers.length,
						teamActive,
					),
				);
			}
		},
		[getCalculatedLimit, syncTeams],
	);

	// --- ACCIONES DE JUGADORES ---

	const addPlayer = (name: string) => {
		const cleanName = name.trim().toUpperCase();

		if (players.some((p) => p.name === cleanName)) {
			notify.error('¡Ese nombre ya está en la mesa!');
			return false;
		}

		const newPlayer: IPlayer = {
			name: cleanName,
			team: 'None',
			score: 0,
			isOut: false,
			reengageCount: 0,
		};

		const nextPlayers = [...players, newPlayer];
		updateTableState(nextPlayers, gameType);
		return true;
	};

	const removePlayer = (index: number) => {
		const nextPlayers = players.filter((_, i) => i !== index);
		updateTableState(nextPlayers, gameType);
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
		updateTableState(players, newType);
	};

	const toggleTeams = () => {
		const nextPlayers = syncTeams(players, !isTeamGame);
		setPlayers(nextPlayers);
		if (gameType === 'Burako') setLimitScore(!isTeamGame ? 5000 : 3000);
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
