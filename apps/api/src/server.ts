import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';

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

app.listen(PORT, () => {
	console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
