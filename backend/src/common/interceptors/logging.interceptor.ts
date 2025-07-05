import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	private readonly logger = new Logger('HTTP');

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const ctx = context.switchToHttp();
		const request = ctx.getRequest<Request>();
		const method = request.method;
		const url = request.url;
		const body = request.body as Record<string, any>;
		const params = request.params as Record<string, string>;
		const user = request.user as { sub?: string } | undefined;
		const now = Date.now();

		// Log the incoming request
		const userId = user?.sub || 'anonymous';
		this.logger.log(`[${userId}] ${method} ${url} - Request started`);

		return next.handle().pipe(
			tap(() => {
				const responseTime = Date.now() - now;
				this.logger.log(`[${userId}] ${method} ${url} - Success (${responseTime}ms)`);
			}),
			catchError((error) => {
				const responseTime = Date.now() - now;
				const errorMessage = error instanceof Error ? error.message : String(error);
				const errorStack = error instanceof Error ? error.stack : undefined;

				// Log error with context
				let contextMessage = `[${userId}] ${method} ${url}`;

				// Add specific context based on the endpoint
				if (params.id) {
					contextMessage += ` - ID: ${params.id}`;
				}
				if (body && 'email' in body && typeof body.email === 'string') {
					contextMessage += ` - Email: ${body.email}`;
				}

				this.logger.error(
					`${contextMessage} - Failed (${responseTime}ms): ${errorMessage}`,
					errorStack,
				);

				return throwError(() => error as Error);
			}),
		);
	}
}
