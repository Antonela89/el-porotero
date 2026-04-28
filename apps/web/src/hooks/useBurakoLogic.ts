// apps/web/src/hooks/useBurakoLogic.ts
export const useBurakoLogic = () => {
	const calculatePoints = (
		basePoints: number,
		puras: number,
		impuras: number,
		batida: boolean,
		muerto: boolean | 'no_tomado',
	) => {
		let total = basePoints;
		total += puras * 200;
		total += impuras * 100;
		if (batida) total += 100;

		// Regla del Muerto: Si no lo tomó, resta 100. Si lo tomó y no lo usó, suele restar también.
		if (muerto === 'no_tomado') total -= 100;

		return total;
	};

	return { calculatePoints };
};
