import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ListingInputDto } from './listing-input.dto';

export class UpdateListingDto {
	@ApiProperty({ type: ListingInputDto })
	@ValidateNested()
	@Type(() => ListingInputDto)
	listing: ListingInputDto;
}
