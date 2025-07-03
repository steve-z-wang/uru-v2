import { IsString, IsOptional, IsNumber, IsArray, IsEnum, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ListingCondition } from '../../listings.model';
import { CreateListingData } from '../../listings.service.interface';

export class CreateListingDto implements CreateListingData {
	@IsArray()
	@IsString({ each: true })
	@ApiProperty({ 
		description: 'S3 image keys for the listing',
		example: ['image1.jpg', 'image2.jpg']
	})
	imageKeys: string[];

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({ 
		description: 'Title of the listing',
		example: 'Vintage Levi\'s Denim Jacket'
	})
	title?: string;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({ 
		description: 'Description of the item',
		example: 'Classic vintage denim jacket in excellent condition'
	})
	description?: string;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({ 
		description: 'Item category',
		example: 'Outerwear'
	})
	category?: string;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({ 
		description: 'Item subcategory',
		example: 'Jackets'
	})
	subcategory?: string;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({ 
		description: 'Size of the item',
		example: 'M'
	})
	size?: string;

	@IsOptional()
	@IsEnum(ListingCondition)
	@ApiPropertyOptional({ 
		description: 'Condition of the item',
		enum: ListingCondition
	})
	condition?: ListingCondition;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({ 
		description: 'Material of the item',
		example: 'denim'
	})
	material?: string;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({ 
		description: 'Gender category',
		example: 'unisex'
	})
	gender?: string;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({ 
		description: 'Brand name',
		example: 'Levi\'s'
	})
	brand?: string;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({ 
		description: 'Color of the item',
		example: 'blue'
	})
	color?: string;

	@IsOptional()
	@IsNumber()
	@Min(0)
	@ApiPropertyOptional({ 
		description: 'Selling price',
		example: 45.99
	})
	price?: number;

	@IsOptional()
	@IsNumber()
	@Min(0)
	@ApiPropertyOptional({ 
		description: 'Original retail price',
		example: 89.99
	})
	originalPrice?: number;

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@ApiPropertyOptional({ 
		description: 'Tags for the item',
		example: ['vintage', 'y2k', 'oversized']
	})
	tags?: string[];
}
