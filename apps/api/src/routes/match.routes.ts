import { Router } from 'express';
import { createMatch, addRound } from '@/controllers/match.controller.js';
import { protect } from '@/middlewares/index.js';

const matchRouter = Router();

matchRouter.use(protect); // Todas las rutas de acá abajo requieren Token

matchRouter.post('/', createMatch);
matchRouter.post('/:matchId/round', addRound);

export default matchRouter;