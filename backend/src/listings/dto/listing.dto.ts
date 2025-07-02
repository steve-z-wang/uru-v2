export class ListingDto {
	id: string;
	title: string;
	description: string;
	imageKeys: string[];
	videoKey?: string | null;
	price: number;
	originalPrice?: number | null;
	size: string;
	condition: string;
	material?: string | null;
	gender?: string | null;
	brand?: string | null;
	measurements?: Record<string, string> | null;
	tags: string[];
	category: string;
	subcategory?: string | null;
	color?: string | null;
	vibeTags?: string[];
	status: 'DRAFT' | 'READY' | 'PUBLISHED' | 'ARCHIVED';
	createdAt: string;
	updatedAt: string;
	userId: string;
}