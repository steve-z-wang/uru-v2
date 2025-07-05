import { Listing } from '../../domain/listings.model';

export interface ListingRepository {
	findById(id: string): Promise<Listing | null>;
	findByUserId(userId: string, page: number, limit: number): Promise<Listing[]>;
	save(listing: Listing): Promise<Listing>;
	delete(id: string): Promise<void>;
}