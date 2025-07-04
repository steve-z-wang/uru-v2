import { PartialType } from '@nestjs/mapped-types';
import { CreateListingDto } from './create-listing.dto';

export class UpdateListingDto extends PartialType(CreateListingDto) {
	// All fields from CreateListingDto are now optional
}
