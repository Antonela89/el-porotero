import { Request, Response, NextFunction } from 'express';
import { ZodObject } from 'zod';

export const validateResource =
	(schema: ZodObject) =>
	(req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse(req.body);
			next();
		} catch (e: any) {
			return res.status(400).send(e.errors);
		}
	};
