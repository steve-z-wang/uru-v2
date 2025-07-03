import {
	Controller,
	Post,
	UseInterceptors,
	UploadedFile,
	UseGuards,
	Logger,
	HttpCode,
	HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
	ApiTags,
	ApiOperation,
	ApiConsumes,
	ApiBody,
	ApiBearerAuth,
} from '@nestjs/swagger';
import { Express } from 'express';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUserToken } from '../auth/decorators/auth-user-token.decorator';

@ApiTags('files')
@ApiBearerAuth()
@Controller('files')
export class FilesController {
	private readonly logger = new Logger(FilesController.name);

	constructor(private readonly filesService: FilesService) {}

	@UseGuards(JwtAuthGuard)
	@Post('upload')
	@HttpCode(HttpStatus.CREATED)
	@UseInterceptors(FileInterceptor('file'))
	@ApiOperation({ summary: 'Upload a single file' })
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		description: 'File upload',
		type: 'multipart/form-data',
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})
	async uploadFile(
		@AuthUserToken() authUserToken: AuthUserToken,
		@UploadedFile() file: Express.Multer.File,
	) {
		this.logger.log(`User ${authUserToken.userId} uploading file: ${file.originalname}`);
		try {
			const result = await this.filesService.uploadFile(authUserToken.userId, file);
			this.logger.log(`Successfully uploaded file ${result.id} for user ${authUserToken.userId}`);
			return result;
		} catch (error) {
			this.logger.error(`Failed to upload file for user ${authUserToken.userId}`, error.stack);
			throw error;
		}
	}
}