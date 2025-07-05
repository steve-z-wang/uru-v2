import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Listing } from '../domain/listings.model';
import { ListingRepository } from '../application/ports/listing.repository';
import { ListingsMapper } from '../listings.mapper';

@Injectable()
export class ListingRepositoryImpl implements ListingRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findById(id: string): Promise<Listing | null> {
		const data = await this.prisma.canonicalListing.findUnique({
			where: { id },
		});

		return data ? ListingsMapper.toDomain(data) : null;
	}

	async findByUserId(userId: string, page: number, limit: number): Promise<Listing[]> {
		const skip = (page - 1) * limit;

		const data = await this.prisma.canonicalListing.findMany({
			where: { userId },
			orderBy: { createdAt: 'desc' },
			skip,
			take: limit,
		});

		return data.map((item) => ListingsMapper.toDomain(item));
	}

	async save(listing: Listing): Promise<Listing> {
		const props = listing.getProps();
		const data = ListingsMapper.toPrisma(listing);

		if (props.id) {
			// Update existing listing
			const updated = await this.prisma.canonicalListing.update({
				where: { id: props.id },
				data,
			});
			return ListingsMapper.toDomain(updated);
		} else {
			// Create new listing
			const created = await this.prisma.canonicalListing.create({
				data: {
					...data,
					userId: props.userId, // Ensure userId is set for new listings
				},
			});
			return ListingsMapper.toDomain(created);
		}
	}

	async delete(id: string): Promise<void> {
		await this.prisma.canonicalListing.delete({
			where: { id },
		});
	}
}
