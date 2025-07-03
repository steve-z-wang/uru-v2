import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ListingsModule } from './listings/listings.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, ListingsModule, FilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
