import { Module } from '@nestjs/common';
import { ListingsController } from './api/listings.controller';
import { ListingsService } from './application/listings.service';
import { ListingRepositoryImpl } from './infra/listing.repository.impl';
import { ListingAIServiceImpl } from './infra/listing-ai.service.impl';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FilesModule } from 'src/files/files.module';

@Module({
	imports: [PrismaModule, FilesModule],
	controllers: [ListingsController],
	providers: [
		ListingsService,
		{
			provide: 'ListingRepository',
			useClass: ListingRepositoryImpl,
		},
		{
			provide: 'ListingAIService',
			useClass: ListingAIServiceImpl,
		},
	],
})
export class ListingsModule {}
