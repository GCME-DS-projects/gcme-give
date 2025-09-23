import { Controller, Get, Post, Patch, Delete, Param, Body, Put, UseInterceptors, UploadedFile, BadRequestException, UseGuards } from '@nestjs/common';
import { StrategiesService } from './strategies.service';
import { CreateStrategyDto } from './dto/create-strategy.dto';
import { UpdateStrategyDto } from './dto/update-strategy.dto';
import { FileUploadService } from '../../common/services/file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as nestjsBetterAuth from '@thallesp/nestjs-better-auth';

@Controller('strategies')
export class StrategiesController {
  constructor(
    private readonly strategiesService: StrategiesService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post()
  create(@Body() dto: CreateStrategyDto) {
    return this.strategiesService.create(dto);
  }

  @Get()
  findAll() {
    return this.strategiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.strategiesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStrategyDto) {
    return this.strategiesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.strategiesService.remove(id);
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

    const imagePath = await this.fileUploadService.upload(file, session.user.id, 'strategy', 'strategy');

    return {
      imageUrl: this.fileUploadService.getMediaUrl(imagePath),
    };
  }

}
