import {
	CanonicalListing as PrismaListing,
	ListingCondition as PrismaCondition,
	ListingStatus as PrismaStatus,
} from 'generated/prisma';
import {
	Listing,
	ListingCondition as DomainCondition,
	ListingStatus as DomainStatus,
} from './listings.model';
import { ListingDto } from './dto/output/listing.dto';

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
}
