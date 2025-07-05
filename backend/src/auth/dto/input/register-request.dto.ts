import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterRequestDto {
	@ApiProperty({ example: 'user@example.com' })
	@IsEmail()
	email: string;

	@ApiProperty({ example: 'password123', minLength: 6 })
	@IsString()
	@MinLength(6)
	password: string;
}
