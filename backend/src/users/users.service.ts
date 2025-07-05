import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './users.model';
import { UsersMapper } from './users.mapper';

@Injectable()
export class UsersService {
	constructor(private prismaService: PrismaService) {}

	/*********
	 * Query *
	 *********/

	async findUserById(id: string): Promise<User> {
		const user = await this.prismaService.user.findUnique({
			where: { id },
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return UsersMapper.toDomain(user);
	}

	/************
	 * Mutation *
	 ************/

	async createUser(userData: {
		email: string;
		firstName?: string | null;
		lastName?: string | null;
	}): Promise<User> {
		const user = await this.prismaService.user.create({
			data: userData,
		});

		return UsersMapper.toDomain(user);
	}

	async updateUser(user: User): Promise<User> {
		try {
			const updatedUser = await this.prismaService.user.update({
				where: { id: user.id },
				data: {
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
				},
			});

			return UsersMapper.toDomain(updatedUser);
		} catch (error: any) {
			if (error.code === 'P2025') {
				throw new NotFoundException('User not found');
			}
			throw error;
		}
	}

	async deleteUserById(id: string): Promise<void> {
		try {
			await this.prismaService.user.delete({
				where: { id },
			});
		} catch (error: any) {
			if (error.code === 'P2025') {
				throw new NotFoundException('User not found');
			}
			throw error;
		}
	}
}
