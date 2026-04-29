import { Router } from 'express';
import {
	createMatch,
	addRound,
	updateRound,
	getUserMatches,
	getMatchById,
	deleteMatch,
	updateMatch,
	deleteRound,
} from '@/controllers/index.js';
import { protect } from '@/middlewares/index.js';

const matchRouter = Router();

matchRouter.use(protect); // Todas las rutas de acá abajo requieren Token

matchRouter.get('/', getUserMatches); // GET /api/matches
matchRouter.get('/:matchId', getMatchById); // GET /api/matches/:id
matchRouter.put('/:matchId', updateMatch); // PUT /api/matches/:id
matchRouter.post('/', createMatch); // POST /api/matches
matchRouter.post('/:matchId/round', addRound); // POST /api/matches/:id/round
matchRouter.patch('/:matchId/round/:roundNumber', updateRound); //PATCH  /api/matches/:id/round/:id
matchRouter.delete('/:matchId/round/:roundNumber', deleteRound); // DELETE /api/matches/:id/round/:roundId
matchRouter.delete('/:matchId', deleteMatch); // DELETE /api/matches/:id

export default matchRouter;
