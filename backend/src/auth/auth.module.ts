import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AppConfigService } from '../config/config.service';
import { AppConfigModule } from '../config/config.module';

@Module({
	imports: [
		PrismaModule,
		UsersModule,
		PassportModule,
		AppConfigModule,
		JwtModule.registerAsync({
			imports: [AppConfigModule],
			useFactory: (appConfig: AppConfigService) => {
				return {
					secret: appConfig.jwtSecret,
					signOptions: { expiresIn: appConfig.jwtExpiresIn },
				};
			},
			inject: [AppConfigService],
		}),
	],
	providers: [AuthService, JwtStrategy],
	controllers: [AuthController],
	exports: [AuthService],
})
export class AuthModule {}
