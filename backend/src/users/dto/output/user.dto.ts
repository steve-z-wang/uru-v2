import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class UserDto {
	id: string;
	email: string;
	firstName?: string | null;
	lastName?: string | null;
}
