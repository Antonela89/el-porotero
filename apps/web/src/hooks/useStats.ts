import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';
import { IUserStats } from '@el-porotero/shared';

export const useStats = () => {
	return useQuery({
		queryKey: ['user-stats'],
		queryFn: () => api.get<IUserStats>('/stats').then((res) => res.data),
		staleTime: 1000 * 60 * 2, 
	});
};
