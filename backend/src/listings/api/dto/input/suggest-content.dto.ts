import {
	IsString,
	IsOptional,
	IsNumber,
	IsArray,
	IsEnum,
	Min,
	ArrayMinSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ListingCondition } from '../../../domain/listings.model';

export class SuggestContentDto {
	@IsArray()
	@ArrayMinSize(1)
	@IsString({ each: true })
	@ApiProperty({
		description: 'S3 image keys for AI analysis (required)',
		example: ['image1.jpg', 'image2.jpg'],
	})
	imageKeys: string[];

	@IsString()
	@ApiProperty({
		description: 'Item category (required for targeted suggestions)',
		example: 'Outerwear',
	})
	category: string;

	@IsString()
	@ApiProperty({
		description: 'Size of the item (required)',
		example: 'M',
	})
	size: string;

	@IsEnum(ListingCondition)
	@ApiProperty({
		description: 'Condition of the item (required)',
		enum: ListingCondition,
		example: ListingCondition.GOOD,
	})
	condition: ListingCondition;

	@IsString()
	@ApiProperty({
		description: 'Brand name (required)',
		example: "Levi's",
	})
	brand: string;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({
		description: 'Title of the listing',
		example: "Vintage Levi's Denim Jacket",
	})
	title?: string;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({
		description: 'Description of the item',
		example: 'Classic vintage denim jacket in excellent condition',
	})
	description?: string;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({
		description: 'Item subcategory',
		example: 'Jackets',
	})
	subcategory?: string;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({
		description: 'Material of the item',
		example: 'denim',
	})
	material?: string;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({
		description: 'Gender category',
		example: 'unisex',
	})
	gender?: string;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({
		description: 'Color of the item',
		example: 'blue',
	})
	color?: string;

	@IsOptional()
	@IsNumber()
	@Min(0)
	@ApiPropertyOptional({
		description: 'Selling price',
		example: 45.99,
	})
	price?: number;

	@IsOptional()
	@IsNumber()
	@Min(0)
	@ApiPropertyOptional({
		description: 'Original retail price',
		example: 89.99,
	})
	originalPrice?: number;

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@ApiPropertyOptional({
		description: 'Tags for the item',
		example: ['vintage', 'y2k', 'oversized'],
	})
	tags?: string[];
}
