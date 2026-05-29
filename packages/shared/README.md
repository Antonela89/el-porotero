# @el-porotero/shared

### Biblioteca Central de Interfaces, Esquemas de Validación y Reglas de Negocio 🃏📐

Este paquete actúa como el núcleo lógico y de tipado de **El Porotero Online**. Es consumido de manera directa tanto por el backend (`apps/api`) como por la aplicación cliente (`apps/web`), asegurando una sincronización perfecta y tipado estricto en todo el flujo de datos.

---

## 📂 Contenido del Paquete

*   `src/types.ts`: Definición de interfaces TypeScript para jugadores, partidas, configuraciones, detalles de rondas y estadísticas.
*   `src/schemas.ts`: Esquemas de validación en tiempo de ejecución implementados con **Zod** para la seguridad de la API y formularios del cliente.
*   `src/rules.ts`: Lógicas matemáticas y operativas compartidas de los juegos (ej: la regla de exclusividad de puntos).

---

## 🛠️ Tipos e Interfaces Clave (`src/types.ts`)

### `IMatch` (La Partida)
Representa el estado completo de una mesa de juego:
```typescript
export interface IMatch {
    _id?: string;
    gameType: 'Loba' | 'Truco' | 'Chinchon' | 'Escoba' | 'Barsiga' | 'Mosca' | 'Burako' | 'Uno';
    status: 'active' | 'finished' | 'cancelled';
    players: IPlayer[];
    winner?: string;
    config: IMatchConfig;
    currentDealerIndex: number;
    rounds: IRound[];
    isTeamGame: boolean;
    tempCantos: ITempCanto[];
}
```

### `IRoundDetails` (Carga y Anotador)
Estructura polimórfica que almacena los detalles de puntuación específicos para cada disciplina de juego:
*   **Loba / Chinchón**: Cierres (`isCerrar`), cortes (`isCorteMinus10`) y re-enganches (`isReengage`).
*   **Mosca**: Bazas anotadas (`bazas`) y pasos (`paso`).
*   **Escoba / Bársiga**: Escobas simples (`escobas`), Velos de Oro de 1, 7 o 12 (`velos`, `hasVeloAs`, etc.), y cantos de Bársiga.
*   **Burako**: Fichas, canastas puras/impuras, batida y toma de muerto.

---

## 🛡️ Esquemas Zod (`src/schemas.ts`)

Los esquemas garantizan la integridad de los datos en tiempo de ejecución. Son ideales para validar peticiones HTTP en la API y entradas en la UI:

*   `UserZodSchema`: Validación de registro (username, email y contraseña segura).
*   `LoginZodSchema`: Validación estructurada de credenciales de ingreso.
*   `MatchZodSchema`: Garantiza la estructura correcta de una mesa antes de su inicialización.

Ejemplo de uso:
```typescript
import { UserZodSchema, UserDTO } from '@el-porotero/shared';

// En la API
const validation = UserZodSchema.safeParse(req.body);
if (!validation.success) {
    return res.status(400).json(validation.error);
}
```

---

## ⚖️ Reglas de Negocio Compartidas (`src/rules.ts`)

### Lógica de Exclusividad de Puntos
Muchos juegos tradicionales de cartas (como Bársiga y Escoba) poseen hitos exclusivos en cada ronda (ej: el jugador que tiene la mayor cantidad de oros o la mayor cantidad de cartas se lleva el punto de mesa, pero no pueden llevárselo varios).

La función `applyExclusivity` implementa esta regla de negocio en memoria para la UI y el backend de forma matemática:
```typescript
export const applyExclusivity = (
    scores: IRoundScore[],
    targetIndex: number,
    key: keyof IRoundDetails,
    newValue: boolean,
): IRoundScore[] => { ... }
```
Si un jugador activa un punto de exclusividad (ej: `hasOros = true`), la función automáticamente resetea la propiedad a `false` para todos los demás jugadores de la ronda, previniendo errores humanos de anotación redundante.

---

## 🚀 Compilación y Desarrollo

Este paquete requiere compilarse antes de que las aplicaciones de `apps/` puedan reconocer los cambios.

### Compilar
```bash
# Desde la raíz del monorepo
pnpm --filter @el-porotero/shared build

# O dentro de packages/shared
pnpm build
```

### Limpiar
```bash
pnpm clean
```
