import {
	Body,
	Controller,
	Patch,
	Post,
	UseGuards,
	Param,
	HttpCode,
	HttpStatus,
	Get,
	Query,
} from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiBearerAuth,
	ApiParam,
	ApiQuery,
} from '@nestjs/swagger';
import { AuthUserToken } from 'src/auth/decorators/auth-user-token.decorator';
import { ListingDto } from './dto/output/listing.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateListingDto } from './dto/input/create-listing.dto';
import { UpdateListingDto } from './dto/input/update-listing.dto';
import { SuggestContentDto } from './dto/input/suggest-content.dto';
import { ContentSuggestionDto } from './dto/output/content-suggestion.dto';
import { ListingsService } from '../application/listings.service';
import { ListingsMapper } from '../listings.mapper';

@ApiTags('listings')
@ApiBearerAuth()
@Controller('listings')
export class ListingsController {
	constructor(private readonly listingsService: ListingsService) {}

	/*********
	 * Query *
	 *********/

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Get listing by ID',
		description: 'Get a single listing owned by the authenticated user',
	})
	@ApiParam({ name: 'id', description: 'Listing ID' })
	async getListingById(
		@AuthUserToken() authUserToken: AuthUserToken,
		@Param('id') id: string,
	): Promise<ListingDto> {
		const listing = await this.listingsService.getListingById(authUserToken.userId, id);
		return ListingsMapper.toDto(listing);
	}

	@UseGuards(JwtAuthGuard)
	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Get user listings',
		description: 'Get all listings owned by the authenticated user with optional filtering',
	})
	@ApiQuery({
		name: 'page',
		required: false,
		description: 'Page number for pagination',
		type: Number,
		example: 1,
	})
	@ApiQuery({
		name: 'limit',
		required: false,
		description: 'Number of items per page',
		type: Number,
		example: 10,
	})
	async getUserListings(
		@AuthUserToken() authUserToken: AuthUserToken,
		@Query('page') page?: string,
		@Query('limit') limit?: string,
	): Promise<ListingDto[]> {
		const pageNumber = parseInt(page || '1', 10);
		const limitNumber = parseInt(limit || '10', 10);

		const listings = await this.listingsService.getUserListings(
			authUserToken.userId,
			pageNumber,
			limitNumber,
		);
		return listings.map((listing) => ListingsMapper.toDto(listing));
	}

	/************
	 * Mutation *
	 ************/

	@UseGuards(JwtAuthGuard)
	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Create a new listing',
		description: 'Create a new clothing item listing for the authenticated user',
	})
	async createListing(
		@AuthUserToken() authUserToken: AuthUserToken,
		@Body() createListingDto: CreateListingDto,
	): Promise<ListingDto> {
		const listing = await this.listingsService.createListing(
			authUserToken.userId,
			createListingDto,
		);
		return ListingsMapper.toDto(listing);
	}

	@UseGuards(JwtAuthGuard)
	@Post('suggest-content')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Generate AI content suggestions',
		description:
			'Generate AI-powered content suggestions for a listing based on images and provided information',
	})
	@ApiResponse({
		status: 200,
		description: 'Content suggestions generated successfully',
		type: ContentSuggestionDto,
	})
	async suggestContent(
		@AuthUserToken() authUserToken: AuthUserToken,
		@Body() suggestContentDto: SuggestContentDto,
	): Promise<ContentSuggestionDto> {
		const suggestions = await this.listingsService.suggestContent(suggestContentDto);
		return suggestions;
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Update listing',
		description: 'Update an existing listing owned by the authenticated user',
	})
	@ApiParam({ name: 'id', description: 'Listing ID' })
	async updateListing(
		@AuthUserToken() authUserToken: AuthUserToken,
		@Param('id') id: string,
		@Body() updateListingDto: UpdateListingDto,
	): Promise<ListingDto> {
		const listing = await this.listingsService.updateListing(
			authUserToken.userId,
			id,
			updateListingDto,
		);
		return ListingsMapper.toDto(listing);
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id/publish')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Publish listing',
		description: 'Publish a draft listing to make it publicly visible',
	})
	@ApiParam({ name: 'id', description: 'Listing ID' })
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	publishListing(@AuthUserToken() _authUserToken: AuthUserToken, @Param('id') _id: string): void {
		// Implementation needed
		throw new Error('Method not implemented');
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id/archive')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Archive listing',
		description: 'Archive a published listing to hide it from public view',
	})
	@ApiParam({ name: 'id', description: 'Listing ID' })
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	archiveListing(@AuthUserToken() _authUserToken: AuthUserToken, @Param('id') _id: string): void {
		// Implementation needed
		throw new Error('Method not implemented');
	}
}
