export function trim(str: string, max: number): string {
	return str.length > max ? `${str.slice(0, max - 3)}...` : str;
}
