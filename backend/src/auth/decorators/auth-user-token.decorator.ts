import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthUserToken {
	userId: string;
	email: string;
}

interface JwtPayload {
	sub: string;
	email: string;
}

interface RequestWithUser {
	user: JwtPayload;
}

export const AuthUserToken = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): AuthUserToken => {
		const request = ctx.switchToHttp().getRequest<RequestWithUser>();
		const jwtPayload = request.user;

		return {
			userId: jwtPayload.sub,
			email: jwtPayload.email,
		};
	},
);
