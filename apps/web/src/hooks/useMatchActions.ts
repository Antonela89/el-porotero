import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import { IMatch, IRoundScore, IPlayer } from '@el-porotero/shared';
import { notify, handleApiError } from '@/utils';

export const useMatchActions = (matchId: string) => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	// Agregar/Editar Ronda
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
			const method = isEdit ? 'patch' : 'post';
			const url = `/matches/${matchId}/round${isEdit ? `/${roundNumber}` : ''}`;

			return api[method]<IMatch>(url, { scores }).then((res) => res.data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['match', matchId] });
			notify.success('Ronda guardada');
		},
		onError: (err) => handleApiError(err, 'Error al guardar ronda'),
	});

	// Editar Juego
	const updateMatch = useMutation({
		mutationFn: (payload: {
			players: IPlayer[];
			status: IMatch['status'];
		}) =>
			api
				.put<IMatch>(`/matches/${matchId}`, payload)
				.then((res) => res.data),
		onSuccess: (data) => {
			queryClient.setQueryData(['match', matchId], data);
			queryClient.invalidateQueries({ queryKey: ['matches'] });
			notify.success('Partida actualizada');
		},
		onError: (err) =>
			handleApiError(err, 'No se pudo actualizar la partida'),
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

	return {
		saveRound,
		updateMatch,
		cancelMatch,
		deleteRound,
		reengage,
		addCanto,
	};
};
