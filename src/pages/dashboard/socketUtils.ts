export const shouldReconnectOnClose = (code?: number): boolean => {
	if (code === undefined) {
		return true;
	}

	return ![1000, 1001, 1005].includes(code);
};

export const getReconnectDelay = (attempt: number): number => {
	const baseDelayMs = 1000;
	return Math.min(baseDelayMs * 2 ** attempt, 10000);
};
