import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';
import { IMatch } from '@el-porotero/shared';
import { notify } from '@/utils';

export const useMatches = () => {
	const queryClient = useQueryClient();

	// Obtener partidas (reemplaza fetchMatches y useEffect)
	const { data: matches = [], isLoading: loading } = useQuery({
		queryKey: ['matches'],
		queryFn: async () => {
			const { data } = await api.get<IMatch[]>('/matches');
			return data;
		},
	});

	// Mutación para borrar
	const deleteMutation = useMutation({
		mutationFn: (id: string) => api.delete(`/matches/${id}`),
		onSuccess: () => {
			// Invalida la cache para que se dispare un refetch automático
			queryClient.invalidateQueries({ queryKey: ['matches'] });
			notify.success('Partida borrada correctamente');
		},
	});

	// Mutación para actualizar 
	const updateMatchInState = (updatedMatch: IMatch) => {
		queryClient.setQueryData(['matches'], (old: IMatch[] | undefined) => {
			return old
				? old.map((m) =>
						m._id === updatedMatch._id ? updatedMatch : m,
					)
				: [];
		});
	};

	return {
		matches,
		loading,
		deleteMatch: deleteMutation.mutate,
		updateMatchInState,
	};
};
