import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';

export const hashPassword = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (req.body.password) {
			const salt = await bcrypt.genSalt(10);
			req.body.password = await bcrypt.hash(req.body.password, salt);
		}
		next();
	} catch (error) {
		res.status(500).json({ message: 'Error al procesar la contraseña' });
	}
};
