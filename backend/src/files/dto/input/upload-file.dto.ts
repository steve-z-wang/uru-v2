import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum FileCategory {
  MEDIA = 'media',
  DOCUMENT = 'document',
}

export class UploadFileDto {
  @ApiProperty({ 
    description: 'File category',
    enum: FileCategory,
    example: FileCategory.MEDIA
  })
  @IsEnum(FileCategory)
  @IsNotEmpty()
  category: FileCategory;
}