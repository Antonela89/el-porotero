import { ITempCanto, IPlayer, IRound, IMatch } from '@el-porotero/shared';

/**
 * Retorna los nombres de los jugadores de un equipo específico.
 */
export const getTeamPlayerNames = (players: IPlayer[], teamId: 'A' | 'B'): string[] => {
    return players.filter((p) => p.team === teamId).map((p) => p.name);
};

/**
 * Suma puntos temporales (cantos) de un jugador individual.
 */
export const getTempCantosSum = (tempCantos: ITempCanto[], playerName: string): number => {
    return tempCantos
        .filter((c) => c.playerName === playerName)
        .reduce((acc, curr) => acc + curr.points, 0);
};

/**
 * Suma puntos temporales (cantos) de todo un equipo.
 */
export const getTeamTempCantosSum = (tempCantos: ITempCanto[], players: IPlayer[], teamId: 'A' | 'B'): number => {
    const teamNames = getTeamPlayerNames(players, teamId);
    return tempCantos
        .filter((c) => teamNames.includes(c.playerName))
        .reduce((acc, curr) => acc + curr.points, 0);
};

/**
 * Suma los puntos totales de un bando en una ronda específica.
 */
export const sumTeamRound = (round: IRound, players: IPlayer[], teamId: 'A' | 'B'): number => {
    const teamNames = getTeamPlayerNames(players, teamId);
    return round.scores
        .filter((s) => teamNames.includes(s.playerName))
        .reduce((acc, s) => acc + (s.pointsAdded || 0), 0);
};

/**
 * Obtiene los jugadores de un equipo con su estado de dealer ya procesado
 */
export const getTeamPlayersData = (match: IMatch, teamId: 'A' | 'B') => {
    return match.players
        .map((p, i) => ({ ...p, globalIndex: i }))
        .filter(p => p.team === teamId)
        .map(p => ({
            name: p.name,
            isDealer: p.globalIndex === match.currentDealerIndex
        }));
};

/**
 * Calcula el puntaje total de un equipo (Suma de jugadores).
 */
export const getTeamTotalScore = (players: IPlayer[], teamId: 'A' | 'B'): number => {
    return players
        .filter(p => p.team === teamId)
        .reduce((acc, p) => acc + p.score, 0);
};

/**
 * Calcula la distancia al límite (para las etiquetas "Faltan XX").
 */
export const getPointsToLimit = (currentScore: number, limit: number, isDescending: boolean): number => {
    if (isDescending) return currentScore; // En la Mosca, el score actual es lo que falta para 0
    return Math.max(0, limit - currentScore);
};