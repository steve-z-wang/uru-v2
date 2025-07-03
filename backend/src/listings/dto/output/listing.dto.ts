import { ListingCondition, ListingStatus } from '../../listings.model';

export class ListingDto {
	id: string;
	title: string;
	description: string;
	imageKeys: string[];
	price: number;
	originalPrice?: number;
	size: string;
	condition: ListingCondition;
	material?: string;
	gender?: string;
	brand?: string;
	tags: string[];
	category: string;
	subcategory?: string;
	color?: string;
	vibeTags?: string[];
	status: ListingStatus;
	createdAt: number;
	updatedAt: number;
}
