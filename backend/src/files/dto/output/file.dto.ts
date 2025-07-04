import { ApiProperty } from '@nestjs/swagger';

export class FileDto {
  @ApiProperty({ description: 'File identifier' })
  id: string;
}