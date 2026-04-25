export const getShortName = (name: string, allNames: string[]): string => {
	const others = allNames.filter((n) => n !== name);

	// Probar con la primera letra
	let short = name.substring(0, 1).toUpperCase();
	if (!others.some((n) => n.startsWith(short))) return short;

	// Probar con las primeras dos
	short = name.substring(0, 2).toUpperCase();
	if (!others.some((n) => n.startsWith(short))) return short;

	// Si sigue habiendo conflicto, usar tres
	return name.substring(0, 3).toUpperCase();
};
