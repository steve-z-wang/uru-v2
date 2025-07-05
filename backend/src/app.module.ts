import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ListingsModule } from './listings/listings.module';
import { FilesModule } from './files/files.module';
import { AppConfigModule } from './config/config.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import environmentConfig from './config/environment.config';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [environmentConfig],
			envFilePath: '.env',
		}),
		AppConfigModule,
		PrismaModule,
		UsersModule,
		AuthModule,
		ListingsModule,
		FilesModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_INTERCEPTOR,
			useClass: LoggingInterceptor,
		},
	],
})
export class AppModule {}
