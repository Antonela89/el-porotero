# El Porotero Online v2.0 🫘🏆

### Anotador Profesional de Cartas & PWA Standalone

**El Porotero** es una aplicación web integral de alta performance diseñada para la gestión y anotación de puntajes en juegos de cartas tradicionales. En su versión 2.0, el sistema ha sido reconstruido bajo una arquitectura **Local-First** y una filosofía de diseño **Touch-First / Mobile-First**, garantizando un funcionamiento fluido en entornos sin conectividad (como asados, sótanos o zonas rurales) sin perder la sincronización automática con la nube al recuperar señal.

---

## 🚀 Novedades de la Versión 2.0

### 📱 Experiencia de Usuario "Premium Mobile"
*   **Refactor de Layout**: Transición de tablas rígidas a un sistema de **Atomic Cards** dinámicas que priorizan la legibilidad en pantallas críticas desde **320px**.
*   **Operación a una Mano**: Menús de tipo **Bottom Sheet** y botones de acción flotantes (**FAB**) ubicados estratégicamente al alcance del pulgar.
*   **Visual Feedback**: Animaciones de **Card Flip 3D** para los ganadores, barras de progreso de juego en tiempo real y ráfagas de confeti con `canvas-confetti`.
*   **Safe Area Ready**: Soporte nativo para muescas (notches) en iOS/Android y adaptabilidad total mediante *Dynamic Viewport Height* (`h-dvh`).

### 🛠️ Infraestructura Senior
*   **Migración a pnpm**: Gestión de dependencias ultra veloz y segura mediante **pnpm workspaces**, optimizando la compilación y previniendo el *hoisting*.
*   **Arquitectura Local-First**: Sincronización asíncrona robusta con TanStack Query y persistencia local. Funciona offline y sincroniza con MongoDB Atlas automáticamente al reconectarse.
*   **PWA Standalone**: Instalable como aplicación nativa en dispositivos móviles con el icono personalizado del **Poroto Dorado 3D**.
*   **Style Engine Dinámico**: Sistema de temas inyectados dinámicamente mediante **Variables CSS heredadas del :root**, adaptando la estética visual al juego actual de manera limpia y modular.

---

## 🏗️ Arquitectura y Estructura del Monorepo

El proyecto está estructurado como un **Monorepo** gestionado con `pnpm workspaces`, asegurando coherencia absoluta en los tipos TypeScript y validación de negocio tanto en el cliente como en el servidor.

### Estructura de Directorios

- `apps/web`: Aplicación cliente SPA/PWA desarrollada en React.
- `apps/api`: Servidor RESTful desarrollado en Node.js/Express.
- `packages/shared`: Biblioteca centralizada de interfaces TypeScript, esquemas de validación Zod y lógica de reglas de juego compartidas.

### Componentes Críticos del Cliente
```text
apps/web/src/components/match/
├── board/                 # La "Mesa": Scoreboard, Cards y Progresos de juego.
├── forms/                 # El "Anotador": Lógica de carga, inputs y validadores.
├── modals/                # Acciones secundarias y configuración de mesa.
└── index.ts               # Barrel exports para limpieza de imports.
```

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 19**: Biblioteca principal de interfaz de usuario.
- **Vite 8**: Herramienta de compilación ultrarrápida.
- **TypeScript (NodeNext)**: Tipado estático estricto y seguro en todo el proyecto.
- **Tailwind CSS v4**: Framework de diseño centrado en utilidades semánticas.
- **TanStack Query (React Query)**: Gestión del estado del servidor, caché y sincronización local-first con persisters.
- **Framer Motion**: Animaciones fluidas de interfaz.
- **Radix UI**: Primitivas de diálogo y selección accesibles.
- **Sonner**: Sistema de notificaciones reactivas.

### Backend
- **Node.js**: Entorno de ejecución de JS.
- **Express**: Servidor HTTP para la API REST.
- **MongoDB & Mongoose**: Base de datos NoSQL y modelado de datos.
- **JWT (JSON Web Tokens)**: Autenticación segura sin estado.
- **Zod**: Validación de esquemas y DTOs en tiempo de ejecución.
- **Bcrypt**: Encriptación hash de contraseñas.

---

## 🃏 Juegos Soportados & Reglas Blindadas

El sistema valida automáticamente reglas complejas en tiempo real para prevenir errores de anotación humanos:

- **Loba / Chinchón**: Sistema acumulativo con límites configurables (100/101), cierres exclusivos, penalización automática por corte y lógica de re-enganche con penalización.
- **Truco**: Tanteo dinámico por equipos, gestión de etapas (Malas/Buenas), alternación automática a modo **Punta y Hacha** (duelos cruzados 1vs1) según los puntos o modo **Redonda**.
- **La Mosca**: Sistema descendente con regla del repartidor obligado, detección de "Sombrero" y victoria instantánea por bazas.
- **Burako**: Integración de puntos por fichas, canastas puras/impuras, batida y gestión de muerto por equipos.
- **Escoba de 15 / Bársiga**: Tanteo automático de mesa (Oros, Cartas, Setenta), velos de oro exclusivos y sistema de cantos individuales desglosados dentro del puntaje de equipo.

---

