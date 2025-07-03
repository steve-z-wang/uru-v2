import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ListingInputDto } from './listing-input.dto';

export class CreateListingDto {
	@ApiProperty({ type: ListingInputDto })
	@ValidateNested()
	@Type(() => ListingInputDto)
	listing: ListingInputDto;
}
