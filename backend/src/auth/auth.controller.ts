import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDto } from './dto/input/register-request.dto';
import { AuthResponseDto } from './dto/output/auth-response.dto';
import { LoginRequestDto } from './dto/input/login-request.dto';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('register')
	async register(@Body() request: RegisterRequestDto): Promise<AuthResponseDto> {
		const accessToken = await this.authService.register(request.email, request.password);
		return {
			accessToken,
		} as AuthResponseDto;
	}

	@Post('login')
	async login(@Body() request: LoginRequestDto): Promise<AuthResponseDto> {
		const accessToken = await this.authService.login(request.email, request.password);
		return {
			accessToken,
		} as AuthResponseDto;
	}
}
