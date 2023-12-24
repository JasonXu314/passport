import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { User as UserT } from 'src/users/models';

export function fi<T>(): T {
	return undefined as T;
}

export function generateAvatar(name: string): string {
	const names = name.split(' ');
	const color = new Array(3)
		.fill(null)
		.map(() => Math.floor(Math.random() * 255).toString(16))
		.join('');

	return `https://ui-avatars.com/api?name=${encodeURIComponent(name)}&length=${Math.min(names.length, 3)}&background=${color}`;
}

export const ReqUser = createParamDecorator<never, ExecutionContext, UserT | null>((_, ctx) => {
	const req = ctx.switchToHttp().getRequest<Request>();

	return req.user;
});

export const ReqToken = createParamDecorator<never, ExecutionContext, string | null>((_, ctx) => {
	const req = ctx.switchToHttp().getRequest<Request>();

	return req.token;
});

