import { useMutation } from '@tanstack/react-query';
import api from '@/api/axios';
import { useNavigate } from 'react-router-dom';
import { handleApiError, notify } from '@/utils';
import { IMatch } from '@el-porotero/shared';

type CreateMatchPayload = Pick<
	IMatch,
	'gameType' | 'players' | 'isTeamGame'
> & {
	limitScore: number;
};

export const useCreateMatch = () => {
	const navigate = useNavigate();
	return useMutation({
		mutationFn: (matchData: CreateMatchPayload) =>
			api.post('/matches', matchData).then((res) => res.data),
		onSuccess: (data) => {
			notify.success('¡Mesa lista!');
			navigate(`/match/${data._id}`);
		},
		onError: (err) => handleApiError(err, 'Error al crear mesa'),
	});
};
