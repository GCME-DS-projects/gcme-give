import { Module } from '@nestjs/common';
import { MissionariesService } from './missionaries.service';
import { MissionariesController } from './missionaries.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MissionariesController],
  providers: [MissionariesService],
})
export class MissionariesModule {}
