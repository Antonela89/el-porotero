/**
 * Genera iniciales únicas (1, 2 o 3 letras) para un nombre,
 * comparándolo con el resto de la mesa para evitar duplicados en el scoreboard.
 */
export const getShortName = (name: string, allNames: string[]): string => {
	if (!name) return '?';
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

/**
 * Formatea nombres largos para que no rompan la UI
 */
export const truncateName = (name: string, length: number = 10): string => {
	return name.length > length ? `${name.substring(0, length)}...` : name;
};
