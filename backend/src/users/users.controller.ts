import {
	Controller,
	Get,
	Body,
	Patch,
	Delete,
	UseGuards,
	Logger,
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
	private readonly logger = new Logger(UsersController.name);

	constructor(private readonly usersService: UsersService) {}

	@UseGuards(JwtAuthGuard)
	@Get('me')
	@HttpCode(HttpStatus.OK)
	async getProfile(@AuthUserToken() authUserToken: AuthUserToken): Promise<UserDto> {
		this.logger.log(`User ${authUserToken.userId} is fetching their profile`);
		try {
			const user = await this.usersService.findUserById(authUserToken.userId);
			this.logger.log(`Successfully retrieved profile for user ${authUserToken.userId}`);

			return UsersMapper.toResponseDto(user);
		} catch (error: Error) {
			this.logger.error(`Failed to retrieve profile for user ${authUserToken.userId}`, error.stack);
			throw error;
		}
	}

	@UseGuards(JwtAuthGuard)
	@Patch('me')
	@HttpCode(HttpStatus.OK)
	async update(
		@AuthUserToken() authUserToken: AuthUserToken,
		@Body() updateUserDto: UpdateUserDto,
	): Promise<UserDto> {
		this.logger.log(`User ${authUserToken.userId} is updating their profile`);
		try {
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
			this.logger.log(`Successfully updated profile for user ${authUserToken.userId}`);
			return UsersMapper.toResponseDto(updatedUser);
		} catch (error: Error) {
			this.logger.error(`Failed to update profile for user ${authUserToken.userId}`, error.stack);
			throw error;
		}
	}

	@UseGuards(JwtAuthGuard)
	@Delete('me')
	@HttpCode(HttpStatus.NO_CONTENT)
	async remove(@AuthUserToken() authUserToken: AuthUserToken): Promise<void> {
		this.logger.log(`User ${authUserToken.userId} is deleting their account`);
		try {
			await this.usersService.deleteUserById(authUserToken.userId);
			this.logger.log(`Successfully deleted account for user ${authUserToken.userId}`);
		} catch (error: Error) {
			this.logger.error(`Failed to delete account for user ${authUserToken.userId}`, error.stack);
			throw error;
		}
	}
}
