import { ListingCondition } from '../domain/listings.model';

/**
 * Base listing data structure shared between create and update operations
 */
interface BaseListingData {
	// Basic info
	title?: string;
	description?: string;
	category?: string;
	subcategory?: string;

	// Physical attributes
	size?: string;
	condition?: ListingCondition;
	material?: string;
	gender?: string;
	brand?: string;
	color?: string;

	// Pricing
	price?: number;
	originalPrice?: number;

	// Metadata
	tags?: string[];
}

/**
 * Data required to create a new listing
 */
export interface CreateListingData extends BaseListingData {
	imageKeys: string[]; // Required for creation
}

/**
 * Data for updating an existing listing
 */
export interface UpdateListingData extends BaseListingData {
	imageKeys?: string[]; // Optional for updates
}
