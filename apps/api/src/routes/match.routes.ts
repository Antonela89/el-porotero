import { Router } from 'express';
import {
	createMatch,
	addRound,
	addCanto,
	updateRound,
	getUserMatches,
	getMatchById,
	deleteMatch,
	updateMatch,
	deleteRound,
	reengagePlayer
} from '@/controllers/index.js';
import { protect } from '@/middlewares/index.js';

const matchRouter: Router = Router();

matchRouter.use(protect); // Todas las rutas de acá abajo requieren Token

matchRouter.get('/', getUserMatches); // GET /api/matches
matchRouter.get('/:matchId', getMatchById); // GET /api/matches/:id
matchRouter.put('/:matchId', updateMatch); // PUT /api/matches/:id
matchRouter.post('/', createMatch); // POST /api/matches
matchRouter.patch('/:matchId/reengage', reengagePlayer);
matchRouter.post('/:matchId/round', addRound); // POST /api/matches/:id/round
matchRouter.post('/:matchId/round/canto', addCanto); // POST /api/matches/:id/round/canto
matchRouter.patch('/:matchId/round/:roundNumber', updateRound); //PATCH  /api/matches/:id/round/:id
matchRouter.delete('/:matchId/round/:roundNumber', deleteRound); // DELETE /api/matches/:id/round/:roundId
matchRouter.delete('/:matchId', deleteMatch); // DELETE /api/matches/:id

export default matchRouter;
