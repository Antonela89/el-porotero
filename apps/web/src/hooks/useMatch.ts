import { useState, useEffect, useCallback } from 'react';
import api from '@/api/axios';
import axios from 'axios';
import { IMatch } from '@el-porotero/shared';

export const useMatch = (matchId: string | undefined) => {
	// Agrupar el estado para evitar múltiples renders y avisos de "cascading"
	const [state, setState] = useState<{
		data: IMatch | null;
		loading: boolean;
		error: string | null;
	}>({
		data: null,
		loading: true,
		error: null,
	});

	const [trigger, setTrigger] = useState(0);

	const refetch = useCallback(() => {
		setTrigger((prev) => prev + 1);
	}, []);

	useEffect(() => {
		// Usamos una variable para evitar race conditions (por si el ID cambia rápido)
		let isMounted = true;

		const fetchData = async () => {
			if (!matchId) return;

			// Seteamos loading solo si no es la carga inicial (opcional)
			if (trigger > 0) setState((prev) => ({ ...prev, loading: true }));

			try {
				const { data } = await api.get<IMatch>(`/matches/${matchId}`);
				if (isMounted) {
					setState({ data, loading: false, error: null });
				}
			} catch (err: unknown) {
				if (isMounted) {
					let msg = 'Error al cargar';
					if (axios.isAxiosError(err))
						msg = err.response?.data?.message || err.message;
					setState((prev) => ({
						...prev,
						loading: false,
						error: msg,
					}));
				}
			}
		};

		fetchData();

		return () => {
			isMounted = false;
		}; // Cleanup
	}, [matchId, trigger]); // Se dispara cuando cambia el ID o cuando tocamos el botón de refresh

	const setMatch = (newData: IMatch) => {
		setState((prev) => ({ ...prev, data: newData, loading: false }));
	};

	return {
		match: state.data,
		loading: state.loading,
		error: state.error,
		refetch,
		setMatch,
	};
};
