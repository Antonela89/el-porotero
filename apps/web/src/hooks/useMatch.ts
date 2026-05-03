import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';
import { IMatch } from '@el-porotero/shared';

export const useMatch = (matchId: string | undefined) => {
	const queryClient = useQueryClient();

	const { data: match, isLoading: loading } = useQuery({
		queryKey: ['match', matchId],
		queryFn: () =>
			api.get<IMatch>(`/matches/${matchId}`).then((res) => res.data),
		enabled: !!matchId, // Solo se ejecuta si hay ID
	});

	const setMatch = (newData: IMatch) => {
		queryClient.setQueryData(['match', matchId], newData);
		queryClient.invalidateQueries({ queryKey: ['matches'] });
	};

	return {
		match,
		loading,
		setMatch,
		refetch: () =>
			queryClient.invalidateQueries({ queryKey: ['match', matchId] }),
	};
};
