import { createParamDecorator, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';

export interface AuthUserToken {
	userId: string;
	email: string;
}

export const AuthUserToken = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): AuthUserToken => {
		const request = ctx.switchToHttp().getRequest();
		const jwtPayload = request.user;

		return {
			userId: jwtPayload.sub,
			email: jwtPayload.email,
		};
	},
);
