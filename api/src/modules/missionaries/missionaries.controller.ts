import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseInterceptors, UploadedFile, BadRequestException, UseGuards } from '@nestjs/common';
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
  async create(
    @Body() dto: CreateMissionaryDto,
    @nestjsBetterAuth.Session() session: nestjsBetterAuth.UserSession
  ) {
    // dto.userId = session.user.id;
    return this.missionariesService.create(dto);
  }

  @Post('upload/image')
  @UseGuards(nestjsBetterAuth.AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @nestjsBetterAuth.Session() session: nestjsBetterAuth.UserSession
  ) {
    if (!session?.user?.id) {
      console.error('User session not found or invalid:', session);
      throw new BadRequestException('User session not found. Please login.');
    }

    console.log('Uploaded file:', file);
    if (!file) throw new BadRequestException('No file uploaded');

    const imagePath = await this.fileUploadService.upload(file, session.user.id, 'missionary', 'missionary');
    console.log('Image uploaded to path:', imagePath);
    console.log("image url:", this.fileUploadService.getMediaUrl(imagePath));

    return {
      imageUrl: this.fileUploadService.getMediaUrl(imagePath),
    };
  }

  @Get()
  findAll(@Query() query: QueryMissionaryDto) {
    return this.missionariesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.missionariesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMissionaryDto) {
    return this.missionariesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.missionariesService.remove(id);
  }
}
