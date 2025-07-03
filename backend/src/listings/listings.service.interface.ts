import { ListingCondition } from './listings.model';

export interface ListingData {
    // Required for create, optional for update
    imageKeys?: string[];

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

// For type safety, you can still have specific interfaces if needed
export interface CreateListingData extends ListingData {
    imageKeys: string[]; // Required for creation
}

export interface UpdateListingData extends ListingData {
    // All fields optional for updates
}
