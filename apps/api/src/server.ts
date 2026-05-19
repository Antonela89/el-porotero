import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRouter from './routes/auth.routes.js';
import matchRouter from './routes/match.routes.js';
import statsRouter from './routes/stats.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(
	cors({
		origin: (origin, callback) => {
			if (
				!origin ||
				origin.endsWith('.vercel.app') ||
				origin.includes('localhost')
			) {
				callback(null, true);
			} else {
				callback(new Error('No permitido por CORS'));
			}
		},
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	}),
);
app.use(express.json());

// Conexión a la DB
connectDB();

// Endpoint para mantener vivo el server (Heartbeat)
app.get('/api/ping', (req, res) => {
	res.status(200).send('pong');
});

// Ruta de prueba
app.get('/', (req, res) => {
	res.send('API de El Porotero Online');
});

// Rutas
app.use('/api/auth', authRouter);
app.use('/api/matches', matchRouter);
app.use('/api/stats', statsRouter);

app.listen(PORT, () => {
	console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
