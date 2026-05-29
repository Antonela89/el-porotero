# El Porotero API (Backend) 🔌⚙️

Este directorio contiene el servidor RESTful de **El Porotero Online**, desarrollado utilizando Node.js, Express, TypeScript y MongoDB (a través de Mongoose). Proporciona la persistencia de datos, la gestión de autenticación sin estado (JWT) y el procesamiento transaccional de las reglas de juego.

---

## 🏗️ Arquitectura y Estructura del Servidor

El código está estructurado en base a las mejores prácticas de modularidad de Express:

*   `src/config/`: Conexión de base de datos (`db.ts`).
*   `src/controllers/`: Controladores encargados de la lógica de procesamiento (auth, partidas, rondas, estadísticas).
*   `src/middlewares/`: Protección de rutas con JWT (`auth.middleware.ts`) y validadores de inputs.
*   `src/models/`: Modelos y esquemas de Mongoose (`User.ts`, `Match.ts`).
*   `src/routes/`: Definición de enrutadores HTTP (`auth.routes.ts`, `match.routes.ts`, `stats.routes.ts`).
*   `src/services/`: Lógicas avanzadas de puntuación y procesamiento de reglamentos.

---

## ⚙️ Configuración del Entorno y Variables (.env)

El servidor requiere que crees un archivo `.env` en la raíz de `apps/api/` con las siguientes claves esenciales:

```ini
PORT=3000
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/el-porotero
JWT_SECRET=super_secreto_para_firmar_tokens_de_seguridad_2026
```

*   `PORT`: Puerto local de ejecución (Default: `3000`).
*   `MONGO_URI`: URI de tu instancia local o cloud de MongoDB Atlas.
*   `JWT_SECRET`: Semilla secreta de alta entropía para encriptar los tokens.

---

## 🗄️ Modelos de Base de Datos (Mongoose)

### 👤 Usuario (`UserModel`)
Guarda credenciales encriptadas con `bcrypt` para autenticación y estadísticas del perfil:
- `username`: Nombre de usuario único (mínimo 3 caracteres).
- `email`: Correo electrónico único validado.
- `password`: Hash seguro de la contraseña.

### 🃏 Partida (`MatchModel`)
Almacena el estado transaccional, historial de puntuaciones y jugadores:
- `gameType`: Categoría del juego (Loba, Mosca, Truco, Burako, etc.).
- `status`: Estado de la mesa (`active`, `finished`, `cancelled`).
- `adminId`: Referencia (`ref: 'User'`) al creador y administrador de la partida.
- `players`: Subdocumentos de jugadores (nombre, score acumulado, equipo `A/B/None`, estado `isOut`, re-enganches).
- `rounds`: Historial inmutable de rondas anotadas (`roundNumber`, `dealerIndex`, `scores: { playerName, pointsAdded, details }`).

---

## 🔌 Detalle de Endpoints (API Routes)

Todas las rutas de partidas y estadísticas requieren el envío del header de autorización:
`Authorization: Bearer <JWT_TOKEN>`

### 🔑 Autenticación (`/api/auth`)
*   `POST /api/auth/register`: Registra un nuevo usuario encriptando la contraseña.
*   `POST /api/auth/login`: Valida credenciales y retorna un token JWT que expira en 24h conteniendo `{ userId, username }`.

### 🎴 Partidas (`/api/matches`)
*   `POST /api/matches`: Crea una partida inicializando configuraciones según la disciplina (ej: Mosca empieza en 15, Truco define límites dinámicos).
*   `GET /api/matches`: Obtiene el listado histórico de partidas donde el usuario participó o es administrador.
*   `GET /api/matches/:matchId`: Detalle completo y en tiempo real de una partida y sus rondas.
*   `PUT /api/matches/:matchId`: Actualiza ganadores, estados o nombres de jugadores (propagando cambios en cascada en las rondas históricas).
*   `DELETE /api/matches/:matchId`: Elimina permanentemente la partida (exclusivo para el creador administrador).

### 📝 Rondas e Interacciones
*   `POST /api/matches/:matchId/round`: Registra una nueva ronda. Aplica reglas avanzadas según el juego (ej: `processMoscaRules` o `processTeamRules` para Truco) y rota el repartidor de cartas automáticamente.
*   `PATCH /api/matches/:matchId/reengage`: Re-engancha a un jugador eliminado en Loba/Chinchón, asignándole el puntaje máximo activo actual y registrando la penalización visual (asterisco).
*   `PATCH /api/matches/:matchId/round/:roundNumber`: Corrige o edita los puntajes de una ronda específica, recalculando todo el historial de la partida de forma automática.
*   `DELETE /api/matches/:matchId/round/:roundNumber`: Elimina una ronda y re-calcula los puntajes previos de la mesa, restituyendo los estados anteriores de los jugadores.

### 📈 Estadísticas (`/api/stats`)
*   `GET /api/stats`: Retorna estadísticas de desempeño calculadas en tiempo real a través de agregaciones avanzadas de MongoDB:
    *   Partidas jugadas, ganadas y perdidas.
    *   Tasa de efectividad de victorias (*winRate*).
    *   Juego favorito del usuario basado en recurrencia.

---

## 🚀 Desarrollo y Compilación local

Los scripts se ejecutan mediante `pnpm` desde la raíz o dentro del directorio:

```bash
# Iniciar en modo desarrollo con recarga automática (nodemon + ts-node)
pnpm dev

# Compilar TypeScript a JS puro en dist/
pnpm build

# Limpiar compilaciones previas
pnpm clean
```
