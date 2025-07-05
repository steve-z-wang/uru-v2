import {
	Controller,
	Get,
	Body,
	Patch,
	Delete,
	UseGuards,
	HttpCode,
	HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/input/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUserToken } from '../auth/decorators/auth-user-token.decorator';
import { UserDto } from './dto/output/user.dto';
import { UsersMapper } from './users.mapper';
import { User } from './users.model';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@UseGuards(JwtAuthGuard)
	@Get('me')
	@HttpCode(HttpStatus.OK)
	async getProfile(@AuthUserToken() authUserToken: AuthUserToken): Promise<UserDto> {
		const user = await this.usersService.findUserById(authUserToken.userId);
		return UsersMapper.toResponseDto(user);
	}

	@UseGuards(JwtAuthGuard)
	@Patch('me')
	@HttpCode(HttpStatus.OK)
	async update(
		@AuthUserToken() authUserToken: AuthUserToken,
		@Body() updateUserDto: UpdateUserDto,
	): Promise<UserDto> {
		// Get current user and create updated version
		const currentUser = await this.usersService.findUserById(authUserToken.userId);
		const updatedUser = await this.usersService.updateUser(
			new User(
				currentUser.id,
				updateUserDto.email ?? currentUser.email,
				updateUserDto.firstName ?? currentUser.firstName,
				updateUserDto.lastName ?? currentUser.lastName,
			),
		);
		return UsersMapper.toResponseDto(updatedUser);
	}

	@UseGuards(JwtAuthGuard)
	@Delete('me')
	@HttpCode(HttpStatus.NO_CONTENT)
	async remove(@AuthUserToken() authUserToken: AuthUserToken): Promise<void> {
		await this.usersService.deleteUserById(authUserToken.userId);
	}
}
