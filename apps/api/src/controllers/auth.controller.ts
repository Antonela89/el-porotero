import { Request, Response } from 'express';
import { UserModel } from '../models/User.js';

export const register = async (req: Request, res: Response) => {
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
