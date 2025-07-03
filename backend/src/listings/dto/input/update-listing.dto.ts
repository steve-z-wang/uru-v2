import { PartialType } from '@nestjs/mapped-types';
import { CreateListingDto } from './create-listing.dto';
import { UpdateListingData } from '../../interfaces/listing-data.interface';

export class UpdateListingDto extends PartialType(CreateListingDto) implements UpdateListingData {
	// All fields from CreateListingDto are now optional
}
