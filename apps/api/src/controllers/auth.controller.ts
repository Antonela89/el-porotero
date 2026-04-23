import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.js';

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		// Buscar usuario
		const user = await UserModel.findOne({ email });
		if (!user) {
			return res.status(401).json({ message: 'Credenciales inválidas' });
		}

		// Comparar contraseña
		const isMatch = await user.comparePassword(password); // Asegúrate de tener este método en el User.ts
		if (!isMatch) {
			return res.status(401).json({ message: 'Credenciales inválidas' });
		}

		// Generar JWT
		const token = jwt.sign(
			{ userId: user._id, username: user.username },
			process.env.JWT_SECRET || 'secret',
			{ expiresIn: '24h' },
		);

		res.json({
			message: 'Login exitoso',
			token,
			user: { id: user._id, username: user.username },
		});
	} catch (error) {
		res.status(500).json({ message: 'Error en el login', error });
	}
};

export const register = async (req: Request, res: Response) => {
	console.log("Entró una petición de registro:", req.body);
	try {
		const { username, email, password } = req.body;

		// Verificar si ya existe
		const existingUser = await UserModel.findOne({
			$or: [{ email }, { username }],
		});
		if (existingUser) {
			return res
				.status(400)
				.json({ message: 'El usuario o email ya existen' });
		}

		const user = new UserModel({ username, email, password });
		await user.save();

		res.status(201).json({
			message: 'Usuario creado con éxito',
			userId: user._id,
		});
	} catch (error) {
		res.status(500).json({ message: 'Error en el servidor', error });
	}
};
