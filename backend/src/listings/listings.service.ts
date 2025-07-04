import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Listing } from './listings.model';
import { ListingsMapper } from './listings.mapper';
import { CreateListingData, UpdateListingData } from './listings.service.interface';
import { LangChainFactory } from 'src/langchain/langchain.factory';
import { FilesService } from 'src/files/files.service';
import { SuggestContentDto } from './dto/input/suggest-content.dto';
import { ContentSuggestionDto } from './dto/output/content-suggestion.dto';

@Injectable()
export class ListingsService {
	private readonly logger = new Logger(ListingsService.name);

	constructor(
		private prismaService: PrismaService,
		private langChainFactory: LangChainFactory,
		private filesService: FilesService,
	) {}

	/*********
	 * Query *
	 *********/

	async findListingById(userId: string, id: string): Promise<Listing | null> {
		const existingListing = await this.prismaService.canonicalListing.findUnique({
			where: {
				id: id,
				userId: userId,
			},
		});

		return existingListing ? ListingsMapper.toDomain(existingListing) : null;
	}

	async getListingById(userId: string, id: string): Promise<Listing> {
		const existingListing = await this.findListingById(userId, id);
		if (!existingListing) {
			this.throwNotFoundException();
		}
		return existingListing;
	}

	async getUserListings(userId: string, page: number, limit: number): Promise<Listing[]> {
		const skip = (page - 1) * limit;
		const listings = await this.prismaService.canonicalListing.findMany({
			where: { userId },
			orderBy: { createdAt: 'desc' },
			skip: skip,
			take: limit,
		});
		return listings.map(ListingsMapper.toDomain);
	}

	/************
	 * Mutation *
	 ************/

	async createListing(userId: string, data: CreateListingData): Promise<Listing> {
		const listing = await this.prismaService.canonicalListing.create({
			data: {
				userId: userId,
				...data,
			},
		});

		return ListingsMapper.toDomain(listing);
	}

	async updateListing(userId: string, id: string, data: UpdateListingData): Promise<Listing> {
		// Filter out undefined values for partial updates
		const updateData = Object.fromEntries(
			Object.entries(data).filter(([_, value]) => value !== undefined)
		);

		try {
			const listing = await this.prismaService.canonicalListing.update({
				where: {
					id: id,
					userId: userId, // This ensures ownership check
				},
				data: updateData,
			});
			return ListingsMapper.toDomain(listing);
		} catch (error) {
			if (error.code === 'P2025') {
				this.throwNotFoundException();
			}
			throw error;
		}
	}

	/****************
	 * AI Features *
	 ****************/

	async suggestContent(data: SuggestContentDto): Promise<ContentSuggestionDto> {
		this.logger.log('Generating content suggestions for listing');

		try {
			// Get file URLs from file service
			const imageUrls = await Promise.all(
				data.imageKeys.map(key => this.filesService.getFileUrl(key))
			);

			// Create vision model
			const model = this.langChainFactory.createVisionModel({
				temperature: 0.8,
				maxTokens: 1500,
			});

			// Create JSON parser for structured output
			const parser = this.langChainFactory.createJsonParser<ContentSuggestionDto>();

			// Create system message
			const systemMessage = this.langChainFactory.createSystemMessage(
				this.getSystemPrompt()
			);

			// Create human message with images
			const humanMessage = this.langChainFactory.createMultimodalMessage(
				this.buildAnalysisPrompt(data),
				imageUrls
			);

			// Create and run the chain
			const chain = model.pipe(parser);
			const result = await chain.invoke([systemMessage, humanMessage]);

			this.logger.log('Successfully generated content suggestions');
			return result;
		} catch (error) {
			this.logger.error('Failed to generate content suggestions', error);
			throw error;
		}
	}

	private getSystemPrompt(): string {
		return `You are an expert fashion resale consultant specializing in creating compelling, SEO-optimized listings for pre-owned clothing. 
Your goal is to analyze clothing images and generate content that:
1. Accurately describes the item
2. Highlights unique features and selling points
3. Uses search-friendly keywords
4. Appeals to the target demographic
5. Suggests fair market pricing

Always be honest about condition and any visible flaws.`;
	}

	private buildAnalysisPrompt(data: SuggestContentDto): string {
		const parts = [
			`Analyze these clothing item images and generate listing content.`,
			``,
			`Required Information:`,
			`- Category: ${data.category}`,
			`- Brand: ${data.brand}`,
			`- Size: ${data.size}`,
			`- Condition: ${data.condition}`,
		];

		// Add optional fields if provided
		if (data.subcategory) parts.push(`- Subcategory: ${data.subcategory}`);
		if (data.title) parts.push(`- Current Title: ${data.title}`);
		if (data.description) parts.push(`- Current Description: ${data.description}`);
		if (data.material) parts.push(`- Material: ${data.material}`);
		if (data.gender) parts.push(`- Gender: ${data.gender}`);
		if (data.color) parts.push(`- Color: ${data.color}`);
		if (data.price) parts.push(`- Current Price: $${data.price}`);
		if (data.originalPrice) parts.push(`- Original Price: $${data.originalPrice}`);
		if (data.tags?.length) parts.push(`- Current Tags: ${data.tags.join(', ')}`);

		parts.push(
			``,
			`Please analyze the images and return a JSON object with the following structure:`,
			`{`,
			`  "title": "Compelling, SEO-friendly title (max 80 chars)",`,
			`  "description": "Detailed description with features, styling tips, and condition (2-3 paragraphs)",`,
			`  "subcategory": "Specific subcategory if detectable",`,
			`  "material": "Detected material/fabric",`,
			`  "gender": "Men's/Women's/Unisex",`,
			`  "color": "Primary color(s)",`,
			`  "suggestedPrice": number (fair market price in USD),`,
			`  "tags": ["relevant", "search", "tags"],`,
			`  "vibeTags": ["style", "aesthetic", "tags"],`,
			`  "confidence": number between 0 and 1,`,
			`  "insights": "Notable details, flaws, or unique features"`,
			`}`
		);

		return parts.join('\n');
	}

	/***********
	 * Helpers *
	 ***********/

	private throwNotFoundException(): never {
		throw new NotFoundException('Listing not found');
	}
}
