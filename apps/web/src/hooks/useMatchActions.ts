import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import { IMatch, IRoundScore } from '@el-porotero/shared';
import { notify, handleApiError } from '@/utils';

export const useMatchActions = (matchId: string) => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	// 1. Agregar/Editar Ronda
	const saveRound = useMutation({
		mutationFn: ({
			roundNumber,
			scores,
			isEdit,
		}: {
			roundNumber?: number;
			scores: IRoundScore[];
			isEdit: boolean;
		}) => {
			const url = isEdit
				? `/matches/${matchId}/round/${roundNumber}`
				: `/matches/${matchId}/round`;
			return api[isEdit ? 'patch' : 'post']<{ match: IMatch } | IMatch>(
				url,
				{ scores },
			).then((res) => res.data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['match', matchId] });
			notify.success('Ronda guardada');
		},
		onError: (err) => handleApiError(err, 'Error al guardar ronda'),
	});

	// Borrar Ronda
	const deleteRound = useMutation({
		mutationFn: (roundNumber: number) =>
			api.delete(`/matches/${matchId}/round/${roundNumber}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['match', matchId] });
			notify.success('Ronda eliminada');
		},
	});

	// Re-enganchar
	const reengage = useMutation({
		mutationFn: (playerName: string) =>
			api.patch(`/matches/${matchId}/reengage`, { playerName }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['match', matchId] });
			notify.info('Jugador re-enganchado');
		},
	});

	// Registrar Canto (Barsiga)
	const addCanto = useMutation({
		mutationFn: (payload: { playerName: string; points: number }) =>
			api.post(`/matches/${matchId}/round/canto`, payload),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ['match', matchId] }),
	});

	// Cancelar Juego
	const cancelMatch = useMutation({
		mutationFn: () =>
			api.put(`/matches/${matchId}`, { status: 'cancelled' }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['match', matchId] });
			notify.info('Partida cancelada');
			navigate('/'); // Opcional, dependiendo de si querés que salga de la página
		},
		onError: (err) => handleApiError(err, 'No se pudo cancelar la partida'),
	});

	return { saveRound, cancelMatch, deleteRound, reengage, addCanto };
};
