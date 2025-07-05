import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UserInputDto {
	@IsOptional()
	@IsEmail()
	@ApiPropertyOptional({ example: 'user@example.com' })
	email?: string;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({ example: 'John' })
	firstName?: string;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({ example: 'Doe' })
	lastName?: string;
}
