import { Module } from '@nestjs/common';
import { LangChainFactory } from './langchain.factory';
import { AppConfigModule } from '../config/config.module';

@Module({
	imports: [AppConfigModule],
	providers: [LangChainFactory],
	exports: [LangChainFactory],
})
export class LangChainModule {}