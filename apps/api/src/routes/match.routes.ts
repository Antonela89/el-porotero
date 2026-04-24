import { Router } from 'express';
import {
	createMatch,
	addRound,
    updateRound,
	getUserMatches,
	getMatchById,
	deleteMatch,
    updateMatchStatus,
} from '@/controllers/index.js';
import { protect } from '@/middlewares/index.js';

const matchRouter = Router();

matchRouter.use(protect); // Todas las rutas de acá abajo requieren Token

matchRouter.get('/', getUserMatches); // GET /api/matches
matchRouter.get('/:matchId', getMatchById); // GET /api/matches/:id
matchRouter.put('/:matchId',  updateMatchStatus)
matchRouter.post('/', createMatch); // POST /api/matches
matchRouter.post('/:matchId/round', addRound); // POST /api/matches/:id/round
matchRouter.patch('/:matchId/rounds/:roundNumber', updateRound); //PATCH  /api/matches/:id/round/:id
matchRouter.delete('/:matchId', deleteMatch); // DELETE /api/matches/:id

export default matchRouter;
