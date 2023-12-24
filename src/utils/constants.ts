import { CookieOptions } from 'express';

export const AUTH_COOKIE_OPTIONS: CookieOptions = {
	httpOnly: true,
	sameSite: 'strict',
	maxAge: 6 * 31 * 24 * 3600 * 1000
};