## 📱 Experiencia de Usuario Touch-First

- **Adaptive Interaction**: Los estados `hover` están deshabilitados mediante media queries de hardware (`@media (hover: hover)`) para evitar el molesto efecto de "botón pegado" en dispositivos táctiles.
- **Haptic Feedback Visual**: Estados `:active` con escala de 0.95x y transiciones rápidas (100ms) que simulan la respuesta táctil de una aplicación nativa.
- **Dynamic Viewport Height**: Garantía de visibilidad mediante `h-dvh` para que los botones interactivos nunca queden cubiertos por el teclado virtual o la barra del navegador.
- **Pureza de Diseño**: Interfaz optimizada para una resolución base de 360px (ej: iPhone SE), con iniciales calculadas dinámicamente (`getShortName`) para evitar el desbordamiento horizontal en mesas de hasta 6 integrantes.

---

## 🎨 Sistema de Diseño: *Bodegón Nocturno*

*   **Fondo Principal**: `#121826` (Azul medianoche profundo para evitar fatiga visual).
*   **Acento de Marca**: `#FACC15` (Amarillo Poroto elegante).
*   **Tipografía**: *Space Grotesk* para titulares estilizados y *Inter* para el cuerpo de texto legible.
*   **Semántica**: Verde Esmeralda para estados de victoria y Naranja Ámbar para alertas de eliminación.

---

## 🖼️ Galería de Interfaz

| Acceso Seguro | Historial de Partidas | Nuevo Juego | Anotador de Uno |
| :---: | :---: | :---: | :---: |
| <img src="./docs/screenshots/login.png" width="200" /> | <img src="./docs/screenshots/dashboard.png" width="200" /> | <img src="./docs/screenshots/new-match.png" width="200" /> | <img src="./docs/screenshots/match.png" width="200" /> |

---

## ⚙️ Instalación y Configuración

### Requisitos Previos
- **Node.js v20** o superior.
- **pnpm v9** o superior.
- **MongoDB** (Local o instancia MongoDB Atlas en la nube).

### Pasos de Instalación
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/Antonela89/el-porotero.git
   cd el-porotero
   ```
2. Instalar dependencias del monorepo mediante pnpm:
   ```bash
   pnpm install
   ```
3. Compilar la biblioteca de lógica compartida:
   ```bash
   pnpm --filter @el-porotero/shared build
   ```

### Variables de Entorno

Debes crear y configurar archivos `.env` en los directorios correspondientes basándote en los archivos de ejemplo provistos:

**Backend (`apps/api/.env`):**
*   `PORT`: Puerto de ejecución (Default: 3000).
*   `MONGO_URI`: URI de conexión a tu base de datos de MongoDB.
*   `JWT_SECRET`: Semilla secreta para la firma y autenticación de tokens JWT.

**Frontend (`apps/web/.env`):**
*   `VITE_API_URL`: URL base donde corre tu API (ej: `http://localhost:3000/api` o URL de producción).

---

## 💻 Scripts de Desarrollo (pnpm)

Todos los scripts deben ser ejecutados desde la raíz del monorepo:

-   `pnpm dev`: Inicia el backend (`api`) y el frontend (`web`) simultáneamente en modo desarrollo con logs en paralelo de colores.
-   `pnpm -r build`: Compila el paquete compartido (`shared`), la API y la aplicación web en el orden correcto de dependencias.
-   `pnpm clean`: Limpieza profunda y remoción de directorios `node_modules`, `dist` y caches de Vite.
-   `pnpm --filter web preview`: Previsualiza la aplicación web compilada en producción localmente.

---

## 🔒 Seguridad

- **CORS Estricto**: Control de acceso granular para dominios permitidos.
- **Verificación de JWT**: Middleware de seguridad en rutas privadas.
- **Validación con Zod**: Filtrado y tipado de payloads entrantes para mitigar inyecciones de datos corruptos.
- **Rate Limiting**: Limitador de solicitudes en endpoints de autenticación para mitigar ataques de fuerza bruta.

---

## 🧪 Pruebas y QA (Postman)

El monorepo cuenta con una colección completa de Postman para probar el comportamiento de los endpoints e integrar QA.

### Instrucciones de Uso:
1. Navega a `docs/postman/`.
2. Importa el archivo `el-porotero.postman_collection.json` en Postman.
3. Importa el entorno `local-env.json` y activa la variable `base_url`.
4. **Flujo Automatizado**: Ejecuta la petición `01. Auth / Login`. El script de Postman extraerá y guardará el token JWT automáticamente en las variables del entorno, permitiendo interactuar con el resto de endpoints protegidos sin configuraciones manuales adicionales.

[Ejecutar en Postman](https://martian-eclipse-514495.postman.co/workspace/Team-Workspace~f2d65b89-0cb6-4194-8df8-5f8f94fde9ff/collection/27770697-40942fec-8cd9-466c-b149-905baa6270d0?action=share&source=copy-link&creator=27770697) | [Documentación On-Line](https://martian-eclipse-514495.docs.buildwithfern.com/el-porotero/auth/login)

---

© 2026 El Porotero - Desarrollado por **Antonela Borgogno**.
*Documentación actualizada en Mayo de 2026.*
