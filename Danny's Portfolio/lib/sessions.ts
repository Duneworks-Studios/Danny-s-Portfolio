// Shared session storage for admin authentication
export const sessions = new Map<string, { email: string; expires: number }>();
