import { CreateListingDto } from './create-listing.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateListingDto extends PartialType(CreateListingDto) {}
