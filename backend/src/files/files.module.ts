import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { LocalFileManager } from './storage/local-file-manager';
import { AppConfigModule } from '../config/config.module';

@Module({
  imports: [AppConfigModule],
  controllers: [FilesController],
  providers: [
    FilesService,
    {
      provide: 'FileManagerInterface',
      useClass: LocalFileManager,
    },
  ],
  exports: [FilesService],
})
export class FilesModule {}
