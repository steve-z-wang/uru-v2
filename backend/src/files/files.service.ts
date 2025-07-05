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
    
    // Generate unique file ID and get extension
    const fileId = this.generateFileId();
    const path = await import('path');
    const ext = path.extname(file.originalname);
    
    // Use UUID with extension as the filename
    const fileName = `${fileId}${ext}`;
    const filePath = `${userId}/${category}/${fileName}`;

    this.logger.log(`Uploading file to path: ${filePath}`);

    // Upload file using storage abstraction
    const uploadedFile = await this.fileManager.uploadFile(file, filePath);

    // Store metadata in registry (in production, this would be in database)
    const metadata: FileMetadata = {
      id: fileName, // Use filename as ID
      path: filePath,
      userId,
      category,
      originalName: file.originalname,
      uploadedAt: uploadedFile.uploadedAt,
    };
    this.fileRegistry.set(fileName, metadata);

    this.logger.log(`File uploaded successfully with ID: ${fileName}`);

    return {
      id: fileName, // Return the filename which can be used to find the file
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

  async getFileBuffer(fileId: string): Promise<Buffer> {
    const metadata = this.fileRegistry.get(fileId);
    
    if (!metadata) {
      throw new NotFoundException(`File ${fileId} not found`);
    }

    this.logger.log(`Getting file buffer: ${metadata.path}`);
    return await this.fileManager.getFile(metadata.path);
  }

  async getFileAsBase64(fileId: string): Promise<string> {
    const path = await import('path');
    const metadata = this.fileRegistry.get(fileId);
    
    if (!metadata) {
      // Fallback: try to find file by filename pattern
      // Since fileId is now the filename (uuid.extension), we can search for it
      const fs = await import('fs/promises');
      
      try {
        // Search for the file in uploads directory
        const { execSync } = await import('child_process');
        const filePath = execSync(`find uploads -name "${fileId}" -type f | head -1`, { encoding: 'utf8' }).trim();
        
        if (filePath) {
          const buffer = await fs.readFile(filePath);
          const ext = path.extname(fileId).toLowerCase();
          const mimeType = this.getMimeType(ext.slice(1));
          return `data:${mimeType};base64,${buffer.toString('base64')}`;
        }
      } catch (error) {
        this.logger.error(`Failed to find file ${fileId}:`, error);
      }
      
      throw new NotFoundException(`File ${fileId} not found`);
    }

    const buffer = await this.fileManager.getFile(metadata.path);
    const ext = path.extname(fileId).toLowerCase();
    const mimeType = this.getMimeType(ext.slice(1));
    
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
  }

  private getMimeType(extension?: string): string {
    const mimeTypes: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
    };
    return mimeTypes[extension || ''] || 'image/jpeg';
  }

  private generateFileId(): string {
    return crypto.randomBytes(16).toString('hex');
  }
}