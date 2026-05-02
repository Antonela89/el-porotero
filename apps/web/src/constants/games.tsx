import {
    Swords,
    Flower2,
    Coins,
    Layers,
    Bug,
    LayoutGrid,
    Dice5,
    Copy
} from 'lucide-react';

export interface GameDefinition {
    id: string;
    name: string;
    maxPlayers: number;
    description: string;
    icon: React.ReactNode;
    color: string;
    defaultLimit?: number;
    isDescending: boolean;
}

export const GAMES: GameDefinition[] = [
    {
        id: 'Loba',
        name: 'Loba',
        maxPlayers: 6,
        description: 'Gana el último en pie. Límite de 100 o 101 puntos.',
        icon: <Layers size={24} />,
        color: 'text-blue-400',
        defaultLimit: 100 | 101,
        isDescending: false
    },
    {
        id: 'Truco',
        name: 'Truco',
        maxPlayers: 6,
        description: 'El clásico rioplatense. Se juega a 30 puntos (15 y 15).',
        icon: <Swords size={24} />,
        color: 'text-red-400',
        defaultLimit: 30 | 24 | 18, // 30 para 6 jugadores, 24 para 4, 18 para 2
        isDescending: false
    },
    {
        id: 'Chinchon',
        name: 'Chinchón',
        maxPlayers: 6,
        description: 'Armá escaleras y grupos. No te pases de 100.',
        icon: <LayoutGrid size={24} />,
        color: 'text-green-400',
        defaultLimit: 100 | 101,
        isDescending: false
    },
    {
        id: 'Mosca',
        name: 'Mosca',
        maxPlayers: 5,
        description: 'Juego de bazas descendente. Arrancás con 15, llegás a 0.',
        icon: <Bug size={24} />,
        color: 'text-purple-400',
        defaultLimit: 0,
        isDescending: true
    },
    {
        id: 'Escoba',
        name: 'Escoba de 15',
        maxPlayers: 6,
        description: 'Sumá 15 con las cartas de la mesa. A 15 puntos.',
        icon: <Coins size={24} />,
        color: 'text-yellow-400',
        defaultLimit: 15,
        isDescending: false
    },
    {
        id: 'Barsiga',
        name: 'Bársiga',
        maxPlayers: 6,
        description: 'Escoba de 61 puntos con cantos (Flor, Escalera, etc.).',
        icon: <Flower2 size={24} />,
        color: 'text-pink-400',
        defaultLimit: 61,
        isDescending: false
    },
    {
        id: 'Burako',
        name: 'Burako',
        maxPlayers: 4,
        description: 'Canastas y muertos. A 3000 o 5000 puntos.',
        icon: <Dice5 size={24} />,
        color: 'text-orange-400',
        defaultLimit: 3000 | 5000,
        isDescending: false
    },
    {
        id: 'Uno',
        name: 'Uno',
        maxPlayers: 4,
        description: 'Sumá los puntos de tus cartas. El límite estándar es 500.',
        icon: <Copy size={24} />, 
        color: 'text-violet-400',
        defaultLimit: 500,
        isDescending: false
    },
];

// Tip Pro: Crear un objeto para búsquedas rápidas por ID
export const GAMES_MAP = GAMES.reduce((acc, game) => {
    acc[game.id] = game;
    return acc;
}, {} as Record<string, GameDefinition>);