import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseInterceptors, UploadedFile, BadRequestException, UseGuards } from '@nestjs/common';
import { MissionariesService } from './missionaries.service';
import { CreateMissionaryDto } from './dto/create-missionary.dto';
import { UpdateMissionaryDto } from './dto/update-missionary.dto';
import { QueryMissionaryDto } from './dto/query-missionary.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/common/services/file-upload.service';
import * as nestjsBetterAuth from '@thallesp/nestjs-better-auth';

@Controller('missionaries')
export class MissionariesController {
  constructor(
    private readonly missionariesService: MissionariesService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post()
  @UseGuards(nestjsBetterAuth.AuthGuard)
  create(@Body() dto: CreateMissionaryDto) {
    return this.missionariesService.create(dto);
  }

  @Post('upload/image')
  @UseGuards(nestjsBetterAuth.AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadMissionaryImage(
    @nestjsBetterAuth.Session() session: nestjsBetterAuth.UserSession,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');

    // Upload image using FileUploadService
    const filePath = await this.fileUploadService.uploadAvatar(file, session.user.id);

    return { imageUrl: this.fileUploadService.getAvatarUrl(filePath) };
  }

  @Get()
  findAll(@Query() query: QueryMissionaryDto) {
    return this.missionariesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.missionariesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMissionaryDto) {
    return this.missionariesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.missionariesService.remove(id);
  }
}
