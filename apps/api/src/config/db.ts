import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI =
	process.env.MONGODB_URI || 'mongodb://localhost:27017/el-porotero';

export const connectDB = async () => {
	try {
		const conn = await mongoose.connect(MONGODB_URI);
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
