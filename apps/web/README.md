# El Porotero Web (Frontend) 💻📱

Este directorio alberga la aplicación cliente de **El Porotero Online**, desarrollada como una Single Page Application (SPA) responsiva y una Progressive Web App (PWA) de alta performance. El cliente está construido con React 19, Vite 8, TypeScript y Tailwind CSS v4, y está completamente optimizado bajo un enfoque **Touch-First** para asegurar la mejor experiencia de anotación desde dispositivos táctiles durante las partidas.

---

## 🚀 Características Exclusivas del Frontend

### 📱 Experiencia Táctil Nativa y "Standalone"
*   **Diseño Touch-First**: Deshabilitación de estados `:hover` residuales mediante media-queries de hardware para evitar botones pegados, y animaciones `:active` de respuesta háptica visual rápida (100ms).
*   **PWA Completa**: Registra Service Workers para habilitar funcionamiento offline y almacenamiento local caché, instalable como una app nativa en dispositivos iOS/Android con el icono del **Poroto Dorado 3D**.
*   **Dynamic Viewport Height**: Garantiza mediante utilidades como `h-dvh` que los botones interactivos principales siempre queden en pantalla, previniendo que la barra de navegación del navegador o el teclado del sistema los cubran.
*   **Escalado Extremo**: Layout flexible diseñado para ajustarse y verse perfectamente en resoluciones muy bajas (desde **320px** del iPhone SE) hasta pantallas 4K.

### 🎨 Inyección Dinámica de Temas (*Style Engine*)
La aplicación implementa un sistema de inyección dinámica de estilos basado en **Variables CSS del `:root`**. Dependiendo del juego que se esté jugando (Loba, Truco, Mosca, etc.), el sistema de diseño cambia de manera reactiva, tiñendo la interfaz con la paleta de colores del juego activo sin añadir código Tailwind repetitivo.

---

## 🏗️ Arquitectura de Componentes y Páginas

### Estructura de Vistas (`src/pages/`)
1.  **`DashboardPage`**: Centro neurálgico del usuario, muestra su listado histórico de partidas activas o finalizadas ordenadas cronológicamente.
2.  **`NewMatchPage`**: Interfaz interactiva de configuración para crear una mesa de juego. Permite seleccionar el juego, la cantidad de jugadores, el bando de equipos (para Truco/Burako) y los límites de puntos.
3.  **`MatchDetailPage`**: La pantalla principal del juego de cartas (la mesa). Rinde el marcador en tiempo real y abre el modal correspondiente de anotador para registrar rondas.
4.  **`StatsPage`**: Panel de control interactivo que grafica el desempeño histórico del jugador (win/loss ratio, win rate, y juego favorito).

### Estructura de Componentes (`src/components/`)
La mesa de juego está modularizada en base a responsabilidades atómicas:
```text
src/components/match/
├── board/                 # Renderiza la mesa de juego, tarjetas de puntajes individuales y barras de progreso.
├── forms/                 # Los campos del anotador de puntos. Contiene formularios y validaciones complejas de entrada.
├── modals/                # Modales secundarios para editar mesas, agregar cantos de Bársiga o re-engancharse.
└── index.ts               # Barrel exports para limpieza y simplificación de importaciones.
```

---

## 🛠️ Arquitectura de Custom Hooks

Cada juego tradicional cuenta con su propio gancho personalizado de lógica (*Custom Hook*) para procesar de forma segura las complejidades del reglamento antes de que se envíen al servidor:

*   **`useTrucoLogic.ts`**: Gestiona el flujo dinámico del Envido/Truco y alternancia a Punta y Hacha.
*   **`useLobaLogic.ts`**: Controla el re-enganche de jugadores eliminados y penalizaciones por corte.
*   **`useMoscaLogic.ts`**: Valida bazas, calcula disminuciones de puntaje y el estado de "Jugador Sombrero".
*   **`useEscobaLogic.ts` y `useBarsigaLogic.ts`**: Gestionan la exclusividad de hitos (Oros, Cartas, Velos) y desgloses de cantos individuales para el equipo.

---

## ⚙️ Configuración y Variables de Entorno (.env)

Debes crear el archivo `.env` dentro de `apps/web/` con la siguiente clave:

```ini
VITE_API_URL=http://localhost:3000/api
```

*   `VITE_API_URL`: Dirección base donde el cliente consumirá los endpoints del backend (Axios se inicializa con este prefijo).

---

## 🚀 Comandos de Desarrollo y Construcción

Puedes interactuar con el cliente mediante `pnpm` desde la raíz o directamente dentro de `apps/web/`:

```bash
# Lanzar la aplicación web en modo de desarrollo local (Vite)
pnpm dev

# Compilar y generar el paquete estático optimizado para producción en dist/
pnpm build

# Previsualizar el bundle estático compilado en producción
pnpm --filter web preview

# Limpiar archivos compilados previos y directorios temporales
pnpm clean
```
