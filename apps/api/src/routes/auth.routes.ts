import { Router } from 'express';
import { register, login } from '@/controllers/index.js';
import { validateResource,  hashPassword } from '@/middlewares/index.js';
import { UserZodSchema, LoginZodSchema } from '@el-porotero/shared';

const authRouter: Router = Router();

authRouter.post('/register', validateResource(UserZodSchema), hashPassword, register);
authRouter.post('/login', validateResource(LoginZodSchema), login);

export default authRouter;
