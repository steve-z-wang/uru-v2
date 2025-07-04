import { registerAs } from '@nestjs/config';

export enum Stage {
	DEV = 'DEV',
	STAGING = 'STAGING',
	PROD = 'PROD',
}

export interface EnvironmentConfig {
	stage: Stage;
	port: number;
	jwtSecret: string;
	jwtExpiresIn: string;
	databaseUrl: string;
	openaiApiKey?: string;
	s3BucketName?: string;
	s3Region?: string;
}

export default registerAs('environment', (): EnvironmentConfig => {
	// Validate required environment variables
	const requiredVars = {
		STAGE: process.env.STAGE,
		JWT_SECRET: process.env.JWT_SECRET,
		DATABASE_URL: process.env.DATABASE_URL,
	};

	for (const [key, value] of Object.entries(requiredVars)) {
		if (!value) {
			throw new Error(`Missing required environment variable: ${key}`);
		}
	}

	// Validate STAGE value
	const stage = process.env.STAGE as Stage;
	if (!Object.values(Stage).includes(stage)) {
		throw new Error(`Invalid STAGE value: ${stage}. Must be one of: ${Object.values(Stage).join(', ')}`);
	}

	return {
		stage,
		port: parseInt(process.env.PORT || '3001', 10),
		jwtSecret: process.env.JWT_SECRET!,
		jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
		databaseUrl: process.env.DATABASE_URL!,
		openaiApiKey: process.env.OPENAI_API_KEY,
		s3BucketName: process.env.S3_BUCKET_NAME,
		s3Region: process.env.S3_REGION,
	};
});