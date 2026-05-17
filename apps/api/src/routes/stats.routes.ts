import { Router } from 'express';
import { getGlobalStats } from '@/controllers/stats.controller.js';
import { protect } from '@/middlewares/index.js';

const statsRouter: Router = Router();
statsRouter.get('/', protect, getGlobalStats);

export default statsRouter;
