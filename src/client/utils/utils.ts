export function toTitleCase(str: string): string {
	return (
		str
			.split(/[_\s]+/)
			.map((fragment) => (fragment === '' ? fragment : fragment[0].toUpperCase() + fragment.slice(1).toLowerCase()))
			.join(' ') || '/'
	);
}

