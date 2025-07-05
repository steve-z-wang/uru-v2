import {
	CanonicalListing as PrismaListing,
	ListingCondition as PrismaCondition,
	ListingStatus as PrismaStatus,
} from 'generated/prisma';
import {
	Listing,
	ListingCondition as DomainCondition,
	ListingStatus as DomainStatus,
} from './domain/listings.model';
import { ListingDto } from './api/dto/output/listing.dto';

export class ListingsMapper {
	static toDomain(data: PrismaListing): Listing {
		return new Listing({
			id: data.id,
			status: data.status as DomainStatus,
			imageKeys: data.imageKeys,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			userId: data.userId,
			size: data.size ?? undefined,
			condition: (data.condition as DomainCondition) ?? undefined,
			material: data.material ?? undefined,
			gender: data.gender ?? undefined,
			brand: data.brand ?? undefined,
			originalPrice: data.originalPrice ?? undefined,
			title: data.title ?? undefined,
			description: data.description ?? undefined,
			tags: data.tags,
			category: data.category ?? undefined,
			subcategory: data.subcategory ?? undefined,
			color: data.color ?? undefined,
			price: data.price ?? undefined,
		});
	}

	static toDto(domainData: Listing): ListingDto {
		const props = domainData.getProps();
		return {
			...props,
			createdAt: props.createdAt?.getTime(),
			updatedAt: props.updatedAt?.getTime(),
		} as ListingDto;
	}

	static toPrisma(domainData: Listing): Partial<PrismaListing> {
		const props = domainData.getProps();
		return {
			imageKeys: props.imageKeys,
			title: props.title,
			description: props.description,
			category: props.category,
			subcategory: props.subcategory,
			size: props.size,
			condition: props.condition as PrismaCondition,
			material: props.material,
			gender: props.gender,
			brand: props.brand,
			color: props.color,
			price: props.price,
			originalPrice: props.originalPrice,
			tags: props.tags,
			status: props.status as PrismaStatus,
		};
	}
}
