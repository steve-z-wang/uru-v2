import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class UserDto {
	@IsNumber()
	id: string;

	@IsEmail()
	email: string;

	@IsOptional()
	@IsString()
	firstName?: string | null;

	@IsOptional()
	@IsString()
	lastName?: string | null;

	@IsNumber()
	createdAt: number; // use unix timestamp

	@IsNumber()
	updatedAt: number; // use unix timestamp
}
