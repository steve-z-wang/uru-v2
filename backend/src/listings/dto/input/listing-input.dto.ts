import { IsString, IsOptional, IsNumber, IsArray, IsEnum, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ListingCondition } from '../../listings.model';

export class ListingInputDto {
	@IsArray()
	@IsString({ each: true })
	@ApiPropertyOptional({ description: 'S3 image keys for the listing' })
	imageKeys: string[];

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({ description: 'Title of the listing' })
	title?: string;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({ description: 'Description of the item' })
	description?: string;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({ description: 'Item category' })
	category?: string;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({ description: 'Item subcategory' })
	subcategory?: string;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({ description: 'Size of the item' })
	size?: string;

	@IsOptional()
	@IsEnum(ListingCondition)
	@ApiPropertyOptional({ description: 'Condition of the item' })
	condition?: ListingCondition;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({ description: 'Material of the item' })
	material?: string;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({ description: 'Gender category' })
	gender?: string;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({ description: 'Brand name' })
	brand?: string;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({ description: 'Color of the item' })
	color?: string;

	@IsOptional()
	@IsNumber()
	@Min(0)
	@ApiPropertyOptional({ description: 'Selling price' })
	price?: number;

	@IsOptional()
	@IsNumber()
	@Min(0)
	@ApiPropertyOptional({ description: 'Original retail price' })
	originalPrice?: number;

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@ApiPropertyOptional({ description: 'Tags for the item' })
	tags?: string[];
}
