import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppConfigService } from './config/config.service';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const appConfig = app.get(AppConfigService);
	const logger = new Logger('Bootstrap');

	const port = appConfig.port;

	await app.listen(port);

	logger.log(`Application is running on: http://localhost:${port}`);
	logger.log(`Environment: ${appConfig.stage}`);

	if (appConfig.isDevelopment) {
		logger.log('Running in development mode');
	}
}
void bootstrap();
