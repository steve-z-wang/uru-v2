import { Injectable, Logger } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { AppConfigService } from '../config/config.service';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';

export interface LangChainConfig {
	model?: string;
	temperature?: number;
	maxTokens?: number;
}

@Injectable()
export class LangChainFactory {
	private readonly logger = new Logger(LangChainFactory.name);
	private apiKey: string;

	constructor(private configService: AppConfigService) {
		this.apiKey = this.configService.getOpenAIApiKey();
		if (!this.apiKey) {
			this.logger.warn('OpenAI API key not configured');
		}
	}

	/**
	 * Create a ChatOpenAI instance with custom configuration
	 */
	createChatModel(config: LangChainConfig = {}): ChatOpenAI {
		const {
			model = 'gpt-4-turbo-preview',
			temperature = 0.7,
			maxTokens = 1000,
		} = config;

		return new ChatOpenAI({
			openAIApiKey: this.apiKey,
			modelName: model,
			temperature,
			maxTokens,
		});
	}

	/**
	 * Create a vision-capable chat model
	 */
	createVisionModel(config: Omit<LangChainConfig, 'model'> = {}): ChatOpenAI {
		return this.createChatModel({
			...config,
			model: 'gpt-4-vision-preview',
		});
	}

	/**
	 * Create a JSON output parser
	 */
	createJsonParser<T extends Record<string, any> = any>(): JsonOutputParser<T> {
		return new JsonOutputParser<T>();
	}

	/**
	 * Create a prompt template
	 */
	createPromptTemplate(template: string, inputVariables: string[]): PromptTemplate {
		return new PromptTemplate({
			template,
			inputVariables,
		});
	}

	/**
	 * Helper to create image content for vision models
	 */
	createImageContent(imageUrls: string[]): Array<{
		type: 'image_url';
		image_url: { url: string };
	}> {
		return imageUrls.map(url => ({
			type: 'image_url' as const,
			image_url: { url },
		}));
	}

	/**
	 * Helper to create a multimodal message with text and images
	 */
	createMultimodalMessage(text: string, imageUrls: string[]): HumanMessage {
		return new HumanMessage({
			content: [
				{ type: 'text', text },
				...this.createImageContent(imageUrls),
			],
		});
	}

	/**
	 * Create system message
	 */
	createSystemMessage(content: string): SystemMessage {
		return new SystemMessage(content);
	}
}