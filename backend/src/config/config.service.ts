import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { EnvironmentConfig, Stage } from './environment.config';

@Injectable()
export class AppConfigService {
	private readonly config: EnvironmentConfig;

	constructor(private configService: NestConfigService) {
		const config = this.configService.get<EnvironmentConfig>('environment');
		if (!config) {
			throw new Error('Environment configuration not found');
		}
		this.config = config;
	}

	get stage(): Stage {
		return this.config.stage;
	}

	get port(): number {
		return this.config.port;
	}

	get jwtSecret(): string {
		return this.config.jwtSecret;
	}

	get jwtExpiresIn(): string {
		return this.config.jwtExpiresIn;
	}

	get databaseUrl(): string {
		return this.config.databaseUrl;
	}

	get isDevelopment(): boolean {
		return this.config.stage === Stage.DEV;
	}

	get isProduction(): boolean {
		return this.config.stage === Stage.PROD;
	}

	get isStaging(): boolean {
		return this.config.stage === Stage.STAGING;
	}

	// Get the full config if needed
	getConfig(): EnvironmentConfig {
		return this.config;
	}
}