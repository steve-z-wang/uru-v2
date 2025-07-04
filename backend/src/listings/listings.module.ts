import { Module } from '@nestjs/common';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LangChainModule } from 'src/langchain/langchain.module';
import { FilesModule } from 'src/files/files.module';

@Module({
	imports: [PrismaModule, LangChainModule, FilesModule],
	controllers: [ListingsController],
	providers: [ListingsService],
})
export class ListingsModule {}
