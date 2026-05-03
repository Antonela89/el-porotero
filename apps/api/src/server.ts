import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRouter from './routes/auth.routes.js';
import matchRouter from './routes/match.routes.js';
import statsRouter from './routes/stats.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a la DB
connectDB();

// Ruta de prueba
app.get('/', (req, res) => {
	res.send('API de El Porotero Online');
});

// Rutas
app.use('/api/auth', authRouter);
app.use('/api/matches', matchRouter);
app.use('/api/stats', statsRouter)

app.listen(PORT, () => {
	console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
