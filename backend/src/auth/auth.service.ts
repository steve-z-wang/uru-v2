import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
	constructor(
		private prismaService: PrismaService,
		private jwtService: JwtService,
		private usersService: UsersService,
	) {}

	async register(email: string, password: string): Promise<string> {
		const existingUser = await this.prismaService.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			throw new ConflictException('Email already exists');
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await this.usersService.createUser({ email });
		
		await this.prismaService.passwordAuth.create({
			data: {
				userId: user.id,
				passwordHash: hashedPassword,
			},
		});

		return this.generateAuthToken(user.id, user.email);
	}

	async login(email: string, password: string): Promise<string> {
		const user = await this.prismaService.user.findUnique({
			where: { email },
			include: { passwordAuth: true },
		});

		if (!user || !user.passwordAuth) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const isPasswordValid = await bcrypt.compare(password, user.passwordAuth.passwordHash);

		if (!isPasswordValid) {
			throw new UnauthorizedException('Invalid credentials');
		}

		return this.generateAuthToken(user.id, user.email);
	}

	/*******************
	 * Private Methods *
	 *******************/

	private generateAuthToken(userId: string, email: string): string {
		const payload = { sub: userId, email: email };
		return this.jwtService.sign(payload);
	}
}
