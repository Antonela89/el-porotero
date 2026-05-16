import { GameType } from '@el-porotero/shared';

export type GameColorID = 'loba' | 'truco' | 'chinchon' | 'mosca' | 'escoba' | 'barsiga' | 'burako' | 'uno';

export const GAME_COLORS: Record<GameType, GameColorID> = {
    Loba: 'loba',
    Truco: 'truco',
    Chinchon: 'chinchon',
    Mosca: 'mosca',
    Escoba: 'escoba',
    Barsiga: 'barsiga',
    Burako: 'burako',
    Uno: 'uno'
};

/**
 * Retorna la variable CSS lista para usar en style={{ color: ... }}
 */
export const getGameColorVar = (type: GameType): string => {
    const colorId = GAME_COLORS[type] || 'loba';
    return `var(--color-${colorId.toLowerCase()})`;
};

/**
 * Retorna un objeto de estilo para los equipos para que sea consistente
 */
export const getTeamStyle = (team: 'A' | 'B') => {
    return {
        color: team === 'A' ? 'var(--color-secondary)' : '#fb7185',
        border: team === 'A' ? 'var(--color-secondary)' : '#fb7185'
    };
};