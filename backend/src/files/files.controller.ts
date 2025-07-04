import {
	Controller,
	Post,
	Get,
	Delete,
	UseInterceptors,
	UploadedFile,
	UseGuards,
	Logger,
	HttpCode,
	HttpStatus,
	Param,
	Res,
	Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
	ApiTags,
	ApiOperation,
	ApiConsumes,
	ApiBody,
	ApiBearerAuth,
	ApiParam,
} from '@nestjs/swagger';
import { Express, Response } from 'express';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUserToken } from '../auth/decorators/auth-user-token.decorator';
import { FileDto } from './dto/output/file.dto';
import { UploadFileDto } from './dto/input/upload-file.dto';
import { FilesMapper } from './files.mapper';

@ApiTags('files')
@ApiBearerAuth()
@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
	private readonly logger = new Logger(FilesController.name);

	constructor(private readonly filesService: FilesService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseInterceptors(FileInterceptor('file'))
	@ApiOperation({ summary: 'Upload a file' })
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		description: 'File upload with category',
		type: 'multipart/form-data',
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
				category: {
					type: 'string',
					enum: ['media', 'document'],
				},
			},
			required: ['file', 'category'],
		},
	})
	async uploadFile(
		@AuthUserToken() authUserToken: AuthUserToken,
		@UploadedFile() file: Express.Multer.File,
		@Body() uploadFileDto: UploadFileDto,
	): Promise<FileDto> {
		this.logger.log(`User ${authUserToken.userId} uploading ${uploadFileDto.category} file: ${file.originalname}`);
		try {
			const uploadedFile = await this.filesService.uploadFile({
				userId: authUserToken.userId,
				file,
				category: uploadFileDto.category,
			});
			this.logger.log(`Successfully uploaded file ${uploadedFile.id} for user ${authUserToken.userId}`);
			return FilesMapper.toDto(uploadedFile);
		} catch (error) {
			this.logger.error(`Failed to upload file for user ${authUserToken.userId}`, error.stack);
			throw error;
		}
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get a file' })
	@ApiParam({ name: 'id', description: 'File ID' })
	async getFile(
		@Param('id') id: string,
		@AuthUserToken() authUserToken: AuthUserToken,
		@Res() res: Response,
	): Promise<void> {
		this.logger.log(`User ${authUserToken.userId} retrieving file: ${id}`);
		try {
			const file = await this.filesService.getFile(id, authUserToken.userId);
			res.send(file);
		} catch (error) {
			this.logger.error(`Failed to get file ${id} for user ${authUserToken.userId}`, error.stack);
			throw error;
		}
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Delete a file' })
	@ApiParam({ name: 'id', description: 'File ID' })
	async deleteFile(
		@Param('id') id: string,
		@AuthUserToken() authUserToken: AuthUserToken,
	): Promise<void> {
		this.logger.log(`User ${authUserToken.userId} deleting file: ${id}`);
		try {
			await this.filesService.deleteFile(id, authUserToken.userId);
			this.logger.log(`Successfully deleted file ${id} for user ${authUserToken.userId}`);
		} catch (error) {
			this.logger.error(`Failed to delete file ${id} for user ${authUserToken.userId}`, error.stack);
			throw error;
		}
	}
}