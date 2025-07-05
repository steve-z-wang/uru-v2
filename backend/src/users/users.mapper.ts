import { User as PrismaUser } from 'generated/prisma';
import { User } from './users.model';
import { UserDto } from './dto/output/user.dto';

export class UsersMapper {
	static toDomain(prismaUser: PrismaUser): User {
		return new User(prismaUser.id, prismaUser.email, prismaUser.firstName, prismaUser.lastName);
	}

	static toResponseDto(user: User): UserDto {
		return {
			id: user.id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
		};
	}
}
