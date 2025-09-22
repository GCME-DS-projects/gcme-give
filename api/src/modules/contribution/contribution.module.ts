import { Module } from '@nestjs/common';
import { ContributionsService } from './contribution.service';
import { ContributionsController } from './contribution.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ContributionsController],
  providers: [ContributionsService],
})
export class ContributionModule {}
