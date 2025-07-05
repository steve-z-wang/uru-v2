import { Express } from 'express';
import { FileCategory } from './dto/input/upload-file.dto';
import { File } from './files.model';

export interface UploadFileInput {
	userId: string;
	file: Express.Multer.File;
	category: FileCategory;
}

export interface FilesServiceInterface {
	uploadFile(input: UploadFileInput): Promise<File>;

	getFile(fileId: string, userId: string): Promise<Buffer>;

	deleteFile(fileId: string, userId: string): Promise<void>;
}
