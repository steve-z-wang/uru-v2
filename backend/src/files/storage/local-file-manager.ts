import { Injectable, Logger } from '@nestjs/common';
import { FileManagerInterface, UploadedFileMetadata } from './file-manager.interface';
import * as fs from 'fs/promises';
import * as path from 'path';
import { AppConfigService } from '../../config/config.service';

@Injectable()
export class LocalFileManager implements FileManagerInterface {
  private readonly logger = new Logger(LocalFileManager.name);
  private readonly baseStoragePath: string;

  constructor(private readonly appConfig: AppConfigService) {
    this.baseStoragePath = path.join(process.cwd(), 'uploads');
    this.ensureStorageDirectory();
  }

  private async ensureStorageDirectory(): Promise<void> {
    try {
      await fs.access(this.baseStoragePath);
    } catch {
      await fs.mkdir(this.baseStoragePath, { recursive: true });
      this.logger.log(`Created storage directory at: ${this.baseStoragePath}`);
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    filePath: string,
  ): Promise<UploadedFileMetadata> {
    const fullPath = path.join(this.baseStoragePath, filePath);
    const directory = path.dirname(fullPath);

    await fs.mkdir(directory, { recursive: true });
    await fs.writeFile(fullPath, file.buffer);

    this.logger.log(`File uploaded to: ${fullPath}`);

    return {
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: filePath,
      uploadedAt: new Date(),
    };
  }

  async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.join(this.baseStoragePath, filePath);
    await fs.unlink(fullPath);
    this.logger.log(`File deleted: ${fullPath}`);
  }

  async getFile(filePath: string): Promise<Buffer> {
    const fullPath = path.join(this.baseStoragePath, filePath);
    return await fs.readFile(fullPath);
  }

  async fileExists(filePath: string): Promise<boolean> {
    const fullPath = path.join(this.baseStoragePath, filePath);
    try {
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }
}