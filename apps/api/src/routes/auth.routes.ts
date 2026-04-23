import { Router } from 'express';
import { register } from '@/controllers/index.js';
import { validateResource,  hashPassword } from '@/middlewares/index.js';
import { UserZodSchema } from '@el-porotero/shared';

const authRouter = Router();

authRouter.post('/register', validateResource(UserZodSchema), hashPassword, register);

export default authRouter;
