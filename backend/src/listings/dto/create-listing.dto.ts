import { IsOptional, IsString, IsArray, IsEnum, IsNumber } from 'class-validator';

export class CreateListingDto {
	@IsArray()
	imageKeys: string[];

	@IsOptional()
	@IsString()
	videoKey?: string;

	@IsOptional()
	@IsNumber()
	originalPrice?: number;

	@IsOptional()
	@IsNumber()
	price?: number;

	@IsOptional()
	@IsString()
	size?: string;

	@IsOptional()
	@IsString()
	condition?: string;

	@IsOptional()
	@IsString()
	material?: string;

	@IsOptional()
	@IsString()
	gender?: string;

	@IsOptional()
	@IsString()
	brand?: string;

	@IsOptional()
	measurements?: Record<string, string>;

	@IsOptional()
	@IsString()
	title?: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsArray()
	tags?: string[];

	@IsOptional()
	@IsString()
	category?: string;

	@IsOptional()
	@IsString()
	subcategory?: string;

	@IsOptional()
	@IsString()
	color?: string;

	@IsOptional()
	@IsArray()
	vibeTags?: string[];

	@IsOptional()
	@IsEnum(['DRAFT', 'READY', 'PUBLISHED', 'ARCHIVED'])
	status?: 'DRAFT' | 'READY' | 'PUBLISHED' | 'ARCHIVED';
}
