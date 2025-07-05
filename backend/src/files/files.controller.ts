import {
	Controller,
	Post,
	Get,
	Delete,
	UseInterceptors,
	UploadedFile,
	UseGuards,
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
		const uploadedFile = await this.filesService.uploadFile({
			userId: authUserToken.userId,
			file,
			category: uploadFileDto.category,
		});
		return FilesMapper.toDto(uploadedFile);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get a file' })
	@ApiParam({ name: 'id', description: 'File ID' })
	async getFile(
		@Param('id') id: string,
		@AuthUserToken() authUserToken: AuthUserToken,
		@Res() res: Response,
	): Promise<void> {
		const file = await this.filesService.getFile(id, authUserToken.userId);
		res.send(file);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Delete a file' })
	@ApiParam({ name: 'id', description: 'File ID' })
	async deleteFile(
		@Param('id') id: string,
		@AuthUserToken() authUserToken: AuthUserToken,
	): Promise<void> {
		await this.filesService.deleteFile(id, authUserToken.userId);
	}
}
