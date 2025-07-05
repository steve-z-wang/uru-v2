import { Injectable, Logger } from '@nestjs/common';
import { LangChainFactory } from 'src/langchain/langchain.factory';
import { FilesService } from 'src/files/files.service';
import { 
	ListingAIService, 
	ListingContentInput, 
	ListingContentSuggestion 
} from '../application/ports/listing-ai.service';

@Injectable()
export class ListingAIServiceImpl implements ListingAIService {
	private readonly logger = new Logger(ListingAIServiceImpl.name);

	constructor(
		private langChainFactory: LangChainFactory,
		private filesService: FilesService,
	) {}

	async suggestContent(input: ListingContentInput): Promise<ListingContentSuggestion> {
		this.logger.log('Generating content suggestions for listing');

		try {
			// Convert image keys to base64 data URLs
			// OpenAI cannot access localhost URLs, so we need base64
			const imageDataUrls = await Promise.all(
				input.imageKeys.map(key => this.filesService.getFileAsBase64(key))
			);
			
			this.logger.log(`Processing ${imageDataUrls.length} images`);
			this.logger.log(`Images converted to base64 data URLs`);

			// Create vision model
			const model = this.langChainFactory.createVisionModel({
				temperature: 0.8,
				maxTokens: 1500,
			});

			// Create JSON parser for structured output
			const parser = this.langChainFactory.createJsonParser<ListingContentSuggestion>();

			// Create system message
			const systemMessage = this.langChainFactory.createSystemMessage(
				this.getSystemPrompt()
			);

			// Create human message with images
			const humanMessage = this.langChainFactory.createMultimodalMessage(
				this.buildAnalysisPrompt(input),
				imageDataUrls
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

	private buildAnalysisPrompt(data: ListingContentInput): string {
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
}