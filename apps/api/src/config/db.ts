import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI =
	process.env.MONGO_URI || 'mongodb://localhost:27017/el-porotero';

export const connectDB = async () => {
	try {
		if (!MONGO_URI) {
			throw new Error(
				'La variable MONGO_URI no está definida en el entorno.',
			);
		}
		const conn = await mongoose.connect(MONGO_URI);
		console.log(`MongoDB Conectado: ${conn.connection.host}`);
	} catch (error) {
		console.error('Error al conectar a MongoDB:', error);
		process.exit(1);
	}
};

// Monitoreo de eventos de la conexión
mongoose.connection.on('disconnected', () => {
	console.warn('MongoDB desconectado. Intentando reconectar...');
});

mongoose.connection.on('error', (err) => {
	console.error('Error crítico en la conexión:', err);
});
