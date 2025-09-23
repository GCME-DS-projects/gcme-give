import { Module } from '@nestjs/common';
import { StrategiesService } from './strategies.service';
import { StrategiesController } from './strategies.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { FileUploadService } from 'src/common/services/file-upload.service';

@Module({
  imports: [PrismaModule],
  controllers: [StrategiesController],
  providers: [StrategiesService, FileUploadService],
})
export class StrategiesModule {}
