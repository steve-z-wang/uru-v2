import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthUserToken {
	userId: string;
	email: string;
}

export const AuthUserToken = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): AuthUserToken => {
		const request = ctx.switchToHttp().getRequest();
		const jwtPayload = request.user; // JWT payload with sub, email, etc.

		return {
			userId: jwtPayload.sub,
			email: jwtPayload.email,
		};
	},
);
