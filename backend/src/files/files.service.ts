import { Injectable, Logger, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { FilesServiceInterface, UploadFileInput } from './files.service.interface';
import { File } from './files.model';
import { FileManagerInterface } from './storage/file-manager.interface';
import * as crypto from 'crypto';

interface FileMetadata {
  id: string;
  path: string;
  userId: string;
  category: string;
  originalName: string;
  uploadedAt: Date;
}

@Injectable()
export class FilesService implements FilesServiceInterface {
  private readonly logger = new Logger(FilesService.name);
  private readonly fileRegistry = new Map<string, FileMetadata>();

  constructor(
    @Inject('FileManagerInterface')
    private readonly fileManager: FileManagerInterface,
  ) {}

  async uploadFile(input: UploadFileInput): Promise<File> {
    const { userId, file, category } = input;
    
    // Generate unique file ID
    const fileId = this.generateFileId();
    
    // Construct file path: userId/category/filename
    const timestamp = Date.now();
    const safeFileName = `${timestamp}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `${userId}/${category}/${safeFileName}`;

    this.logger.log(`Uploading file to path: ${filePath}`);

    // Upload file using storage abstraction
    const uploadedFile = await this.fileManager.uploadFile(file, filePath);

    // Store metadata in registry (in production, this would be in database)
    const metadata: FileMetadata = {
      id: fileId,
      path: filePath,
      userId,
      category,
      originalName: file.originalname,
      uploadedAt: uploadedFile.uploadedAt,
    };
    this.fileRegistry.set(fileId, metadata);

    this.logger.log(`File uploaded successfully with ID: ${fileId}`);

    return {
      id: fileId,
    };
  }

  async getFile(fileId: string, userId: string): Promise<Buffer> {
    const metadata = this.fileRegistry.get(fileId);
    
    if (!metadata) {
      throw new NotFoundException(`File ${fileId} not found`);
    }

    // Check if user has access to this file
    if (metadata.userId !== userId) {
      throw new ForbiddenException(`Access denied to file ${fileId}`);
    }

    this.logger.log(`Retrieving file: ${metadata.path}`);
    return await this.fileManager.getFile(metadata.path);
  }

  async deleteFile(fileId: string, userId: string): Promise<void> {
    const metadata = this.fileRegistry.get(fileId);
    
    if (!metadata) {
      throw new NotFoundException(`File ${fileId} not found`);
    }

    // Check if user has access to this file
    if (metadata.userId !== userId) {
      throw new ForbiddenException(`Access denied to file ${fileId}`);
    }

    this.logger.log(`Deleting file: ${metadata.path}`);
    
    // Delete from storage
    await this.fileManager.deleteFile(metadata.path);
    
    // Remove from registry
    this.fileRegistry.delete(fileId);
    
    this.logger.log(`File ${fileId} deleted successfully`);
  }

  async getFileUrl(fileKey: string): Promise<string> {
    // In a real implementation, this might validate the file exists
    // For now, just generate the URL based on the key
    return this.fileManager.getFileUrl(fileKey);
  }

  private generateFileId(): string {
    return crypto.randomBytes(16).toString('hex');
  }
}