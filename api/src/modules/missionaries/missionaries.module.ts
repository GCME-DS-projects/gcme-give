import { Module } from '@nestjs/common';
import { MissionariesService } from './missionaries.service';
import { MissionariesController } from './missionaries.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { FileUploadService } from 'src/common/services/file-upload.service';

@Module({
  imports: [PrismaModule],
  controllers: [MissionariesController],
  providers: [
    MissionariesService, 
    FileUploadService,
  ],
})
export class MissionariesModule {}
