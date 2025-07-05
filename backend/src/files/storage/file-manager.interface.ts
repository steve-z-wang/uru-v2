export interface UploadedFileMetadata {
	originalName: string;
	mimeType: string;
	size: number;
	path: string;
	uploadedAt: Date;
}

export interface FileManagerInterface {
	uploadFile(file: Express.Multer.File, path: string): Promise<UploadedFileMetadata>;

	deleteFile(path: string): Promise<void>;

	getFile(path: string): Promise<Buffer>;

	fileExists(path: string): Promise<boolean>;

	getFileUrl(path: string): string;
}
