import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ContentSuggestionDto {
	@ApiProperty({
		description: 'AI-suggested title for the listing',
		example: "Vintage Levi's Type III Trucker Denim Jacket - Classic Blue",
	})
	title: string;

	@ApiProperty({
		description: 'AI-generated description',
		example:
			"Step into timeless style with this authentic Levi's Type III Trucker jacket. Features classic indigo wash, signature button front, and iconic chest pockets. Perfect layering piece for any season.",
	})
	description: string;

	@ApiPropertyOptional({
		description: 'AI-suggested subcategory if not provided',
		example: 'Denim Jackets',
	})
	subcategory?: string;

	@ApiPropertyOptional({
		description: 'AI-detected material if not provided',
		example: '100% Cotton Denim',
	})
	material?: string;

	@ApiPropertyOptional({
		description: 'AI-suggested gender category if not provided',
		example: 'Unisex',
	})
	gender?: string;

	@ApiPropertyOptional({
		description: 'AI-detected primary color if not provided',
		example: 'Indigo Blue',
	})
	color?: string;

	@ApiPropertyOptional({
		description: 'AI-suggested price based on market analysis',
		example: 65.0,
	})
	suggestedPrice?: number;

	@ApiProperty({
		description: 'AI-generated tags for searchability',
		example: ['vintage', 'denim', 'trucker jacket', "levi's", 'classic', 'workwear', 'americana'],
	})
	tags: string[];

	@ApiPropertyOptional({
		description: 'AI-generated vibe/style tags',
		example: ['streetwear', 'vintage americana', 'workwear chic', 'timeless classic'],
	})
	vibeTags?: string[];

	@ApiProperty({
		description: 'Confidence score of AI suggestions (0-1)',
		example: 0.85,
	})
	confidence: number;

	@ApiPropertyOptional({
		description: 'Additional insights or warnings from AI analysis',
		example:
			'Detected slight fading on left sleeve. Consider mentioning in description for transparency.',
	})
	insights?: string;
}
