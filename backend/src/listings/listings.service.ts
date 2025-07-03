import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Listing } from './listings.model';
import { ListingsMapper } from './listings.mapper';
import { CreateListingData, UpdateListingData } from './listings.service.interface';

@Injectable()
export class ListingsService {
	constructor(private prismaService: PrismaService) {}

	/*********
	 * Query *
	 *********/

	async findListingById(userId: string, id: string): Promise<Listing | null> {
		const existingListing = await this.prismaService.canonicalListing.findUnique({
			where: {
				id: id,
				userId: userId,
			},
		});

		return existingListing ? ListingsMapper.toDomain(existingListing) : null;
	}

	async getListingById(userId: string, id: string): Promise<Listing> {
		const existingListing = await this.findListingById(userId, id);
		if (!existingListing) {
			this.throwNotFoundException();
		}
		return existingListing;
	}

	async getUserListings(userId: string, page: number, limit: number): Promise<Listing[]> {
		const skip = (page - 1) * limit;
		const listings = await this.prismaService.canonicalListing.findMany({
			where: { userId },
			orderBy: { createdAt: 'desc' },
			skip: skip,
			take: limit,
		});
		return listings.map(ListingsMapper.toDomain);
	}

	/************
	 * Mutation *
	 ************/

	async createListing(userId: string, data: CreateListingData): Promise<Listing> {
		const listing = await this.prismaService.canonicalListing.create({
			data: {
				userId: userId,
				...data,
			},
		});

		return ListingsMapper.toDomain(listing);
	}

	async updateListing(userId: string, id: string, data: UpdateListingData): Promise<Listing> {
		// Filter out undefined values for partial updates
		const updateData = Object.fromEntries(
			Object.entries(data).filter(([_, value]) => value !== undefined)
		);

		try {
			const listing = await this.prismaService.canonicalListing.update({
				where: {
					id: id,
					userId: userId, // This ensures ownership check
				},
				data: updateData,
			});
			return ListingsMapper.toDomain(listing);
		} catch (error) {
			if (error.code === 'P2025') {
				this.throwNotFoundException();
			}
			throw error;
		}
	}

	/***********
	 * Helpers *
	 ***********/

	private throwNotFoundException(): never {
		throw new NotFoundException('Listing not found');
	}
}
