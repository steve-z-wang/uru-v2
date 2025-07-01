import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDto } from './dto/register-request.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginRequestDto } from './dto/login-request.dto';

@Controller('auth')
export class AuthController {
	private readonly logger = new Logger(AuthController.name);

	constructor(private authService: AuthService) {}

	@Post('register')
	async register(@Body() request: RegisterRequestDto): Promise<AuthResponseDto> {
		this.logger.log(`Registration attempt for email: ${request.email}`);

		try {
			const accessToken = await this.authService.register(request.email, request.password);
			return {
				accessToken,
			} as AuthResponseDto; 
		} catch (error) {
			this.logger.error(`Registration failed for email: ${request.email}`, error.stack);
			throw error;
		}
	}

	@Post('login')
	async login(@Body() request: LoginRequestDto): Promise<AuthResponseDto> {
		this.logger.log(`Login attempt for account: ${request.email}`); 

		try {
			const accessToken = await this.authService.login(request.email, request.password); 
			return {
				accessToken
			} as AuthResponseDto; 
		} catch (error) {
			this.logger.error(`Login failed for email: ${request.email}`, error.stack); 
			throw error
		}
	}
}
