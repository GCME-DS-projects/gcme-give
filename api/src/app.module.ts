import { Module } from '@nestjs/common';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './auth';
import { AppController } from './app.controller';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ContributionModule } from './modules/contribution/contribution.module';
import { MissionariesModule } from './modules/missionaries/missionaries.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { StrategiesModule } from './modules/strategies/strategies.module';

@Module({
  imports: [
    AuthModule.forRoot(auth),
    PrismaModule,
    ContributionModule,
    MissionariesModule,
    ProjectsModule,
    StrategiesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
