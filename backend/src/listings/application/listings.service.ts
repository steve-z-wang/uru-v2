import { Injectable, NotFoundException, Logger, Inject } from '@nestjs/common';
import { Listing, ListingStatus } from '../domain/listings.model';
import { ListingRepository } from './ports/listing.repository';
import { ListingAIService } from './ports/listing-ai.service';
import { CreateListingData, UpdateListingData } from './listings.service.types';
import { SuggestContentDto } from '../api/dto/input/suggest-content.dto';
import { ContentSuggestionDto } from '../api/dto/output/content-suggestion.dto';

@Injectable()
export class ListingsService {
	private readonly logger = new Logger(ListingsService.name);

	constructor(
		@Inject('ListingRepository') private listingRepository: ListingRepository,
		@Inject('ListingAIService') private listingAIService: ListingAIService,
	) {}

	/*********
	 * Query *
	 *********/

	async getListingById(userId: string, id: string): Promise<Listing> {
		const listing = await this.listingRepository.findById(id);

		// Use domain method for ownership check
		if (!listing || !listing.isOwnedBy(userId)) {
			throw new NotFoundException('Listing not found');
		}

		return listing;
	}

	async getUserListings(userId: string, page: number, limit: number): Promise<Listing[]> {
		return this.listingRepository.findByUserId(userId, page, limit);
	}

	/************
	 * Mutation *
	 ************/

	async createListing(userId: string, data: CreateListingData): Promise<Listing> {
		const listing = new Listing({
			...data,
			userId,
			status: ListingStatus.DRAFT,
			tags: data.tags || [],
		});

		return this.listingRepository.save(listing);
	}

	async updateListing(userId: string, id: string, data: UpdateListingData): Promise<Listing> {
		// Get existing listing with ownership check
		const listing = await this.getListingById(userId, id);

		// Update domain object
		const props = listing.getProps();
		const updatedListing = new Listing({
			...props,
			...data,
			// Ensure these fields don't change
			id: props.id,
			userId: props.userId,
			createdAt: props.createdAt,
		});

		return this.listingRepository.save(updatedListing);
	}

	/****************
	 * AI Features *
	 ****************/

	async suggestContent(dto: SuggestContentDto): Promise<ContentSuggestionDto> {
		// Call AI service with spread DTO
		const suggestion = await this.listingAIService.suggestContent({ ...dto });

		// Map domain output to DTO
		return suggestion as ContentSuggestionDto;
	}
}
